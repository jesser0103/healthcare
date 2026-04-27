const path = require("path");

const express = require("express");
const Docker = require("dockerode");

const PORT = Number(process.env.PORT || 3000);
const COMPOSE_PROJECT = process.env.COMPOSE_PROJECT_NAME || "dr";

// Codespaces public URL support
// e.g. CODESPACE_NAME=probable-telegram-r, GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN=app.github.dev
const CODESPACE_NAME = process.env.CODESPACE_NAME || "";
const CS_DOMAIN = process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN || "app.github.dev";

function publicUrl(port) {
  if (CODESPACE_NAME) {
    return `https://${CODESPACE_NAME}-${port}.${CS_DOMAIN}`;
  }
  return `http://localhost:${port}`;
}

const CHAOS_DEFAULT_INTERVAL_MS = Number(process.env.CHAOS_INTERVAL_MS || 180000);
const CHAOS_DEFAULT_DOWNTIME_MS = Number(process.env.CHAOS_DOWNTIME_MS || 30000);

const docker = new Docker({ socketPath: "/var/run/docker.sock" });

const ACTION_SERVICES = new Set([
  "primary-app",
  "secondary-app",
  "nginx",
  "mongo-primary",
  "mongo-secondary",
  "mongo-arbiter",
  "minio-primary",
  "minio-secondary",
  "prometheus",
  "grafana",
  "mongodb-exporter",
  "init-replica",
]);

const CHAOS_TARGET_SERVICES = ["primary-app", "mongo-primary", "minio-primary"];

function clampNumber(value, { min, max, fallback }) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  if (typeof min === "number" && n < min) return min;
  if (typeof max === "number" && n > max) return max;
  return n;
}

function assertAllowedService(service) {
  if (!service || typeof service !== "string") return { ok: false, error: "service is required" };
  if (!ACTION_SERVICES.has(service)) return { ok: false, error: `service not allowed: ${service}` };
  return { ok: true };
}

function composeLabelFilters(extra = []) {
  return {
    label: [
      `com.docker.compose.project=${COMPOSE_PROJECT}`,
      ...extra,
    ],
  };
}

async function listComposeContainers() {
  const containers = await docker.listContainers({
    all: true,
    filters: composeLabelFilters(),
  });

  return containers
    .map((c) => {
      const name = (c.Names && c.Names[0]) ? c.Names[0].replace(/^\//, "") : c.Id.slice(0, 12);
      const service = (c.Labels && c.Labels["com.docker.compose.service"]) || "";
      return {
        id: c.Id,
        name,
        service,
        image: c.Image,
        state: c.State,
        status: c.Status,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

async function getServiceContainer(serviceName) {
  const containers = await docker.listContainers({
    all: true,
    filters: composeLabelFilters([`com.docker.compose.service=${serviceName}`]),
  });

  if (!containers.length) return null;
  return docker.getContainer(containers[0].Id);
}

async function stopService(serviceName) {
  const c = await getServiceContainer(serviceName);
  if (!c) return { ok: false, status: 404, error: `${serviceName} not found` };

  try {
    await c.stop({ t: 0 });
    return { ok: true };
  } catch (err) {
    return { ok: false, status: 500, error: String(err) };
  }
}

async function startService(serviceName) {
  const c = await getServiceContainer(serviceName);
  if (!c) return { ok: false, status: 404, error: `${serviceName} not found` };

  try {
    await c.start();
    return { ok: true };
  } catch (err) {
    return { ok: false, status: 500, error: String(err) };
  }
}

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

const chaosState = {
  running: false,
  intervalMs: CHAOS_DEFAULT_INTERVAL_MS,
  downtimeMs: CHAOS_DEFAULT_DOWNTIME_MS,
  timer: null,
  lastAction: null,
  lastError: null,
};

function chaosPublicState() {
  return {
    running: chaosState.running,
    intervalMs: chaosState.intervalMs,
    downtimeMs: chaosState.downtimeMs,
    lastAction: chaosState.lastAction,
    lastError: chaosState.lastError,
    targets: CHAOS_TARGET_SERVICES,
  };
}

async function chaosTick() {
  const service = pickRandom(CHAOS_TARGET_SERVICES);

  chaosState.lastError = null;
  chaosState.lastAction = {
    service,
    phase: "stopping",
    at: new Date().toISOString(),
  };

  const stopped = await stopService(service);
  if (!stopped.ok) {
    chaosState.lastError = stopped.error;
    chaosState.lastAction = {
      service,
      phase: "stop_failed",
      at: new Date().toISOString(),
      error: stopped.error,
    };
    return;
  }

  setTimeout(async () => {
    const started = await startService(service);
    chaosState.lastAction = {
      service,
      phase: started.ok ? "started" : "start_failed",
      at: new Date().toISOString(),
      error: started.ok ? null : started.error,
    };
    if (!started.ok) chaosState.lastError = started.error;
  }, chaosState.downtimeMs);
}

function startChaos(intervalMs, downtimeMs) {
  // Restart with new config if already running.
  if (chaosState.timer) clearInterval(chaosState.timer);
  chaosState.timer = null;

  chaosState.running = true;
  chaosState.intervalMs = clampNumber(intervalMs ?? chaosState.intervalMs, {
    min: 30000,
    max: 30 * 60 * 1000,
    fallback: CHAOS_DEFAULT_INTERVAL_MS,
  });
  chaosState.downtimeMs = clampNumber(downtimeMs ?? chaosState.downtimeMs, {
    min: 5000,
    max: 10 * 60 * 1000,
    fallback: CHAOS_DEFAULT_DOWNTIME_MS,
  });

  // Ensure downtime isn't longer than the interval.
  if (chaosState.downtimeMs > chaosState.intervalMs) {
    chaosState.downtimeMs = Math.max(5000, Math.floor(chaosState.intervalMs / 2));
  }

  chaosState.lastError = null;
  chaosState.lastAction = { service: null, phase: "started", at: new Date().toISOString() };

  // Run one tick shortly after enabling, then on an interval.
  setTimeout(chaosTick, 1000);
  chaosState.timer = setInterval(chaosTick, chaosState.intervalMs);
}

function stopChaos() {
  if (chaosState.timer) clearInterval(chaosState.timer);
  chaosState.timer = null;
  chaosState.running = false;
  chaosState.lastAction = { service: null, phase: "stopped", at: new Date().toISOString() };
}

async function fetchWithTimeout(url, timeoutMs = 2500) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "manual",
    });
    const text = await res.text().catch(() => "");
    return { ok: res.ok, status: res.status, headers: Object.fromEntries(res.headers.entries()), text };
  } finally {
    clearTimeout(timeout);
  }
}

async function getActiveRegion() {
  try {
    const res = await fetchWithTimeout("http://nginx/health", 2500);
    const header = Object.keys(res.headers).find((k) => k.toLowerCase() === "x-active-region");
    const activeRegion = header ? res.headers[header] : null;
    return { activeRegion, status: res.status, ok: res.ok };
  } catch (err) {
    return { activeRegion: null, status: 0, ok: false, error: String(err) };
  }
}

async function getPrometheusUps() {
  const query = encodeURIComponent('up');
  try {
    const res = await fetchWithTimeout(`http://prometheus:9090/api/v1/query?query=${query}`, 3000);
    if (!res.ok) return { ok: false, error: `prometheus http ${res.status}` };

    const json = JSON.parse(res.text);
    const results = (json?.data?.result || []).map((r) => ({
      job: r.metric?.job || "",
      instance: r.metric?.instance || "",
      value: Number(r.value?.[1] || 0),
    }));

    return { ok: true, results };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

async function getMinioReady() {
  const checks = [
    { name: "minio-primary", url: "http://minio-primary:9000/minio/health/ready" },
    { name: "minio-secondary", url: "http://minio-secondary:9000/minio/health/ready" },
  ];

  const out = [];
  for (const c of checks) {
    try {
      const res = await fetchWithTimeout(c.url, 2500);
      out.push({ name: c.name, ok: res.ok, status: res.status });
    } catch (err) {
      out.push({ name: c.name, ok: false, status: 0, error: String(err) });
    }
  }

  return out;
}

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/status", async (_req, res) => {
  const [active, services, ups, minio] = await Promise.all([
    getActiveRegion(),
    listComposeContainers(),
    getPrometheusUps(),
    getMinioReady(),
  ]);

  res.json({
    project: COMPOSE_PROJECT,
    active,
    services,
    prometheus: ups,
    minio,
    links: {
      nginxHealth: publicUrl(8080) + "/health",
      prometheus: publicUrl(9090),
      grafana: publicUrl(3001),
      minioPrimary: publicUrl(9000),
      minioSecondary: publicUrl(9100),
    },
    chaos: chaosPublicState(),
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/chaos/status", async (_req, res) => {
  res.json({ ok: true, chaos: chaosPublicState() });
});

app.post("/api/chaos/start", async (req, res) => {
  const intervalMs = req.body?.intervalMs;
  const downtimeMs = req.body?.downtimeMs;
  startChaos(intervalMs, downtimeMs);
  res.json({ ok: true, chaos: chaosPublicState() });
});

app.post("/api/chaos/stop", async (_req, res) => {
  stopChaos();
  res.json({ ok: true, chaos: chaosPublicState() });
});

app.post("/api/actions/service/stop", async (req, res) => {
  const service = req.body?.service;
  const allowed = assertAllowedService(service);
  if (!allowed.ok) return res.status(400).json({ ok: false, error: allowed.error });

  const result = await stopService(service);
  if (!result.ok) return res.status(result.status).json({ ok: false, error: result.error });
  return res.json({ ok: true });
});

app.post("/api/actions/service/start", async (req, res) => {
  const service = req.body?.service;
  const allowed = assertAllowedService(service);
  if (!allowed.ok) return res.status(400).json({ ok: false, error: allowed.error });

  const result = await startService(service);
  if (!result.ok) return res.status(result.status).json({ ok: false, error: result.error });
  return res.json({ ok: true });
});

app.post("/api/actions/primary/stop", async (_req, res) => {
  const c = await getServiceContainer("primary-app");
  if (!c) return res.status(404).json({ ok: false, error: "primary-app not found" });

  try {
    await c.stop({ t: 0 });
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

app.post("/api/actions/primary/start", async (_req, res) => {
  const c = await getServiceContainer("primary-app");
  if (!c) return res.status(404).json({ ok: false, error: "primary-app not found" });

  try {
    await c.start();
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

app.post("/api/actions/secondary/stop", async (_req, res) => {
  const c = await getServiceContainer("secondary-app");
  if (!c) return res.status(404).json({ ok: false, error: "secondary-app not found" });

  try {
    await c.stop({ t: 0 });
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

app.post("/api/actions/secondary/start", async (_req, res) => {
  const c = await getServiceContainer("secondary-app");
  if (!c) return res.status(404).json({ ok: false, error: "secondary-app not found" });

  try {
    await c.start();
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

app.post("/api/actions/nginx/restart", async (_req, res) => {
  const c = await getServiceContainer("nginx");
  if (!c) return res.status(404).json({ ok: false, error: "nginx not found" });

  try {
    await c.restart({ t: 2 });
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`DR dashboard listening on :${PORT}`);
});

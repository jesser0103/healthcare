const client = require('prom-client');

const REGION = process.env.REGION || 'unknown';

// Default process metrics (CPU, memory, event loop, etc.)
client.collectDefaultMetrics({
  prefix: 'node_',
  labels: { region: REGION }
});

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'path', 'status_code', 'region']
});

const httpRequestDurationMs = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in milliseconds',
  labelNames: ['method', 'path', 'status_code', 'region'],
  buckets: [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000]
});

function getRouteLabel(req) {
  // Prefer Express route template to avoid high-cardinality metrics.
  const routePath = req.route?.path;
  if (routePath) {
    const base = req.baseUrl || '';
    return `${base}${routePath}` || '/';
  }
  return req.path || '/';
}

function metricsMiddleware(req, res, next) {
  const endTimer = httpRequestDurationMs.startTimer();

  res.on('finish', () => {
    const path = getRouteLabel(req);
    const statusCode = String(res.statusCode);

    httpRequestsTotal.inc({
      method: req.method,
      path,
      status_code: statusCode,
      region: REGION
    });

    endTimer({
      method: req.method,
      path,
      status_code: statusCode,
      region: REGION
    });
  });

  next();
}

async function metricsHandler(req, res) {
  res.set('Content-Type', client.register.contentType);
  const metrics = await client.register.metrics();
  res.end(metrics);
}

module.exports = {
  client,
  metricsMiddleware,
  metricsHandler
};

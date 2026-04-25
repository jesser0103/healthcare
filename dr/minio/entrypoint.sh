#!/usr/bin/env sh
set -eu

ROLE="${MINIO_ROLE:-primary}"
REGION="${REGION:-unknown}"
DATA_DIR="${MINIO_DATA_DIR:-/data}"
BUCKET="${MINIO_BUCKET:-healthcare}"

PRIMARY_ALIAS="primary"
SECONDARY_ALIAS="secondary"
PRIMARY_URL="${MINIO_PRIMARY_URL:-http://minio-primary:9000}"
SECONDARY_URL="${MINIO_SECONDARY_URL:-http://minio-secondary:9000}"

ROOT_USER="${MINIO_ROOT_USER:?MINIO_ROOT_USER required}"
ROOT_PASSWORD="${MINIO_ROOT_PASSWORD:?MINIO_ROOT_PASSWORD required}"

echo "[minio:${ROLE}] starting (region=${REGION})"

# Start server in background so we can bootstrap and (optionally) start mirroring.
minio server "${DATA_DIR}" --console-address ":9001" &
MINIO_PID=$!

# Wait until this node is ready
until curl -fsS "http://127.0.0.1:9000/minio/health/ready" >/dev/null 2>&1; do
  sleep 2
done

mc alias set "${ROLE}" "http://127.0.0.1:9000" "${ROOT_USER}" "${ROOT_PASSWORD}" >/dev/null 2>&1 || true
mc mb --ignore-existing "${ROLE}/${BUCKET}" >/dev/null 2>&1 || true

if [ "${ROLE}" = "primary" ]; then
  echo "[minio:primary] waiting for secondary to be ready for mirroring..."
  until curl -fsS "${SECONDARY_URL}/minio/health/ready" >/dev/null 2>&1; do
    sleep 2
  done

  mc alias set "${PRIMARY_ALIAS}" "${PRIMARY_URL}" "${ROOT_USER}" "${ROOT_PASSWORD}" >/dev/null 2>&1 || true
  mc alias set "${SECONDARY_ALIAS}" "${SECONDARY_URL}" "${ROOT_USER}" "${ROOT_PASSWORD}" >/dev/null 2>&1 || true
  mc mb --ignore-existing "${PRIMARY_ALIAS}/${BUCKET}" >/dev/null 2>&1 || true
  mc mb --ignore-existing "${SECONDARY_ALIAS}/${BUCKET}" >/dev/null 2>&1 || true

  echo "[minio:primary] starting cross-region sync: ${PRIMARY_ALIAS}/${BUCKET} -> ${SECONDARY_ALIAS}/${BUCKET}"
  mc mirror --watch --overwrite "${PRIMARY_ALIAS}/${BUCKET}" "${SECONDARY_ALIAS}/${BUCKET}" &
fi

wait "${MINIO_PID}"

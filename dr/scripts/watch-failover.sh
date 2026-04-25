#!/usr/bin/env sh
set -eu

URL="${1:-http://localhost:8080/health}"

echo "Watching ${URL} (Ctrl+C to stop)"

while true; do
  headers=$(curl -sS -D - -o /tmp/dr_body.json "${URL}" || true)
  active=$(printf "%s" "$headers" | tr -d '\r' | awk -F': ' 'tolower($1)=="x-active-region"{print $2}' | tail -n 1)
  body=$(cat /tmp/dr_body.json 2>/dev/null || echo "")
  ts=$(date -Iseconds)
  printf "%s active=%s body=%s\n" "$ts" "${active:-unknown}" "$body"
  sleep 2
done

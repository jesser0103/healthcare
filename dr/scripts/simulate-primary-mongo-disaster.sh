#!/usr/bin/env sh
set -eu

echo "Stopping mongo-primary (simulate primary DB node outage)..."
docker compose -f dr/docker-compose.yml stop mongo-primary

echo "MongoDB should elect a new PRIMARY automatically (check rs.status())."

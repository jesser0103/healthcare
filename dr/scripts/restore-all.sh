#!/usr/bin/env sh
set -eu

echo "Starting everything back up..."
docker compose -f dr/docker-compose.yml up -d

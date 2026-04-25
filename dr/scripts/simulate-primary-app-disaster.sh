#!/usr/bin/env sh
set -eu

echo "Stopping primary-app (simulate primary region app outage)..."
docker compose -f dr/docker-compose.yml stop primary-app

echo "Done. Run dr/scripts/watch-failover.sh to observe routing." 

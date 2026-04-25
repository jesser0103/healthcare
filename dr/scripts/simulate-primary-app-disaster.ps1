Write-Host "Stopping primary-app (simulate primary region app outage)..."
docker compose -f dr/docker-compose.yml stop primary-app
Write-Host "Done. Run dr/scripts/watch-failover.ps1 to observe routing."

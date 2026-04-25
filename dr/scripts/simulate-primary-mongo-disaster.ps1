Write-Host "Stopping mongo-primary (simulate primary DB node outage)..."
docker compose -f dr/docker-compose.yml stop mongo-primary
Write-Host "MongoDB should elect a new PRIMARY automatically (check rs.status())."

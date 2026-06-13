curl.exe -sS http://localhost:8000/api/v1/health/ -o backend_health.json
if ($LASTEXITCODE -eq 0) { Write-Output 'BACKEND_HEALTH_OK' } else { Write-Output 'BACKEND_HEALTH_FAIL' }

curl.exe -sS http://localhost:3000 -o frontend_index.html
if ($LASTEXITCODE -eq 0) { Write-Output 'FRONTEND_OK' } else { Write-Output 'FRONTEND_FAIL' }

docker-compose -f docker-compose.dev.yml ps 2>&1 | Out-File docker_compose_ps.txt -Encoding utf8

docker ps --format "table {{.ID}}\t{{.Image}}\t{{.Status}}\t{{.Names}}" 2>&1 | Out-File docker_ps.txt -Encoding utf8

docker-compose -f docker-compose.dev.yml logs --no-color --tail=500 2>&1 | Out-File docker_compose_logs.txt -Encoding utf8

Write-Output 'HEALTH_CHECKS_DONE'

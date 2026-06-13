curl.exe -sS http://localhost:8000/api/v1/health/ -o backend_health_latest.json
if ($LASTEXITCODE -eq 0) { Write-Output 'BACKEND_HEALTH_OK' } else { Write-Output 'BACKEND_HEALTH_FAIL' }

curl.exe -sS http://localhost:3000 -o frontend_index_latest.html
if ($LASTEXITCODE -eq 0) { Write-Output 'FRONTEND_OK' } else { Write-Output 'FRONTEND_FAIL' }

docker-compose -f docker-compose.dev.yml ps 2>&1 | Out-File docker_compose_ps_latest.txt -Encoding utf8
if ($LASTEXITCODE -eq 0) { Write-Output 'COMPOSE_PS_OK' } else { Write-Output 'COMPOSE_PS_FAIL' }

Write-Output 'FULL_STACK_VERIFY_DONE'

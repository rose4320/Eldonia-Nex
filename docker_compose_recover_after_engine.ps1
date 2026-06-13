docker-compose -f docker-compose.dev.yml up -d 2>&1 | Out-File docker_compose_after_recovery.txt -Encoding utf8

docker-compose -f docker-compose.dev.yml ps 2>&1 | Out-File docker_compose_ps_after_recovery.txt -Encoding utf8

docker ps --format "table {{.ID}}\t{{.Image}}\t{{.Status}}\t{{.Names}}" 2>&1 | Out-File docker_ps_after_recovery.txt -Encoding utf8

Write-Output 'DOCKER_COMPOSE_RECOVERY_DONE'

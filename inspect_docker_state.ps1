docker ps --format "table {{.ID}}\t{{.Image}}\t{{.Status}}\t{{.Names}}" 2>&1 | Out-File docker_ps.txt -Encoding utf8
Write-Output 'DOCKER_PS_DONE'

docker compose version 2>&1 | Out-File docker_compose_plugin_version.txt -Encoding utf8
Write-Output 'DOCKER_COMPOSE_PLUGIN_VERSION_DONE'

docker-compose version 2>&1 | Out-File docker_compose_legacy_version.txt -Encoding utf8
Write-Output 'DOCKER_COMPOSE_LEGACY_VERSION_DONE'

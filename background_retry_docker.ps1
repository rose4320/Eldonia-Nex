$max = 12
for ($i = 1; $i -le $max; $i++) {
    Write-Output ("[Retry {0}] docker info" -f $i)
    docker info 2>&1 | Out-File -FilePath ("docker_info_retry_{0}.txt" -f $i) -Encoding utf8 -Force
    if ($LASTEXITCODE -eq 0) {
        Write-Output ("[Retry {0}] docker-compose up -d" -f $i)
        docker-compose -f docker-compose.dev.yml up -d 2>&1 | Out-File -FilePath ("docker_compose_retry_{0}.txt" -f $i) -Encoding utf8 -Force
        if ($LASTEXITCODE -eq 0) { Write-Output ("COMPOSE_OK:{0}" -f $i); break }
    }
    Start-Sleep -Seconds 300
}
# create diagnostics archive
$files = Get-ChildItem -Path . -Include 'docker_compose*.txt', 'docker_info*.txt', 'docker_compose_attempt_*.txt', 'docker_info_attempt_*.txt' -File -ErrorAction SilentlyContinue | Select-Object -ExpandProperty FullName
if ($files) { Compress-Archive -Path $files -DestinationPath docker_diagnostics_retry.zip -Force }

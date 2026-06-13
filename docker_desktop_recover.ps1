$logPath = Join-Path $PWD 'docker_recover.log'
"=== Docker Desktop recovery started: $(Get-Date -Format o) ===" | Out-File -FilePath $logPath -Encoding utf8 -Force
"Stopping Docker Desktop processes..." | Out-File -FilePath $logPath -Encoding utf8 -Append
Get-Process -Name 'Docker Desktop' -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Get-Process -Name 'com.docker.backend' -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Get-Process -Name 'com.docker.service' -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
"Shutting down WSL..." | Out-File -FilePath $logPath -Encoding utf8 -Append
wsl --shutdown 2>&1 | Out-File -FilePath $logPath -Encoding utf8 -Append
Start-Sleep -Seconds 5
"Starting Docker Desktop.exe..." | Out-File -FilePath $logPath -Encoding utf8 -Append
Start-Process -FilePath 'C:\Program Files\Docker\Docker\Docker Desktop.exe' -ErrorAction SilentlyContinue
$success = $false
for ($i = 1; $i -le 12; $i++) {
    "[$i] Waiting 15 seconds before checking docker version..." | Out-File -FilePath $logPath -Encoding utf8 -Append
    Start-Sleep -Seconds 15
    $result = docker version 2>&1
    "[$i] docker version result:" | Out-File -FilePath $logPath -Encoding utf8 -Append
    $result | Out-File -FilePath $logPath -Encoding utf8 -Append
    if ($LASTEXITCODE -eq 0) {
        "[$i] docker version succeeded" | Out-File -FilePath $logPath -Encoding utf8 -Append
        $success = $true
        break
    }
}
if ($success) {
    "RECOVERY_RESULT:SUCCESS" | Out-File -FilePath 'docker_recover_result.txt' -Encoding utf8
}
else {
    "RECOVERY_RESULT:FAILURE" | Out-File -FilePath 'docker_recover_result.txt' -Encoding utf8
}
"=== Docker Desktop recovery finished: $(Get-Date -Format o) ===" | Out-File -FilePath $logPath -Encoding utf8 -Append

<#
register-secrets.ps1
Usage: PowerShell -File .\scripts\register-secrets.ps1 -Repo "owner/repo" -EnvFile ".\env.md"

This script reads a simple KEY=VALUE env file and registers each pair as a GitHub Actions secret
for the given repository using the `gh` CLI. It treats SSH_PRIVATE_KEY specially: if a local file
named in SSH_KEY_FILE exists it will use that file's content, otherwise it will use the value found
in the env file (single-line). Multi-line values in env.md are not fully parsed; for multi-line
SSH keys prefer using: gh secret set SSH_PRIVATE_KEY --repo owner/repo --body (Get-Content -Raw .\id_deploy_ed25519)

Notes:
- Requires gh CLI and that the current gh account has admin permission on the target repo.
- The env file must contain lines like: VERCEL_TOKEN=xxx
#>

param(
  [string]$Repo = "rose4320/Eldonia-Nex",
  [string]$EnvFile = ".\env.md"
)

function Ensure-GhAdmin {
  $perms = gh api repos/$Repo --jq .permissions 2>$null | Out-String
  if (-not $perms) {
    Write-Error "Failed to query repository permissions. Ensure 'gh' is installed and authenticated."
    exit 1
  }
  $p = $perms | ConvertFrom-Json
  if (-not $p.admin) {
    Write-Error "Current gh user does not have admin permission on $Repo. Permissions: $perms"
    exit 1
  }
}

function Parse-EnvFile {
  param($Path)
  $map = @{}
  if (-not (Test-Path $Path)) {
    Write-Error "Env file not found: $Path"
    return $null
  }
  $lines = Get-Content $Path -ErrorAction Stop
  foreach ($line in $lines) {
    $s = $line.Trim()
    if (-not $s) { continue }
    if ($s.StartsWith("#")) { continue }
    if ($s -notmatch "=") { continue }
    $idx = $s.IndexOf("=")
    $k = $s.Substring(0, $idx).Trim()
    $v = $s.Substring($idx + 1).Trim()
    # remove surrounding quotes
    if (($v.StartsWith('"') -and $v.EndsWith('"')) -or ($v.StartsWith("'") -and $v.EndsWith("'"))) {
      $v = $v.Substring(1, $v.Length - 2)
    }
    $map[$k] = $v
  }
  return $map
}

function Register-Secret {
  param($name, $value)
  Write-Host "Registering secret: $name"
  gh secret set $name --repo $Repo --body $value
  if ($LASTEXITCODE -ne 0) {
    Write-Warning "Failed to set secret $name"
  }
}

# Main
Ensure-GhAdmin

$kv = Parse-EnvFile -Path $EnvFile
if (-not $kv) { exit 1 }

# If there is a local SSH key file, register it instead of inline value
if (Test-Path .\id_deploy_ed25519) {
  $ssh = Get-Content -Raw .\id_deploy_ed25519
  Register-Secret -name "SSH_PRIVATE_KEY" -value $ssh
  # remove from kv to avoid re-register
  if ($kv.ContainsKey('SSH_PRIVATE_KEY')) { $kv.Remove('SSH_PRIVATE_KEY') }
}

foreach ($key in $kv.Keys) {
  $val = $kv[$key]
  # Skip obvious empty
  if (-not $val) { Write-Warning "Skipping empty value for $key"; continue }
  Register-Secret -name $key -value $val
}

Write-Host "All done. Verify secrets in GitHub repo settings or with: gh secret list --repo $Repo"

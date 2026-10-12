
$ErrorActionPreference = "Stop"

$root = Split-Path $PSScriptRoot -Parent
$k8s = Join-Path $root "kubernetes"

if (-not (Get-Command kubectl -ErrorAction SilentlyContinue)) {
    throw "kubectl is not installed or is not on PATH."
}

$yamlFiles = @(
    Get-ChildItem $k8s -Recurse -File |
        Where-Object { $_.Extension -in ".yaml", ".yml" } |
        Where-Object { $_.Name -ne "secret.yml" }
)

if ($yamlFiles.Count -eq 0) {
    throw "No Kubernetes YAML files were found."
}

$failed = $false

foreach ($file in $yamlFiles) {
    Write-Host "`nValidating $($file.FullName)"

    kubectl apply --dry-run=client -f $file.FullName

    if ($LASTEXITCODE -ne 0) {
        Write-Error "Validation failed for $($file.Name)" -ErrorAction Continue
        $failed = $true
    }
}

if ($failed) {
    throw "One or more Kubernetes manifests failed validation."
}

Write-Host "`nAll selected Kubernetes manifests passed client-side dry-run validation."

$ErrorActionPreference = "Stop"

$root = Split-Path $PSScriptRoot -Parent
$k8s = Join-Path $root "kubernetes"

if (-not (Get-Command kubectl -ErrorAction SilentlyContinue)) {
    throw "kubectl is not installed or is not on PATH."
}

$yamlFiles = Get-ChildItem $k8s -Recurse -Filter *.yaml

if (-not $yamlFiles) {
    throw "No Kubernetes YAML files were found."
}

foreach ($file in $yamlFiles) {
    Write-Host "Validating $($file.FullName)"
    kubectl apply --dry-run=client -f $file.FullName

    if ($LASTEXITCODE -ne 0) {
        throw "Validation failed for $($file.Name)"
    }
}

Write-Host "Client-side validation completed."
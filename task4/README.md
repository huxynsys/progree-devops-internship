# Task 4 — Kubernetes Orchestration and Terraform Infrastructure as Code

## Overview

Task 4 extends the Progree DevOps Internship project by deploying the containerized application to a local Kubernetes cluster and preparing Terraform configuration for infrastructure as code (IaC).

The implementation uses Docker Desktop Kubernetes to run the application locally. Terraform configuration files define an AWS VPC, two subnet resources, and a workload security group. The AWS infrastructure has **not** been provisioned.

## Architecture

The Kubernetes deployment runs in the `progree` namespace.

| Component | Kubernetes resource | Port |
|---|---|---:|
| Frontend | Deployment and ClusterIP Service | 80 |
| Backend API | Deployment and ClusterIP Service | 3000 |
| PostgreSQL | Deployment, ClusterIP Service, PVC | 5432 |
| Redis | Deployment and ClusterIP Service | 6379 |

The frontend is served through Nginx. API requests are forwarded to the backend service. The backend connects to PostgreSQL for persistent data and Redis for caching or application data.

PostgreSQL uses a PersistentVolumeClaim named `postgres-pvc`. Preserve this claim and its underlying data when restarting or updating the environment.

## Prerequisites

- Docker Desktop with Kubernetes enabled
- `kubectl` installed and available on `PATH`
- The Task 2 application images built and available to the local Kubernetes cluster
- PowerShell on Windows
- Terraform CLI 1.5 or later to validate the Terraform configuration

## Kubernetes Deployment

Run these commands from the repository root.

### 1. Check the Kubernetes context

```powershell
kubectl config current-context
kubectl get nodes
```

For the local Docker Desktop environment, the expected context is `docker-desktop`.

### 2. Apply Kubernetes manifests

Apply the namespace first, then the database resources and remaining workloads. The example commands below use the manifest paths in this repository.

```powershell
kubectl apply -f .\task4\kubernetes\base\namespace.yml
kubectl apply -f .\task4\kubernetes\database\pvc.yml
```

Create the application Secret locally before deploying PostgreSQL. Do not apply `secret.example.yaml` or the placeholder `secret.yml` as production credentials.

If the `app-secrets` Secret already exists and contains the required keys, preserve it.

Apply the remaining manifests:

```powershell
kubectl apply -f .\task4\kubernetes\database\deployment.yml
kubectl apply -f .\task4\kubernetes\database\service.yml
kubectl apply -f .\task4\kubernetes\redis\deployment.yaml
kubectl apply -f .\task4\kubernetes\redis\service.yml
kubectl apply -f .\task4\kubernetes\backend\deployment.yml
kubectl apply -f .\task4\kubernetes\backend\service.yaml
kubectl apply -f .\task4\kubernetes\frontend\deployment.yaml
kubectl apply -f .\task4\kubernetes\frontend\service.yaml
```

Wait for the deployments to become available:

```powershell
kubectl rollout status deployment/postgres -n progree
kubectl rollout status deployment/redis -n progree
kubectl rollout status deployment/backend -n progree
kubectl rollout status deployment/frontend -n progree
```

The existing environment has already been deployed and verified. Do not recreate its persistent storage unnecessarily.

## Validation

Run the repository validation script:

```powershell
.\task4\scripts\validate.ps1
```

The script checks Kubernetes manifests with `kubectl apply --dry-run=client`. This is client-side manifest validation; it does not replace a complete deployment test.

Check workload health:

```powershell
kubectl get deployments,services,pods -n progree
```

Check backend logs:

```powershell
kubectl logs deployment/backend -n progree --tail=50
```

## Access the Application

Expose the frontend locally using port forwarding:

```powershell
kubectl port-forward service/frontend 8080:80 -n progree
```

Keep that terminal open. In another PowerShell terminal, test the API:

```powershell
Invoke-RestMethod http://localhost:8080/api/health
```

The expected response reports:

- `status`: `ok`
- `redis`: `connected`
- `database`: `connected`

Open `http://localhost:8080` in a browser to access the frontend.

## Terraform Configuration

Terraform files are located in `task4/terraform/`.

| File | Purpose |
|---|---|
| `versions.tf` | Terraform and AWS provider version constraints |
| `providers.tf` | AWS provider configuration |
| `variables.tf` | AWS region, project name, and VPC CIDR inputs |
| `networks.tf` | VPC, two subnet resources, and workload security group |
| `outputs.tf` | VPC ID, subnet IDs, and security group ID |
| `.gitignore` | Excludes Terraform state, plans, and local provider files |

The configuration describes AWS networking resources; it does not create an EKS cluster or deploy the Kubernetes workloads to AWS.

### Safe Terraform validation

Install Terraform CLI 1.5 or later if it is required for final validation. Then, from the Terraform directory, run:

```powershell
terraform fmt -check
terraform init -backend=false
terraform validate
```

`terraform init -backend=false` initializes the working directory without configuring a remote backend. Initialization and validation do not provision the described AWS infrastructure.

**Do not run `terraform apply` for this local, zero-cost implementation.** The Terraform files are not evidence of deployed AWS infrastructure.

## Autoscaling and Ingress Limitations

### Horizontal Pod Autoscaler

The `backend-hpa.yaml` manifest defines CPU-based autoscaling from one to three replicas with a target average CPU utilization of 70%.

The local cluster did not have a functioning Metrics API during verification. Therefore, the HPA resource was accepted, but CPU utilization could not be measured and autoscaling was not fully verified.

### Ingress

The `ingress.yaml` manifest defines routing for the frontend and backend. The local cluster did not have an Ingress controller installed during verification, so the Ingress routing was not verified.

For local access, use the frontend Service port-forward instead.

## Security and Data Protection

- Keep actual database credentials in a Kubernetes Secret created locally.
- Never commit real credentials, populated `.env` files, Terraform state, or secret values.
- Keep placeholder manifests separate from the active local Secret.
- Preserve the PostgreSQL PersistentVolumeClaim and underlying volume.
- Use narrowly scoped network rules when adapting the Terraform configuration for a real deployment.

## Verified Results

During local verification:

- Backend, frontend, PostgreSQL, and Redis Deployments were available.
- All four application pods were running.
- The selected Kubernetes manifests passed client-side dry-run validation.
- The health endpoint returned `ok`.
- PostgreSQL and Redis both reported `connected`.
- The backend logs reported that the API was running on port 3000.

The CPU-based HPA and Ingress routing remain unverified because their required cluster components were unavailable. Terraform CLI validation and AWS provisioning were not completed.

## Cleanup

Do not delete the PostgreSQL PVC or its underlying storage as part of routine cleanup.

To stop local frontend access, press `Ctrl+C` in the terminal running `kubectl port-forward`.

Remove Kubernetes resources only when the environment is no longer needed and the persistence implications are understood. No AWS infrastructure was provisioned as part of this local implementation.
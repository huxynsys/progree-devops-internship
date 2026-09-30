# Progree DevOps Internship — Task 2

## Application Containerization & Asset Optimization

Objective: Build a modular, reliable application container environment package.

Requirements: Author multi-stage configuration Dockerfiles for a multi-dependency web app runtime stack. Minimize final image layer footprints, map container environment variable configurations securely, and define functional container port routing maps.

This project is part of the **Progree DevOps Internship** program. The objective of this task was to containerize a full-stack application using Docker and Docker Compose, including the frontend, backend, PostgreSQL database, and Redis service.

## 🏗️ Architecture

The application consists of four services:

```text
                    ┌──────────────────┐
                    │     Frontend     │
                    │   React + Nginx  │
                    │      :8080       │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │     Backend      │
                    │   Node.js API    │
                    │      :3000       │
                    └───────┬──────────┘
                            │
                  ┌─────────┴─────────┐
                  │                   │
                  ▼                   ▼
          ┌──────────────┐     ┌──────────────┐
          │  PostgreSQL  │     │    Redis     │
          │   Database   │     │    Cache     │
          └──────────────┘     └──────────────┘
```

## 🚀 Technologies Used

* **Docker**
* **Docker Compose**
* **Node.js**
* **React**
* **Nginx**
* **PostgreSQL**
* **Redis**
* **npm**
* **Git & GitHub**

## 📁 Project Structure

```text
progree-devops-internship/
│
├── backend/
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│   ├── Dockerfile
│   └── nginx.conf
│
├── .dockerignore
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
```

## 🐳 Docker Implementation

### Backend

The backend is containerized using Node.js and runs the application on port `3000`.

The Dockerfile uses a production-oriented dependency installation:

```dockerfile
RUN npm ci --omit=dev
```

The application starts using:

```dockerfile
CMD ["node", "src/server.js"]
```

### Frontend

The frontend uses a **multi-stage Docker build**.

The first stage builds the frontend application:

```text
Node.js → npm install → npm run build
```

The second stage uses Nginx to serve the generated production files:

```text
Build output → Nginx
```

This keeps the final frontend image smaller by excluding the Node.js build environment from the production container.

### PostgreSQL

PostgreSQL runs as a dedicated Docker Compose service.

A named Docker volume is used to persist database data:

```yaml
volumes:
  postgres_data:
```

This allows database data to survive container recreation.

### Redis

Redis runs as a separate service and is available to the backend through the Docker Compose network.

## 🔗 Service Communication

Docker Compose provides an internal network that allows services to communicate using their service names.

For example, the backend can communicate with PostgreSQL and Redis using:

```text
postgres
redis
```

rather than using `localhost`.

The backend is configured through environment variables such as:

```text
DATABASE_URL
REDIS_URL
```

## 🔐 Environment Variables

Sensitive configuration is not committed to the repository.

The project uses an `.env` file for local configuration, while `.env.example` provides a template that can safely be committed to Git.

Example:

```env
POSTGRES_DB=your_database
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password

DATABASE_URL=postgresql://your_user:your_password@postgres:5432/your_database

REDIS_URL=redis://redis:6379
```

> **Note:** Never commit real passwords, API keys, tokens, or other secrets to Git.

## ⚙️ Running the Project

### 1. Clone the repository

```bash
git clone https://github.com/huxynsys/progree-devops-internship.git
cd progree-devops-internship
```

### 2. Create the environment file

Copy `.env.example` to `.env`:

**PowerShell:**

```powershell
Copy-Item .env.example .env
```

Update the values in `.env` according to your local configuration.

### 3. Build the Docker images

```bash
docker compose build
```

### 4. Start the application

```bash
docker compose up -d
```

### 5. Check running containers

```bash
docker compose ps
```

### 6. View logs

```bash
docker compose logs
```

To view logs for a specific service:

```bash
docker compose logs backend
docker compose logs frontend
docker compose logs postgres
docker compose logs redis
```

### 7. Stop the application

```bash
docker compose down
```

To stop the containers while keeping PostgreSQL data:

```bash
docker compose down
```

## 🔍 Verification

The Docker setup can be verified using:

```bash
docker compose config
```

This validates the resolved Docker Compose configuration.

Running containers can be inspected with:

```bash
docker compose ps
```

Docker images can be inspected using:

```bash
docker images
```

Image history can be inspected using:

```bash
docker history <image-name>
```

## 🩺 Health Checks

PostgreSQL is configured with a health check so that dependent services can wait for the database to become ready.

This helps prevent the backend from attempting to connect to PostgreSQL before the database is available.

## 📦 Docker Best Practices Implemented

The project follows several Docker best practices:

* Separate containers for separate services
* Docker Compose for multi-container orchestration
* Multi-stage Docker build for the frontend
* Production dependency installation
* `.dockerignore` to reduce unnecessary build context
* `.gitignore` to prevent unnecessary and sensitive files from being committed
* Environment variables for configuration
* Persistent PostgreSQL storage using a named volume
* Service-to-service communication through Docker's internal network
* PostgreSQL health check
* Nginx for serving the production frontend

## 🧹 Git and Docker Ignore Files

The repository includes:

### `.gitignore`

Used to prevent files such as:

```text
node_modules/
.env
dist/
coverage/
*.log
```

from being committed to Git.

### `.dockerignore`

Used to prevent unnecessary files from being sent to the Docker build context.

This helps reduce build time and image build context size.

## 📚 What I Learned

Through this task, I gained practical experience with:

* Containerizing Node.js applications
* Containerizing frontend applications
* Creating Dockerfiles
* Multi-stage Docker builds
* Docker Compose
* Container networking
* PostgreSQL containers
* Redis containers
* Docker volumes
* Environment variable management
* Nginx configuration
* Docker health checks
* Docker image inspection
* Git and `.gitignore` configuration
* Running and troubleshooting multi-container applications

## 🎯 Task Outcome

The application has been successfully containerized using Docker and Docker Compose.

The final setup provides an environment where the frontend, backend, PostgreSQL, and Redis services can be built and managed together using Docker Compose.


# Task 3 — Multi-Stage Automated CI/CD Deployment Pipeline

## 📌 Overview

Task 3 focuses on implementing an automated **CI/CD pipeline** using **GitHub Actions** for the containerized application developed in Task 2.

The purpose of this task is to ensure that every push or pull request to the main development branches automatically goes through a series of validation stages, including:

- Dependency installation
- Static code analysis and linting
- Backend unit testing
- Frontend unit testing
- Frontend production build
- Docker image builds
- Docker Compose configuration validation
- CI execution status reporting

This automation helps detect code, build, configuration, and integration issues before changes are considered ready for further deployment or orchestration.

---

## 🎯 Task Objectives

The main objectives of Task 3 were:

1. Configure an automated CI/CD workflow using GitHub Actions.
2. Automatically trigger the pipeline when code is pushed to the repository.
3. Support pull request validation.
4. Install backend and frontend dependencies automatically.
5. Perform static code analysis using ESLint.
6. Execute automated backend tests.
7. Execute automated frontend tests.
8. Build the frontend production bundle.
9. Build Docker images for the backend and frontend.
10. Validate the Docker Compose configuration.
11. Display Docker image information in the CI logs.
12. Generate a GitHub Actions job summary containing pipeline status information.
13. Keep CI configuration independent from local environment secrets.

---

# 🏗️ CI/CD Architecture

The CI pipeline follows this general workflow:

```text
                    Git Push / Pull Request
                              │
                              ▼
                    ┌─────────────────────┐
                    │  GitHub Actions     │
                    │  CI/CD Pipeline     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Checkout Repository  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Setup Node.js 22     │
                    └──────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ▼                     ▼
             Backend CI             Frontend CI
                    │                     │
                    ▼                     ▼
              npm ci                  npm ci
                    │                     │
                    ▼                     ▼
               ESLint                 ESLint
                    │                     │
                    ▼                     ▼
              Node Tests              Vitest
                    │                     │
                    └──────────┬──────────┘
                               │
                               ▼
                    Frontend Production Build
                               │
                               ▼
                    Backend Docker Image Build
                               │
                               ▼
                    Frontend Docker Image Build
                               │
                               ▼
                    Docker Compose Validation
                               │
                               ▼
                    Docker Image Information
                               │
                               ▼
                    GitHub Actions Summary
````

---

# 🛠️ Technologies Used

| Technology          | Purpose                                          |
| ------------------- | ------------------------------------------------ |
| GitHub Actions      | CI/CD automation                                 |
| Node.js 22          | JavaScript runtime used by CI                    |
| npm                 | Dependency installation and script execution     |
| ESLint              | Static code analysis                             |
| Node.js Test Runner | Backend automated testing                        |
| Supertest           | Backend HTTP endpoint testing                    |
| Vitest              | Frontend automated testing                       |
| JSDOM               | Browser-like test environment for frontend tests |
| Vite                | Frontend production build                        |
| Docker              | Application containerization                     |
| Docker Compose      | Multi-service configuration validation           |
| GitHub Step Summary | CI execution reporting                           |

---

# 📁 CI/CD Workflow

The GitHub Actions workflow is located at:

```text
.github/
└── workflows/
    └── ci-cd.yml
```

The workflow is named:

```yaml
name: CI/CD Pipeline
```

It runs automatically for:

```yaml
on:
  push:
    branches:
      - main
      - master

  pull_request:
    branches:
      - main
      - master
```

Therefore, the pipeline is executed whenever changes are pushed to the `main` or `master` branches and when pull requests target those branches.

---

# 🔄 Pipeline Stages

## 1. Repository Checkout

The pipeline first checks out the latest repository contents using:

```yaml
- name: Checkout repository
  uses: actions/checkout@v4
```

This provides the GitHub Actions runner with the source code required for all subsequent stages.

---

## 2. Node.js Environment Setup

The workflow uses Node.js 22:

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: 22
```

npm dependency caching is also configured using the backend and frontend lock files:

```yaml
cache: npm
cache-dependency-path: |
  backend/package-lock.json
  frontend/package-lock.json
```

This helps reduce dependency installation time between workflow executions.

---

# 🔵 Backend CI

The backend is located in:

```text
backend/
```

The pipeline performs three primary backend validation stages.

## 3. Backend Dependency Installation

Dependencies are installed using:

```yaml
- name: Install backend dependencies
  working-directory: ./backend
  run: npm ci
```

`npm ci` provides a clean and reproducible dependency installation based on the committed `package-lock.json`.

---

## 4. Backend Linting

ESLint is executed using:

```yaml
- name: Lint backend
  working-directory: ./backend
  run: npm run lint
```

The backend contains the following npm script:

```json
"lint": "eslint ."
```

This performs static analysis on the backend source code and helps detect common JavaScript problems before the code proceeds through the remaining pipeline stages.

---

## 5. Backend Automated Testing

Backend tests are executed using:

```yaml
- name: Test backend
  working-directory: ./backend
  run: npm test
```

The backend uses Node.js's built-in test runner:

```json
"test": "node --test"
```

The HTTP API is tested using **Supertest**.

The current automated test verifies the API endpoint:

```text
GET /api
```

and confirms that it returns the expected API status response.

Example test structure:

```javascript
test("GET /api should return API status", async () => {
  const response = await request(app)
    .get("/api")
    .expect(200);

  assert.strictEqual(
    response.body.message,
    "Progree DevOps API is running"
  );
});
```

This provides automated verification that the backend application is responding correctly.

---

# 🟢 Frontend CI

The frontend is located in:

```text
frontend/
```

The frontend pipeline performs dependency installation, linting, testing, and production building.

---

## 6. Frontend Dependency Installation

Frontend dependencies are installed using:

```yaml
- name: Install frontend dependencies
  working-directory: ./frontend
  run: npm ci
```

The command uses the committed `package-lock.json` to provide a reproducible installation.

---

## 7. Frontend Linting

ESLint is executed using:

```yaml
- name: Lint frontend
  working-directory: ./frontend
  run: npm run lint
```

The frontend npm script is:

```json
"lint": "eslint ."
```

The ESLint configuration is located at:

```text
frontend/eslint.config.js
```

The configuration checks JavaScript source files while excluding generated directories such as:

```text
node_modules/
dist/
coverage/
```

---

## 8. Frontend Automated Testing

Frontend tests are executed using:

```yaml
- name: Test frontend
  working-directory: ./frontend
  run: npm test
```

The frontend uses:

```json
"test": "vitest run"
```

Vitest is configured to use JSDOM through:

```text
frontend/vite.config.js
```

Configuration:

```javascript
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    environment: "jsdom",
  },
});
```

The frontend test verifies the health-check button functionality and confirms that the response from the backend health endpoint is displayed correctly.

The test mocks the `fetch()` API and validates that the returned system status is rendered in the interface.

---

# 🏭 Frontend Production Build

After frontend linting and testing succeed, the production frontend is built using:

```yaml
- name: Build frontend
  working-directory: ./frontend
  run: npm run build
```

The build uses Vite:

```json
"build": "vite build"
```

The generated production files are placed in:

```text
frontend/dist/
```

The production build is later used by the Nginx-based frontend Docker image created in Task 2.

---

# 🐳 Docker Image Validation

The CI pipeline also verifies that the application's Docker images can be built successfully.

This connects the automated CI process with the containerization work completed in Task 2.

---

## 9. Backend Docker Image

The backend image is built using:

```yaml
- name: Build backend Docker image
  run: docker build -t progree-backend:ci ./backend
```

The image is tagged as:

```text
progree-backend:ci
```

This confirms that the backend Dockerfile remains buildable after code changes.

---

## 10. Frontend Docker Image

The frontend image is built using:

```yaml
- name: Build frontend Docker image
  run: docker build -t progree-frontend:ci ./frontend
```

The image is tagged as:

```text
progree-frontend:ci
```

This validates the multi-stage frontend Docker build introduced in Task 2.

---

# 🔗 Docker Compose Validation

The complete multi-service Docker Compose configuration is validated using:

```yaml
- name: Validate Docker Compose
  run: docker compose config
```

The Compose configuration contains the application's primary services:

```text
frontend
backend
postgres
redis
```

The CI environment provides safe CI-only values for variables required by the Compose configuration.

Example:

```yaml
env:
  FRONTEND_PORT: 8080
  BACKEND_PORT: 3000
  NODE_ENV: test
  DATABASE_URL: postgresql://ci_user:ci_password@postgres:5432/ci_db
  REDIS_URL: redis://redis:6379
  POSTGRES_DB: ci_db
  POSTGRES_USER: ci_user
  POSTGRES_PASSWORD: ci_password
```

These values are only used for CI configuration validation and are not production credentials.

---

# 📦 Docker Image Information

The pipeline displays the Docker images available on the GitHub Actions runner:

```yaml
- name: Display Docker images
  run: docker images
```

This provides additional execution information in the GitHub Actions logs.

---

# 📊 CI Execution Summary

The pipeline generates a GitHub Actions summary using:

```text
$GITHUB_STEP_SUMMARY
```

The workflow records the overall job status:

```yaml
echo "**Overall status:** ${{ job.status }}" >> "$GITHUB_STEP_SUMMARY"
```

The summary provides a quick overview of the CI execution directly inside the GitHub Actions interface.

This complements the detailed step-by-step logs generated automatically by GitHub Actions.

---

# 🔐 CI/CD Security and Environment Configuration

Sensitive environment configuration is not hard-coded into the application source code.

The repository uses:

```text
.env
```

for local environment configuration, while:

```text
.env.example
```

provides an example configuration template.

The `.gitignore` file prevents local environment files from being committed:

```gitignore
.env
.env.*
!.env.example
```

Therefore:

* `.env` remains local.
* `.env.example` can be safely committed.
* CI uses dedicated non-production values for configuration validation.
* Production credentials are not included in the workflow.

---

# 🧪 Local CI Verification

Before pushing changes to GitHub, the individual CI stages were also tested locally.

## Backend

```powershell
cd backend

npm ci
npm run lint
npm test
```

The backend linting completed successfully and the automated API test passed.

---

## Frontend

```powershell
cd frontend

npm ci
npm run lint
npm test
npm run build
```

The frontend linting, automated test, and production build completed successfully.

The frontend test result was:

```text
Test Files  1 passed (1)
Tests       1 passed (1)
```

The Vite production build also completed successfully.

---

# 🚀 GitHub Actions Execution

The pipeline was pushed to the repository and executed through GitHub Actions.

The successful workflow execution is represented by:

```text
CI/CD Pipeline #3
```

The workflow completed successfully after correcting the initial workflow configuration and adding the required linting and testing infrastructure.

Earlier failed executions were caused by the initial CI configuration and missing frontend/backend validation scripts. The corrected workflow successfully completed the CI stages.

---

# 📋 Final CI/CD Pipeline

The final pipeline performs the following sequence:

```text
1. Checkout repository
2. Setup Node.js 22
3. Install backend dependencies
4. Lint backend
5. Test backend
6. Install frontend dependencies
7. Lint frontend
8. Test frontend
9. Build frontend
10. Build backend Docker image
11. Build frontend Docker image
12. Validate Docker Compose
13. Display Docker images
14. Generate GitHub Actions summary
```

---

# 📁 Relevant Project Structure

```text
progree_devops_internship/
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml
│
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── test/
│   │   └── api.test.js
│   │
│   ├── Dockerfile
│   ├── eslint.config.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   └── app.js
│   │
│   ├── test/
│   │   └── app.test.js
│   │
│   ├── Dockerfile
│   ├── eslint.config.js
│   ├── vite.config.js
│   ├── package.json
│   └── package-lock.json
│
├── docker-compose.yml
├── .dockerignore
├── .env.example
└── .gitignore
```

---

# ✅ Task 3 Completion Checklist

* [x] GitHub Actions workflow created
* [x] Automated push trigger configured
* [x] Pull request trigger configured
* [x] Node.js 22 configured
* [x] Backend dependency installation automated
* [x] Backend ESLint configured
* [x] Backend linting automated
* [x] Backend automated testing implemented
* [x] Supertest configured
* [x] Frontend dependency installation automated
* [x] Frontend ESLint configured
* [x] Frontend linting automated
* [x] Vitest configured
* [x] JSDOM configured
* [x] Frontend automated testing implemented
* [x] Frontend production build automated
* [x] Backend Docker image build automated
* [x] Frontend Docker image build automated
* [x] Docker Compose configuration validation automated
* [x] CI-only environment variables configured
* [x] Docker image information displayed in CI logs
* [x] GitHub Actions execution summary implemented
* [x] Successful GitHub Actions pipeline execution verified

---

# 🎓 Skills Demonstrated

Through Task 3, the following DevOps and software engineering practices were implemented:

* Continuous Integration
* GitHub Actions workflow automation
* Automated testing
* Static code analysis
* Reproducible npm dependency installation
* Frontend build automation
* Docker image build automation
* Docker Compose validation
* Environment configuration management
* CI security practices
* Automated execution reporting
* Git-based development workflow
* Integration of application testing with containerization

---

## 🔮 Relation to Task 4

Task 3 establishes the automated CI foundation for the project.

The next stage, **Task 4 — Automated Infrastructure as Code and Orchestration**, will extend the project toward infrastructure provisioning and container orchestration using technologies such as:

* Terraform
* Kubernetes / Minikube
* Persistent Volumes and Persistent Volume Claims
* Kubernetes Services
* Ingress
* Horizontal Pod Autoscaler (HPA)

The CI pipeline created in Task 3 provides automated validation of the application and container images before progressing toward Kubernetes-based orchestration and infrastructure automation.

```

### One important wording point

I intentionally call this **CI/CD Pipeline** because that is the assignment's terminology and your workflow is named `CI/CD Pipeline`, but the implementation currently focuses on **continuous integration and container build validation**. It does **not** claim that Docker images are pushed to a registry or that the application is deployed to a production environment. That distinction makes your README technically accurate and defensible during internship evaluation.
```

---

## 👨‍💻 Author

**Lal Hussain**

**Progree DevOps Internship — 2026**

---

## 📄 License

This project was created as part of the Progree DevOps Internship program and is intended for educational purposes.

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

---

## 👨‍💻 Author

**Lal Hussain**

**Progree DevOps Internship — 2026**

---

## 📄 License

This project was created as part of the Progree DevOps Internship program and is intended for educational purposes.

# Progree DevOps Internship

This repository contains the deliverables for Tasks 2, 3, and 4. Each task has its
own folder for its source or documentation:

| Task | Focus | Details |
|---|---|---|
| Task 2 | Application containerization and asset optimization | [Task 2 README](task2/README.md) |
| Task 3 | Automated CI validation with GitHub Actions | [Task 3 README](task3/README.md) |
| Task 4 | Kubernetes orchestration and Terraform configuration | [Task 4 README](task4/README.md) |

## Repository layout

```text
.
├── task2/                  # Backend and frontend application
├── task3/                  # Task 3 documentation
├── task4/                  # Kubernetes and Terraform files
├── .github/workflows/      # Active GitHub Actions workflow
├── docker-compose.yml      # Root-level Compose entry point
└── .env.example            # Shared local environment template
```

The Compose file and active GitHub Actions workflow remain at the repository root
to preserve their existing commands and GitHub's workflow discovery requirements.
Their build and test paths point to the application under `task2/`.

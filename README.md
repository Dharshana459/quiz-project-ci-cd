# MERN Stack Quiz Platform

A premium Quiz Platform built with the MERN stack, featuring role-based access control, instant scoring, and containerization support for CI/CD with AWS.

## Features

- **Premium UI**: Dark-themed glassmorphism design with smooth animations.
- **Role-Based Access**: Dedicated dashboards for Users and Admins.
- **User Module**: Register, Login, View Quizzes, Take Quiz (with timer), and Score History.
- **Admin Module**: Manage Quizzes, Manage Questions, and View Platform Stats.
- **Containerized**: Dockerfiles and Docker Compose ready.
- **Security Scanning**: AWS CodeBuild `buildspec.yml` integrated with Trivy scanning.

## Tech Stack

- **Frontend**: React.js, Vite, Axios, React Icons, React Toastify.
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, Bcrypt.
- **DevOps**: Docker, Docker Compose, AWS CodeBuild.

## Local Development

### 1. Backend
```bash
cd backend
npm install
npm run dev
```
*Environment variables are in `backend/.env`. Default admin: `admin@quiz.com` / `admin123`*

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

## Docker Deployment
```bash
docker-compose up --build
```

## CI/CD & Security
The `buildspec.yml` file is designed for AWS CodeBuild. It:
1. Installs **Trivy** for container vulnerability scanning.
2. Builds Docker images for both services.
3. Performs a security scan on the images.
4. (Optional) Pushes images to Amazon ECR.

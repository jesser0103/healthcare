# 🏥 Healthcare System & Disaster Recovery (DR) Architecture

This document provides a comprehensive overview of how the Healthcare Management System works and how to run both the core application and the Disaster Recovery (DR) Control Dashboard.

---

## 1. 🏗️ How Everything Works

The project is divided into two major components: the **Core Application** and the **Disaster Recovery (DR) Environment**.

### 🔹 The Core Application
The core system is a full-stack web application designed for healthcare management.
- **Frontend (React/Vite)**: Runs the User Interface (Doctor Dashboard, Patient Portal). Uses Material-UI for design and Axios for API communication.
- **Backend (Node.js/Express)**: Provides RESTful APIs, handles business logic, JWT authentication, and connects to the database.
- **Database (MongoDB)**: Stores users, patients, prescriptions, and medical records. 

### 🔹 The Disaster Recovery (DR) Environment
Located in the `dr/` folder, this is a complex, multi-container simulation designed to test the resilience and failover capabilities of the healthcare application.
- **Primary & Secondary Apps**: Two instances of the backend application simulate a multi-region deployment.
- **Nginx Load Balancer**: Routes traffic to the primary app. If the primary fails, Nginx can fail over to the secondary app.
- **MongoDB Replica Set**: A Primary, Secondary, and Arbiter database setup ensures that if the primary database goes down, the secondary immediately takes over (High Availability).
- **MinIO (Primary/Secondary)**: Simulates S3-compatible cloud storage for medical documents with redundancy.
- **Prometheus & Grafana**: Collects system metrics and visualizes them on a "Live Metrics" dashboard.
- **DR Control Dashboard**: A custom Node.js/Express app (`dr/dashboard/server.js`) that uses the Docker API to control the state of all containers. It features a **Chaos Monkey** that randomly stops and starts infrastructure components to test resilience.

---

## 2. 🚀 How to Run the Project

You can choose to run just the standard development environment or the full Disaster Recovery simulation.

### Option A: Standard Development Mode (App Only)
If you just want to develop or test the application normally:

1. **Run the Setup Script** (One-time setup to install dependencies and start MongoDB):
   - **Windows**: Double-click `setup.bat` or run `.\setup.bat`
   - **Mac/Linux**: Run `./setup.sh`
2. **Start Backend**:
   ```bash
   cd backend
   npm run dev
   ```
3. **Start Frontend** (in a new terminal):
   ```bash
   cd frontend
   npm run dev
   ```
4. **Access the App**: Open `http://localhost:3001` in your browser.

---

### Option B: Disaster Recovery (DR) Full Deployment
To run the highly available infrastructure, including the fully Dockerized frontend and DR Control Dashboard:

1. **Start the Entire Infrastructure**:
   Open a terminal, navigate to the `dr/` folder, and spin up the entire cluster using Docker Compose.
   ```bash
   cd dr
   docker-compose up -d --build
   ```
   *This starts the Nginx Gateway, React Frontend, MongoDB Replica Set, MinIO, Prometheus, Grafana, and the Primary/Secondary Backend Apps.*

2. **Start the DR Control Dashboard**:
   Open a new terminal and run the custom dashboard backend.
   ```bash
   cd dr/dashboard
   npm install   # If you haven't installed dependencies yet
   node server.js
   ```

3. **Access the Application & Dashboards**:
   - **The Healthcare App**: Access the fully deployed, load-balanced application at `http://localhost:8080`. (Nginx automatically serves the React UI and proxies `/api` to the backends).
   - **DR Control Dashboard**: `http://localhost:3000` (Use this to stop/start services manually or enable Chaos Monkey).
   - **Live Grafana Metrics**: The Grafana dashboard is embedded within the DR Control Dashboard (via the "Live Metrics" button) or accessible directly at `http://localhost:3001`.

---

## 3. 🐒 Testing with Chaos Monkey
Once the DR system is running, you can test its resilience:
1. Open the **DR Control Dashboard** (`http://localhost:3000`).
2. Toggle the **Chaos Monkey** switch to ON.
3. The dashboard will automatically and randomly start taking down critical infrastructure components (like `mongo-primary`, `primary-app`, or `minio-primary`).
4. Click **Live Metrics** to watch how Prometheus and Grafana track the downtime.
5. Watch the system automatically failover to secondary components without losing data!

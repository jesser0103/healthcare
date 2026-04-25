# 🛠️ Ensemble of Technologies & Chaos Monkey Guide

This document explains the complete technology stack used across the Healthcare System and the Disaster Recovery (DR) environment. It also provides a deep dive into the custom "Chaos Monkey" implementation used for testing system resilience.

---

## 1. 🧩 The Ensemble of Technologies (Tech Stack)

The system relies on a modern, robust ensemble of technologies that work together to provide a highly available, full-stack application.

### 🌐 Frontend (Client-Side)
- **React 18**: The core UI library used for building interactive components.
- **Vite**: A lightning-fast build tool and development server.
- **Material-UI (MUI)**: A comprehensive component library used for the sleek, responsive design.
- **Axios**: HTTP client for communicating with the backend APIs.

### ⚙️ Backend (Server-Side)
- **Node.js & Express**: The runtime and web framework used to build the RESTful API.
- **JWT (JSON Web Tokens)**: Used for secure, stateless user authentication and role-based access control (Doctor vs. Patient).
- **Bcrypt**: Used for hashing user passwords before storing them in the database.

### 🗄️ Database & Storage
- **MongoDB**: A NoSQL database used to store users, medical records, and prescriptions.
- **MongoDB Replica Set**: In the DR environment, MongoDB is clustered with a Primary, Secondary, and Arbiter node. This ensures automatic database failover.
- **MinIO**: High-performance, S3-compatible object storage. Used to simulate cloud storage for medical documents, configured with both a primary and secondary instance.

### 🚦 Infrastructure, Routing & Containers
- **Docker & Docker Compose**: The entire DR system is containerized, ensuring that it runs consistently across any environment.
- **Nginx**: Acts as a reverse proxy and load balancer. It actively monitors the health of the backend apps and automatically reroutes traffic to the secondary app if the primary app goes down.

### 📊 Monitoring & Observability
- **Prometheus**: A time-series database that continuously scrapes metrics from the Docker containers, Nginx, and MongoDB.
- **Grafana**: A visualization dashboard that reads data from Prometheus to display "Live Metrics" on system health, uptime, and traffic.

### 🕹️ DR Control Dashboard
- **Dockerode**: A Node.js library used by the custom DR Dashboard to communicate directly with the Docker Daemon via `/var/run/docker.sock`. This allows the dashboard to programmatically stop, start, and monitor containers.

---

## 2. 🐒 Chaos Monkey Deep Dive

### What is Chaos Monkey?
Originally popularized by Netflix, **Chaos Monkey** is a principle of Chaos Engineering. It is a script that intentionally introduces failures into your system to ensure that your automated recovery mechanisms (like load balancers and database replica sets) actually work as expected.

### How Our Chaos Monkey Works
Built directly into the `dr/dashboard/server.js`, our custom Chaos Monkey operates automatically once toggled on. 

Here is its exact operational flow:

1. **The Targets**: Chaos Monkey is specifically programmed to target critical infrastructure points:
   - `primary-app`: The main Node.js backend.
   - `mongo-primary`: The primary database node.
   - `minio-primary`: The primary object storage node.

2. **The Execution Loop**:
   - Every **Interval** (configurable, default is 3 minutes), the Chaos Monkey wakes up.
   - It randomly selects one of the target services.
   - It sends a command via the Docker API to **STOP** that container, simulating a server crash or network partition.

3. **The Downtime**:
   - The selected service remains offline for a set **Downtime** period (configurable, default is 30 seconds).
   - *This is where the magic happens:* During this downtime, **Nginx** will detect the dead `primary-app` and route user traffic to the `secondary-app`. If `mongo-primary` was killed, the MongoDB Arbiter will immediately vote the `mongo-secondary` to become the new primary, keeping the application online.

4. **The Recovery**:
   - Once the downtime expires, Chaos Monkey sends a command to **START** the container back up.
   - The infrastructure automatically heals: Nginx resumes routing to the primary app, and MongoDB re-syncs the revived node.

### How to use Chaos Monkey
1. Open the DR Control Dashboard (`http://localhost:3000`).
2. Locate the **Chaos Engineering** panel.
3. Toggle the **Chaos Monkey** switch.
4. You can adjust the **Interval (ms)** and **Downtime (ms)** directly from the UI.
5. Click the **Live Metrics** button at the top of the dashboard to open the full-screen Grafana UI and watch your system gracefully handle the chaos in real-time!

<div align="center">

# 🏥 Enhanced Healthcare Management System

[![Node.js Version](https://img.shields.io/badge/Node.js-18.x-green.svg?logo=node.js)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-18.x-61dafb.svg?logo=react)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Replica_Set-47A248.svg?logo=mongodb)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**A comprehensive, highly resilient healthcare application built for modern medical facilities.**  
Features include robust authentication, real-time video consultations, prescription management, billing, and a sophisticated Disaster Recovery (DR) architecture.

[Explore the Docs](#-architecture-overview) · [Report Bug](#-contact) · [Request Feature](#-contact)

</div>

---

## 📑 Table of Contents

- [About The Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#%EF%B8%8F-tech-stack)
- [Architecture Overview](#-architecture-overview)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Disaster Recovery & Chaos Engineering](#-disaster-recovery--chaos-engineering)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 About The Project

The Enhanced Healthcare Management System is designed to bridge the gap between patients and healthcare providers. It provides a seamless experience for booking appointments, conducting video consultations, managing prescriptions, and processing payments. 

What sets this project apart is its enterprise-grade **Disaster Recovery (DR)** setup. It simulates a multi-region environment using isolated Docker networks, ensuring zero data loss and minimal downtime through active-passive failover and real-time database replication.

## ✨ Key Features

- **🔐 Secure Authentication:** JWT-based auth with bcrypt password hashing.
- **⚕️ Patient & Doctor Portals:** Dedicated interfaces for managing appointments, lab tests, and medical records.
- **📹 Telemedicine:** Real-time video consultations powered by Socket.IO.
- **💳 Integrated Billing:** Secure payment processing via Stripe.
- **📩 Notifications:** Email (Nodemailer) and SMS (Twilio) alerts for appointments and billing.
- **📁 File Management:** Secure file uploads for medical records and lab results using Multer.
- **📈 Live Analytics:** Real-time metrics and charts using Recharts and Prometheus.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 (Vite)
- **UI Library:** Material-UI (MUI) v5
- **Routing:** React Router v6
- **Data Visualization:** Recharts
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (with Mongoose ODM)
- **Real-time:** Socket.IO
- **Payments:** Stripe API
- **Monitoring:** prom-client

### Infrastructure & DR
- **Load Balancing:** Nginx / OpenResty
- **Containerization:** Docker & Docker Compose
- **Database Replication:** MongoDB 3-Node Replica Set

---

## 📐 Architecture Overview

Our architecture is built for maximum resilience and high availability:

1. **Traffic Routing:** Nginx acts as an API gateway, directing traffic to active backend nodes.
2. **Database Replication:** A 3-node MongoDB replica set guarantees zero data loss and handles automatic failover.
3. **Application Failover:** Instant rerouting of API traffic if the primary backend goes down.
4. **Network Isolation:** Three isolated Docker networks simulate multi-region deployments.

*(For detailed visual diagrams, please refer to [ARCHITECTURE_DIAGRAMS.md](./ARCHITECTURE_DIAGRAMS.md))*

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

- **Node.js** (v18.x recommended)
- **Docker** and **Docker Compose**
- **Git**

### Installation

1. **Clone the repository** (if not already cloned)
   ```bash
   git clone <your-repo-url>
   cd healthcare
   ```

2. **Run the automated setup script**
   ```bash
   # This will install all dependencies and start the MongoDB replica set
   bash setup.sh
   ```

3. **Start the Development Servers**

   *Open two separate terminal windows.*

   **Terminal 1 (Backend):**
   ```bash
   cd backend
   npm run dev
   ```

   **Terminal 2 (Frontend):**
   ```bash
   cd frontend
   npm run dev
   ```

4. **Access the Application**
   Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite in Terminal 2).

---

## 🧪 Disaster Recovery & Chaos Engineering

To truly test the resilience of this application, we've included a **Chaos Monkey** script.

1. Ensure all services (Frontend, Backend, and MongoDB via Docker) are running.
2. Monitor the live traffic and observability dashboards.
3. Simulate a disaster by manually stopping the `mongo-primary` or `primary-app` container.
4. Watch the automatic failover mechanisms recover the system within seconds (Sub-15s RTO).

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the ISC License. See `LICENSE` for more information.

---

<div align="center">
  <i>Built with ❤️ for modern healthcare.</i>
</div>

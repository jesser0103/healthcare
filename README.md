<div align="center">

# 🏥 Enhanced Healthcare System: Cloud & Disaster Recovery Edition

[![Node.js Version](https://img.shields.io/badge/Node.js-18.x-green.svg?logo=node.js)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-18.x-61dafb.svg?logo=react)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Replica_Set-47A248.svg?logo=mongodb)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Multi--Region-2496ED.svg?logo=docker)](https://www.docker.com/)
[![Grafana](https://img.shields.io/badge/Grafana-Observability-F46800.svg?logo=grafana)](https://grafana.com/)
[![Nginx](https://img.shields.io/badge/Nginx-Load_Balancer-009639.svg?logo=nginx)](https://nginx.org/)
[![MinIO](https://img.shields.io/badge/MinIO-Object_Storage-C7202C.svg?logo=minio)](https://min.io/)

**An enterprise-grade healthcare platform built with a heavily customized Cloud and Disaster Recovery (DR) architecture.**  
This repository doesn't just run an app—it simulates a highly available, multi-region cloud deployment complete with active-passive failover, real-time database replication, distributed object storage, and a dedicated Chaos Engineering control plane.

[Explore the Architecture](#-cloud-infrastructure--disaster-recovery) · [View Metrics](#-observability-stack-grafana--prometheus)

</div>

---

## 📑 Table of Contents

- [About The Application](#-about-the-application)
- [Cloud Infrastructure & Disaster Recovery](#%EF%B8%8F-cloud-infrastructure--disaster-recovery)
  - [Multi-Region Simulation](#multi-region-simulation)
  - [Nginx Load Balancing & Auto-Failover](#nginx-load-balancing--auto-failover)
  - [MongoDB Replica Set](#mongodb-replica-set)
  - [MinIO Cross-Region Storage](#minio-cross-region-storage)
- [Observability Stack (Grafana & Prometheus)](#-observability-stack-grafana--prometheus)
- [Chaos Engineering Dashboard](#-chaos-engineering-dashboard)
- [Getting Started](#-getting-started)

---

## 🌟 About The Application

At its core, this is a comprehensive healthcare management system featuring:
- **Authentication:** JWT-based auth with bcrypt.
- **Telemedicine:** Real-time video consultations via Socket.IO.
- **Patient/Doctor Portals:** Manage appointments, prescriptions, and medical records.
- **Billing & Notifications:** Stripe API for payments, Nodemailer/Twilio for alerts.

## ☁️ Cloud Infrastructure & Disaster Recovery

The true power of this project lies in its `dr/docker-compose.yml` infrastructure stack, which deploys **12 interconnected containers** across 3 isolated networks to simulate an enterprise cloud environment.

### Multi-Region Simulation
- **Primary Region (`US-East-1`):** Runs the `primary-app` on the `primary-network`.
- **Secondary Region (`EU-West-1`):** Runs the `secondary-app` on the `secondary-network`.
- **Network Isolation:** Apps cannot communicate directly with each other, mimicking strict AWS/GCP VPC boundaries.

### Nginx Load Balancing & Auto-Failover
- **OpenResty (Nginx)** acts as the global API Gateway (Port `8080`).
- It constantly monitors the health of the `primary-app`.
- If the primary region goes down, Nginx **instantly and automatically routes traffic** to the `secondary-app` (Active-Passive failover), resulting in zero downtime for the frontend.

### MongoDB Replica Set
- Deployed as a **3-node cluster** (Primary, Secondary, Arbiter) on a dedicated `replication-net`.
- Achieves **Zero Data Loss** via Oplog replication.
- If the `mongo-primary` crashes, the nodes hold an automatic election, promoting the Secondary to Primary with a sub-15 second Recovery Time Objective (RTO).

### MinIO Cross-Region Storage
- Simulates AWS S3 object storage for X-Rays, MRI scans, and profile pictures.
- Two MinIO instances run concurrently (`minio-primary` and `minio-secondary`), continuously syncing buckets across regions.

---

## 📊 Observability Stack (Grafana & Prometheus)

To prove the Disaster Recovery is working in real-time, the system includes a heavy observability stack:
- **Prometheus:** Scrapes metrics directly from the Node.js apps and a Percona MongoDB Exporter.
- **Grafana (Port `3001`):** Pre-provisioned with custom dashboards visualizing:
  - HTTP Request Latency (p50, p95, p99).
  - MongoDB Replica Set states and oplog lag.
  - Container CPU/Memory utilization.
  - Active failover states.

---

## 🐒 Chaos Engineering Dashboard

Built specifically for this project, the custom **DR Control Dashboard** (Port `3005`) acts as our Chaos Monkey.
- It maps the Docker socket `/var/run/docker.sock` to a Node.js interface.
- With the click of a button, you can assassinate the `mongo-primary` or the `primary-app`.
- Watch Grafana and the Frontend as the system automatically detects the failure and heals itself.

---

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js (v18.x recommended)

### One-Click Cloud Launch
To spin up the entire multi-region cluster, database replica set, MinIO, Nginx, and Grafana:

```bash
cd dr
docker-compose up -d
```

### Ports Reference
Once running, you can access the infrastructure on the following ports:
- **`8080`** - Frontend & Global Nginx Gateway
- **`3001`** - Grafana Observability Dashboards
- **`3005`** - Chaos Engineering / DR Control Dashboard
- **`9000`** - MinIO Primary Storage Console
- **`9100`** - MinIO Secondary Storage Console

---

<div align="center">
  <i>Built with ❤️ to demonstrate enterprise resilience and zero-downtime architecture.</i>
</div>

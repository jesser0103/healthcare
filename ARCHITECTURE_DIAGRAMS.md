# 🏥 Visual Architecture & Disaster Recovery Breakdown

This document visually breaks down how traffic flows through your Healthcare Application and how the Disaster Recovery (DR) mechanisms automatically heal the system.

## 1. 🚦 End-to-End Traffic Flow

When a doctor or patient uses the application, the traffic flows through a central load balancer (Nginx). Nginx acts as an API Gateway, serving the React UI directly and routing data requests (`/api`) to the backend apps.

```mermaid
flowchart TD
    User([👨‍⚕️ User Browser]) -->|1. Gets UI (Port 8080)| Nginx{{🌐 Nginx API Gateway}}
    User -->|2. Calls /api| Nginx
    
    Nginx -->|Serves React Code| React[🖥️ Dockerized Frontend]

    subgraph "Simulated Multi-Region Compute"
        Nginx -->|Routes API Traffic| App1[💻 Primary App\nNode.js]
        Nginx -.->|Standby/Failover| App2[💻 Secondary App\nNode.js]
    end

    subgraph "High Availability Storage"
        App1 --> MongoPrimary[(🗄️ MongoDB Primary)]
        App2 --> MongoPrimary
        App1 --> MinioPrimary[📁 MinIO Primary\nFile Storage]
        App2 --> MinioPrimary
    end
```

---

## 2. 🗄️ Database Replication & Zero Data Loss

To prevent data loss if a server crashes, MongoDB is deployed as a **Replica Set**. All writes go to the Primary, which instantly copies the data to the Secondary.

```mermaid
flowchart LR
    App[💻 Backend Node.js] -->|Reads & Writes| Primary[(👑 Primary Node\nmongo-primary)]
    
    subgraph "MongoDB Replica Set (rs0)"
        Primary -->|Replicates Data| Secondary[(💾 Secondary Node\nmongo-secondary)]
        Arbiter((⚖️ Arbiter Node\nNo Data)) -.->|Watches Health| Primary
        Arbiter -.->|Watches Health| Secondary
    end
```

---

## 3. 💥 Disaster Recovery: Database Failover (Election)

If the `mongo-primary` container is killed by the Chaos Monkey (or a real server crash), the Node.js app temporarily loses connection. Within milliseconds, the remaining nodes vote to promote the Secondary to be the new Primary.

```mermaid
sequenceDiagram
    participant Primary as 👑 Primary (Crashes)
    participant Secondary as 💾 Secondary
    participant Arbiter as ⚖️ Arbiter
    participant App as 💻 Node.js App

    Note over Primary: 💥 Primary server goes down!
    App--xPrimary: Connection Lost
    Secondary->>Arbiter: I lost contact with Primary. Start Election!
    Arbiter->>Secondary: I vote for you!
    Note over Secondary: Secondary gets majority votes (2/3)
    Secondary-->>Secondary: Promoted to New Primary 👑
    App->>Secondary: Reconnects automatically (Zero Data Loss)
```

---

## 4. 🔀 Disaster Recovery: Application Failover

If the entire Primary Region (the `primary-app` container) crashes, Nginx detects the failure via its health checks and instantly starts routing all backend API traffic to the `secondary-app`. The user never sees an error.

```mermaid
flowchart TD
    User([👨‍⚕️ User Browser]) --> Nginx{{🌐 Nginx}}
    
    subgraph "Compute Layer"
        App1[💥 Primary App\nCRASHED]
        App2[✅ Secondary App\nTakes Over]
    end

    Nginx -.->|Health Check Fails| App1
    Nginx ==>|Instantly Reroutes API Traffic| App2
    App2 --> Database[(MongoDB)]
```

---

## 5. 📊 The Observability Stack (Metrics)

How do you know the DR is working? The observability stack constantly scrapes data from the containers and creates visual graphs.

```mermaid
flowchart TD
    subgraph "Data Sources (Your Apps)"
        App1[Node.js App]
        Nginx[Nginx]
        Mongo[MongoDB Exporter]
    end

    Prometheus[(📉 Prometheus\nTime-Series DB)] -->|Scrapes Metrics every 10s| App1
    Prometheus -->|Scrapes Metrics every 10s| Nginx
    Prometheus -->|Scrapes Metrics every 10s| Mongo

    Grafana[📊 Grafana Dashboard] -->|Queries| Prometheus
    
    Admin([👨‍💻 System Admin]) -->|Views| Grafana
```

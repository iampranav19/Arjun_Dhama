# Full-Stack Deployment Automation Platform

A backend deployment automation system built using **Node.js, Express, MongoDB, BullMQ, Redis, and Worker architecture**.

This project simulates a hosting platform control panel where deployment requests are processed asynchronously using queues and background workers.

---

# Architecture

```txt
Client
   ↓
Express API
   ↓
MongoDB
   ↓
BullMQ Queue
   ↓
Redis
   ↓
Worker
```

---

# Features Implemented

- REST API using Express.js
- MongoDB deployment persistence
- BullMQ queue integration
- Redis-backed asynchronous job processing
- Worker-based deployment lifecycle handling
- Deployment status tracking
- Async architecture for long-running tasks

---

# Deployment Lifecycle

```txt
Pending
   ↓
Running
   ↓
Completed
```

Possible failure state:

```txt
Failed
```

---

# Tech Stack

| Layer | Technology |
|---|---|
| Backend API | Express.js |
| Database | MongoDB |
| Queue System | BullMQ |
| Queue Broker | Redis |
| Background Workers | Node.js |
| ORM | Mongoose |

---

# Project Structure

```txt
project-root/
│
├── server/
│   ├── models/
│   │   └── Deployment.js
│   │
│   ├── routes/
│   │   └── deployRoutes.js
│   │
│   ├── queue.js
│   ├── index.js
│   ├── .env
│   └── package.json
│
├── worker/
│   ├── index.js
│   ├── .env
│   └── package.json
│
└── README.md
```

---

# APIs

## 1. Create Deployment

### Endpoint

```http
POST /api/deploy
```

### Description

Creates a deployment request and pushes the deployment job into BullMQ queue.

### Request Body

```json
{
  "clientName": "Acme",
  "domain": "acme.test.com",
  "image": "nginx:latest"
}
```

### Response

```json
{
  "success": true,
  "deploymentId": "6a129c88fe60a828abe6b166",
  "status": "Pending"
}
```

---

## 2. Get Deployment Status

### Endpoint

```http
GET /api/status/:id
```

### Description

Returns the current deployment status.

### Response

```json
{
  "_id": "6a129c88fe60a828abe6b166",
  "clientName": "Acme",
  "domain": "acme.test.com",
  "image": "nginx:latest",
  "status": "Completed"
}
```

---

# Queue Flow

```txt
POST /api/deploy
        ↓
Save Deployment in MongoDB
        ↓
Add Job to BullMQ Queue
        ↓
Redis stores queue job
        ↓
Worker consumes job
        ↓
Update Deployment Status
```

---

# Worker Responsibilities

The worker service:

- Consumes BullMQ jobs
- Fetches deployment records from MongoDB
- Updates deployment status
- Simulates deployment execution
- Marks deployment as completed

---

# Environment Variables

## Server `.env`

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/deployments
```

---

## Worker `.env`

```env
MONGO_URI=mongodb://127.0.0.1:27017/deployments
```

---

# Installation

## 1. Clone Repository

```bash
git clone <repo-url>
```

---

## 2. Install Backend Dependencies

```bash
cd server
npm install
```

---

## 3. Install Worker Dependencies

```bash
cd ../worker
npm install
```

---

# Running Redis

Start Redis using Docker:

```bash
docker run -d --name redis -p 6379:6379 redis
```

---

# Run Backend Server

Inside `server/`:

```bash
npm run dev
```

---

# Run Worker

Inside `worker/`:

```bash
node index.js
```

---

# Current Working Flow

1. Client sends deployment request
2. API stores deployment in MongoDB
3. Deployment job pushed into BullMQ queue
4. Redis stores queue job
5. Worker processes deployment asynchronously
6. Deployment status updated from:
   - Pending
   - Running
   - Completed

---

# Future Improvements

Upcoming implementation phases:

- SSH into EC2
- Execute Docker commands remotely
- Pull Docker images dynamically
- Run Docker containers on EC2
- AWS Lambda integration using AWS SDK v3
- React frontend dashboard
- Live deployment status polling
- WebSocket-based real-time updates
- Deployment logs
- Retry failed deployments

---

# Why Queue-Based Architecture?

Deployment operations are long-running tasks and should not block the HTTP request-response lifecycle.

Using BullMQ + Redis allows:

- Asynchronous processing
- Scalability
- Worker isolation
- Better fault tolerance
- Improved API responsiveness

---

# Current Status

✅ Express API  
✅ MongoDB Integration  
✅ BullMQ Queue  
✅ Redis Integration  
✅ Worker Architecture  
✅ Async Job Processing  
✅ Deployment Status Tracking

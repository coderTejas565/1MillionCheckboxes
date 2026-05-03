# 1 Million Checkboxes (Real-Time System)

A real-time collaborative checkbox system built to demonstrate **WebSockets, Redis Pub/Sub, JWT Authentication, custom rate limiting, and scalable backend architecture**.

---

## Project Overview

This project simulates a large-scale real-time system where multiple users interact with a shared checkbox grid. Any update made by one user is reflected instantly across all connected clients.

It is designed to demonstrate:

* Real-time communication using WebSockets
* Distributed state management using Redis
* Authentication using JWT (OIDC-inspired flow)
* Custom rate limiting without external libraries
* Scalable backend architecture design

---

## System Architecture

```
Client (Browser)
   ↓ (JWT Auth)
Socket.io Connection
   ↓
Node.js + Express Server
   ↓
Redis (State Storage + Pub/Sub)
   ↓
Broadcast to all connected clients
```

### Key Design Idea:

* Redis acts as a **central sync layer**
* WebSockets handle **real-time communication**
* JWT ensures **secure user identity**
* Rate limiting protects against **spam actions**

---

## Tech Stack

### Frontend

* HTML
* CSS
* Vanilla JavaScript
* Socket.io Client

### Backend

* Node.js
* Express.js
* Socket.io
* JWT (jsonwebtoken)
* bcrypt

### Database & Infra

* PostgreSQL (user storage)
* Redis (state + pub/sub)
* Docker (for services)

---

## Features

### Authentication

* Signup & Login system
* Password hashing using bcrypt
* JWT-based authentication
* Protected socket connections

---

### Real-Time System

* Checkbox updates in real-time
* WebSocket-based communication
* Multi-user synchronization
* Cross-tab updates

---

### Distributed Architecture

* Redis Pub/Sub for multi-server sync
* Shared global checkbox state
* Scalable event propagation

---

### Custom Rate Limiting

* Built without external libraries
* Per-user rate limiting using Redis
* Prevents spam clicking
* Time-window based restriction

---

### Frontend Features

* Responsive checkbox grid
* Auto state hydration from backend
* Real-time UI updates
* Login/logout flow

---

## Authentication Flow

1. User signs up or logs in
2. Server validates credentials
3. JWT token is generated
4. Token stored in browser (localStorage)
5. Token sent via Socket.io handshake
6. Backend verifies token on connection
7. User identity (userId) is attached to socket

---

## WebSocket Flow

1. Client connects with JWT token
2. Server authenticates socket
3. User interacts with checkbox
4. Event sent to backend
5. Backend updates Redis state
6. Redis publishes event
7. All servers receive update
8. All clients update UI in real-time

---

## Rate Limiting Logic

* Each user is assigned a Redis key:

  ```
  rate-limiting:{userId}
  ```

* On every checkbox change:

  * Check last action timestamp
  * If within cooldown window → reject event
  * Otherwise update timestamp

---

## Redis Usage

Redis is used for:

### 1. Global State Storage

```
checkbox-statev1
```

### 2. Pub/Sub Communication

```
internal-server:checkbox:change
```

### 3. Rate Limiting

```
rate-limiting:{userId}
```

---

## Environment Variables

Create `.env` file:

```env
PORT=8021
JWT_SECRET=your_secret_key
DATABASE_URL=postgresql://admin:admin@localhost:5432/oidc_auth
```

---

## Docker Setup (Redis + PostgreSQL)

```yaml
services:
  redis:
    image: redis
    ports:
      - 6379:6379

  postgres:
    image: postgres:17
    restart: unless-stopped
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: admin
      POSTGRES_DB: oidc_auth
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

---

##  How to Run Locally

### 1. Install dependencies

```bash
npm install
```

### 2. Start Docker services

```bash
docker compose up -d
```

### 3. Run backend server

```bash
node index.js
```

### 4. Open frontend

```
http://localhost:8021
```

---

## Demo Flow (Important for Evaluation)

1. Open `/login.html`
2. Signup / Login
3. Redirect to main app
4. Checkbox grid loads
5. Toggle checkbox
6. Open second tab → real-time sync
7. Show logout

---

## Key Learning Outcomes

This project demonstrates:

* Real-time system design
* WebSocket architecture
* Redis-based distributed systems
* Authentication & authorization flow
* Custom rate limiting implementation
* Scalable backend thinking

---

## Future Improvements

* Refresh token system
* Horizontal scaling with load balancer
* Optimistic UI updates
* Persistent event logs
* Better UI (React version)

---

## Author

Built as a learning project to master:

* Backend development
* System design fundamentals
* Real-time distributed systems

---

# Final Note

This is not just a UI project — it demonstrates **how real-time distributed systems are designed in production environments**.

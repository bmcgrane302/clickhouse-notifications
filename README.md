# ClickHouse Notification System (Take-Home Challenge)

A small full-stack application that demonstrates a **decoupled notification service** reacting to state changes in a mock ClickHouse organization service. The system simulates:

- Organizations  
- Users  
- Services  
- Lifecycle changes (start/stop/schedule delete)  
- Email notifications (mocked)  
- In-app notifications  
- Real-time WebSocket streaming  


## 📦 Project Structure

```
clickhouse-notifications/
│
├── mock-clickhouse-api/
│   └── src/
│       ├── routes/
│       ├── server.ts
│       └── mockClickhouseData.ts
│
├── notification-service/
│   └── src/
│       ├── routes/
│       ├── services/
│       ├── store/
│       └── websocket.ts
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── types/
│       └── App.tsx
│
└── docker-compose.yml
```

---

## 🧪 Mock Data

**File:** `mock-clickhouse-api/src/mockClickhouseData.ts`

```ts
export type Organization = { id: string; name: string };
export type OrgUser = { id: string; email: string; name: string; orgId: string };
export type Service = {
  id: string;
  name: string;
  status: 'running' | 'stopped';
  region: string;
  orgId: string;
};

export const ORGANIZATIONS = [
  { id: 'org-1', name: 'Test ClickHouse Org' },
  { id: 'org-2', name: 'Beta ClickHouse Org' }
];

export const ORG_USERS = [
  { id: 'user-1', email: 'user1@example.com', name: 'Brian McGrane', orgId: 'org-1' },
  { id: 'user-2', email: 'user2@example.com', name: 'Jane Doe', orgId: 'org-1' },
  { id: 'user-3', email: 'user3@example.com', name: 'Alice Smith', orgId: 'org-2' },
  { id: 'user-4', email: 'user4@example.com', name: 'Bob Johnson', orgId: 'org-2' }
];

export const SERVICES = [
  { id: 'svc-101', name: 'Analytics Cluster', status: 'running', region: 'us-east-1', orgId: 'org-1' },
  { id: 'svc-102', name: 'Reporting Cluster', status: 'running', region: 'eu-west-1', orgId: 'org-1' },
  { id: 'svc-103', name: 'Batch Ingest', status: 'stopped', region: 'us-west-2', orgId: 'org-1' },
  { id: 'svc-201', name: 'Data Warehouse', status: 'running', region: 'us-central-1', orgId: 'org-2' },
  { id: 'svc-202', name: 'Real-time Analytics', status: 'stopped', region: 'eu-central-1', orgId: 'org-2' }
];
```

---

## 🔐 Login Instructions

This application uses a **mocked authentication system** for demonstration purposes. No real authentication is required.

### How to Login:

1. Navigate to http://localhost:5173
2. Enter any email address from the mock data (see below)
3. Click "Login" - no password required!

### Valid Mock User Emails:

- `user1@example.com` - Brian McGrane (org-1)
- `user2@example.com` - Jane Doe (org-1)
- `user3@example.com` - Alice Smith (org-2)
- `user4@example.com` - Bob Johnson (org-2)

**Note:** You can use any of these email addresses to simulate different users and see notifications scoped to their respective organizations.

---

## 🚀 Running Locally (Without Docker)

**Requires Node 20+.** Open three terminals:

### 1️⃣ Start Mock ClickHouse API

```bash
cd mock-clickhouse-api
npm install
npm run dev
```

➡️ http://localhost:5000

### 2️⃣ Start Notification Service

```bash
cd notification-service
npm install
npm run dev
```

➡️ http://localhost:4000

### 3️⃣ Start Frontend

```bash
cd frontend
npm install
npm run dev
```

➡️ http://localhost:5173

---

## 🐳 Running With Docker Compose

Start everything:

```bash
docker-compose up --build
```

### Service endpoints:

| Service | URL |
|---------|-----|
| Mock ClickHouse API | http://localhost:5000 |
| Notification Service | http://localhost:4000 |
| Frontend | http://localhost:5173 |

### Docker internal service names:

- `mock-clickhouse-api`
- `notification-service`

---

## 🧪 Simulating Notifications (Postman / Curl)

### 1. Toggle a service inside the Mock API

```bash
curl -X POST http://localhost:5000/services/svc-101/toggle
```

### 2. Trigger the Notification Service manually

```bash
curl -X POST http://localhost:4000/notify/service-change \
  -H "Content-Type: application/json" \
  -d '{
        "orgId": "org-1",
        "serviceId": "svc-101",
        "changeType": "STOPPED",
        "changedBy": "admin@example.com"
      }'
```

### Expected behavior:

- UI receives real-time WebSocket notification
- Notification appears in "Notifications" panel
- Console prints mock email log

---

## 🧠 Design Overview

### ✔ Decoupled Notification Service

Frontend never touches ClickHouse API directly.

**Steps:**

1. User triggers "Start / Stop / Schedule Delete"
2. Mock ClickHouse API updates local service state
3. Frontend notifies Notification Service
4. Notification Service enriches the event:
   - Fetch org users
   - Fetch service metadata
5. Message is fanned out via:
   - In-app store
   - WebSockets
   - Mock Email

### ✔ WebSocket Integration

Each user joins a room:

```ts
io.to(user.id).emit("notification", payload);
```

Keeps notifications scoped to affected users.

### ✔ In-App Notification Store

The Notification Service stores:

- unread/read state
- timestamps
- all persisted notifications

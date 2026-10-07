# SentinelFraud AI — Real-Time Financial Fraud Intelligence

---

## 1. Project Overview

**SentinelFraud AI** is a real-time financial fraud detection system. It analyses transactions and accounts to calculate risk scores, detect fraud rings, and give recommended actions (Allow / Monitor / Review / Block). The project has a **Node.js + Express + MongoDB backend** and a **React + Vite frontend**.

---

## 2. Requirements

Install these tools before anything else:

| Tool | Download Link |
|------|---------------|
| **Node.js** (v18 or later) | https://nodejs.org |
| **MongoDB Community Server** | https://www.mongodb.com/try/download/community |
| **Git** | https://git-scm.com/download/win |
| **VS Code** | https://code.visualstudio.com |

> After installing Node.js, restart your PC and verify with `node -v` and `npm -v` in any terminal.

---

## 3. Download the Project

### Option A — Clone with Git (recommended)

Open **Command Prompt** or **PowerShell** anywhere and run:

```bash
git clone https://github.com/ajaycladwin/-Real-Time-Financial-Fraud-Intelligence-.git
```

This creates a folder called `-Real-Time-Financial-Fraud-Intelligence-`.

### Option B — Download ZIP

1. Go to https://github.com/ajaycladwin/-Real-Time-Financial-Fraud-Intelligence-
2. Click the green **Code** button → **Download ZIP**
3. Extract the ZIP to any folder on your laptop

---

## 4. Project Setup

After downloading, the folder structure looks like this:

```
-Real-Time-Financial-Fraud-Intelligence-/
├── Backend/
│   ├── models/
│   ├── services/
│   ├── server.js
│   ├── seed.js
│   └── package.json
└── Frontend/
    ├── src/
    ├── index.html
    ├── vite.config.js
    └── package.json
```

Open the root folder in **VS Code**, then use **Terminal → New Terminal** to open a terminal inside VS Code.

---

## 5. MongoDB Setup

### Start MongoDB

Open any terminal and run:

```bash
mongod
```

Leave this terminal open. MongoDB must stay running in the background.

> If `mongod` is not recognized, add MongoDB's `bin` folder to your system PATH.
> Guide: https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/

### Create the `.env` file

Inside the **`Backend/`** folder, create a file named exactly `.env` (no other extension).

Paste this content into it:

```
MONGO_URI=mongodb://127.0.0.1:27017/frauddb
PORT=5000
```

- `frauddb` is the database name — MongoDB creates it automatically on first run.
- `PORT=5000` is the port the backend API listens on.
- **Do not share this file or commit it to GitHub.**

---

## 6. Run Backend

Open a terminal in VS Code and run:

```bash
cd Backend
npm install
npm start
```

You should see:

```
MongoDB connected successfully!
Server running on http://localhost:5000
```

> Keep this terminal open the entire time. Closing it stops the backend.

---

## 7. Run Frontend

Open a **second terminal** (Terminal → New Terminal in VS Code) and run:

```bash
cd Frontend
npm install
npm run dev
```

You should see:

```
  VITE v8.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

---

## 8. Open the Website

Open your browser and visit:

**http://localhost:5173**

The frontend automatically forwards all `/api` requests to the backend at `http://localhost:5000` — no extra configuration needed.

> The backend terminal (Step 6) must stay running while you use the site.

---

## 9. Quick Troubleshooting

**MongoDB not running**
```
MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017
```
→ Run `mongod` in a terminal and leave it open, then restart the backend.

---

**`npm` or `node` not recognized**
```
'npm' is not recognized as an internal or external command
```
→ Re-install Node.js from https://nodejs.org and restart your PC.

---

**Frontend cannot connect to backend (blank page / API errors)**

- Confirm the backend is running: visit http://localhost:5000 — it should show `{"message":"Backend is working!"}`
- Make sure `Backend/.env` exists with `PORT=5000`
- Make sure `mongod` is running

---

## 10. Quick Start

Once MongoDB is running, use these commands every time you want to start the project:

**Terminal 1 — Backend:**
```bash
cd Backend
npm start
```

**Terminal 2 — Frontend:**
```bash
cd Frontend
npm run dev
```

Then open **http://localhost:5173** in your browser. ✅

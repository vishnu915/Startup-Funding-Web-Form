# 🚀 Capital Startup Funding Application Platform

### 💼 *Fueling DeepTech, Fintech & Future Innovation*

A full-stack **Startup Funding Web Application** for structured deal intake, investor-grade screening, and pipeline creation.

---

## 📌 Project Overview

This platform enables startups to apply for funding and allows investors to review structured, high-quality data.

✔ Multi-step form (11 sections)
✔ File uploads (Pitch Deck, Docs)
✔ Smart filtering & scoring
✔ MySQL structured storage

---

## 🏗️ Tech Stack

**Frontend**

* React.js (Vite + TypeScript)
* Tailwind CSS
* React Hook Form + Zod

**Backend**

* Node.js + Express.js
* Multer (file uploads)

**Database**

* MySQL (Direct connection via `db.js`)

---

## 📁 Project Structure

```
capital-spark-main/
├── backend/
│   ├── controller.js
│   ├── routes.js
│   ├── db.js   <-- DB CONFIG HERE
│   ├── server.js
│   └── uploads/
│
├── frontend/
│   └── src/
│
└── README.md
```

---

## 🧮 Database Setup

Open MySQL and run:

```sql
CREATE DATABASE startup_app;
USE startup_app;
```

Then paste your full table schema.

---

## 🔌 DB Configuration (IMPORTANT)

Edit `backend/db.js`:

```js
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "your_password",
  database: "startup_app",
});

db.connect((err) => {
  if (err) {
    console.error("❌ DB Connection Failed:", err);
  } else {
    console.log("✅ MySQL Connected");
  }
});

module.exports = db;
```

---

## ⚙️ Installation & Run (Step-by-Step)

### 1️⃣ Clone Repo

```bash
git clone https://github.com/vishnu915/Startup-Funding-Web-Form.git
cd Startup-Funding-Web-Form
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
node server.js

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

👉 App runs at:

```
 http://localhost:8080/
```

---

## 🔐 API Endpoints

| Method | Endpoint   | Description |
| ------ | ---------- | ----------- |
| POST   | /api/apply | Submit form |
|        |            |             |

---

## 📂 File Upload Notes

* Stored in: `/backend/uploads`
* Pitch Deck → PDF only
* Multiple docs supported (JSON field)

---

## 🧠 Smart Deal Scoring

Basic example logic (in controller):

```js
let score = 0;

if (data.current_stage === "Growth") score += 30;
if (data.monthly_revenue > 100000) score += 30;
if (data.team_size > 3) score += 20;
if (data.industry === "AI") score += 20;

data.deal_score = score;
```

---

## 🎯 Key Highlights

✔ Investor-grade design
✔ Structured data collection
✔ Clean backend API
✔ Scalable architecture
✔ Resume-ready project

---

## ⚠️ Important Notes

* DB config is stored in `db.js` (not `.env`)

* Suitable for:
  ✔ College projects
  ✔ Demo projects

* For production:
  👉 Use `.env` for security

---

## 📈 Future Improvements

* Admin Dashboard
* Excel export
* Email alerts
* Authentication system
* Cloud deployment

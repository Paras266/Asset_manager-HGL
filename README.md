# 💻 HGL Asset Management System

A powerful and secure web application to manage organizational assets and user allocations with full traceability, built using **MERN Stack (MongoDB, Express, React, Node.js)**.

---

## 🚀 Features

### 🧑‍💼 User Management
- Head Admin & Normal Admin Role-based access control
- Add/Edit users with full details (department, role, code, etc.)
- Assign and Deallocate assets to/from users
- View user profile and asset history

### 🖥️ Asset Management
- Add/edit assets with complete specifications (RAM, storage, MAC/IP, OS keys, etc.)
- Allocation and deallocation tracking with history
- View allocated/available assets with filters
- Fetch assets by Serial Number
- Delete assets (with cleanup from users)

### 📊 Dashboard
- Circular progress ring for allocation stats
- Quick access buttons to key pages
- Fully responsive, professional design with white-blue-green theme

### 📄 Export Options
- Export user and asset data to Excel (for audit/reporting)

### 🔐 Authentication
- Secure login and registration (with verification codes for head admin)
- Forgot Password Flow (Send Code → Verify → Reset)

---

## 🏗️ Tech Stack

| Frontend | Backend  | Database | Styling |
|----------|----------|----------|---------|
| React.js | Node.js  | MongoDB  | Tailwind CSS |
| Axios    | Express  | Mongoose | Lucide Icons |
| React Router | JWT Auth | - | ShadCN UI |

---

## 📁 Project Structure

```bash
├── client/                 # Frontend React App
│   ├── pages/
│   ├── components/
│   └── App.jsx
├── backend/                # Express Backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
├── .env
└── README.md

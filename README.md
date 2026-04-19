# 💰 FlowFi — MERN Stack App

A personal finance app built with MongoDB, Express, React, and Node.js. Track your income and expenses, visualize financial trends with interactive charts, and export your data to Excel.

---

## 📸 Features

| Feature | Description |
|---|---|
| 🔐 JWT Auth | Secure register & login with bcrypt password hashing |
| 📊 Dashboard | Total Balance, Income & Expense summary cards + donut chart |
| 💸 Expense Tracking | Add, view, delete expenses with category icons |
| 💰 Income Tracking | Add, view, delete income sources with category icons |
| 📈 Interactive Charts | Bar chart (income), Line chart (expenses), Donut charts |
| 📥 Excel Export | Download income & expense data as .xlsx files |
| 🗑️ Hover-to-Delete | Reveal delete button on hover for clean UX |
| 📱 Responsive | Works on desktop, tablet, and mobile |

---

## 🗂️ Project Structure

```
expense-tracker/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Income.js
│   │   └── Expense.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── income.js
│   │   └── expense.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TransactionItem.jsx
│   │   │   ├── AddIncomeModal.jsx
│   │   │   └── AddExpenseModal.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Income.jsx
│   │   │   └── Expense.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## ⚙️ Prerequisites

- **Node.js** v16+ — [Download](https://nodejs.org)
- **MongoDB** — Either local install or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free)
- **npm** v8+

---

## 🚀 Setup & Installation

### 1. Clone / Download the project

```bash
cd expense-tracker
```

### 2. Configure the backend environment

```bash
cd backend
cp .env.example .env
```

Edit `.env` and set your values:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/expense-tracker
# OR for Atlas: mongodb+srv://<user>:<password>@cluster.mongodb.net/expense-tracker
JWT_SECRET=your_super_secret_key_change_this
CLIENT_URL=http://localhost:5173
```

### 3. Install backend dependencies

```bash
cd backend
npm install
```

### 4. Install frontend dependencies

```bash
cd ../frontend
npm install
```

---

## ▶️ Running the App

### Start the backend (Terminal 1)

```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

### Start the frontend (Terminal 2)

```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

Open your browser at **http://localhost:5173**

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create new user |
| POST | `/api/auth/login` | Login & get JWT |
| GET | `/api/auth/me` | Get current user (protected) |

### Income (all protected with Bearer token)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/income` | Get all income |
| POST | `/api/income` | Add new income |
| DELETE | `/api/income/:id` | Delete income |
| GET | `/api/income/download/excel` | Download Excel |

### Expense (all protected with Bearer token)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/expense` | Get all expenses |
| POST | `/api/expense` | Add new expense |
| DELETE | `/api/expense/:id` | Delete expense |
| GET | `/api/expense/download/excel` | Download Excel |

---

## 🎨 Tech Stack

**Frontend:**
- React 18 + Vite
- React Router v6
- Chart.js + react-chartjs-2
- React Toastify (notifications)
- React Icons
- Axios

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- bcryptjs (password hashing)
- xlsx (Excel export)

---

## 🔒 Security Notes

- Passwords are hashed with bcrypt (12 rounds)
- JWT tokens expire after 30 days
- All income/expense routes are protected and scoped to the authenticated user
- **Always change `JWT_SECRET` before deploying to production**

---

## 🚢 Deployment Tips

### Backend (e.g. Render, Railway, Heroku)
1. Set environment variables in your hosting dashboard
2. Use MongoDB Atlas for the cloud database
3. Set `CLIENT_URL` to your frontend domain

### Frontend (e.g. Vercel, Netlify)
1. Set `VITE_API_URL` if not using Vite's proxy
2. Update `vite.config.js` proxy target to your backend URL
3. Build with `npm run build`

---

## 📝 License

free to use and modify.

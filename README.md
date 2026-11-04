# HR Management System

A full-stack HR Management System developed using the MERN stack to simplify and manage daily HR operations. The application provides role-based access for Admin, HR, and Employees, making employee management and HR activities easier and more efficient.

## 🚀 Features

- **Authentication:** Secure login using JWT authentication.
- **Role-Based Access:** Separate permissions for Admin, HR, and Employees.
- **Employee Management:** Add, update, view, and manage employee records.
- **Attendance Management:** Track employee attendance.
- **Leave Management:** Manage employee leave requests.
- **Event Management:** Create and manage company events.
- **Dashboard:** User-friendly dashboard for managing HR operations.
- **Protected Routes:** Restrict access based on authentication and user roles.

## 🛠️ Technologies Used

**Frontend:**
- React.js
- Tailwind CSS
- JavaScript
- Axios
- Lucide React

**Backend:**
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Joi Validation

## 👥 User Roles

| Role | Permissions |
|---|---|
| Admin | Manage HR, employees, and all HR operations |
| HR | Manage employees and HR activities |
| Employee | Access personal profile, attendance, leaves, and events |

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Dushyantkamboj/Hr-Management-System.git
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=3000
API_VERSION=/api_v1
```

Add your required database and JWT configuration variables.

### 4. Start Backend

```bash
npm start
```

### 5. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 6. Start Frontend

```bash
npm run dev
```

## 👨‍💻 Developer

**Dushyant Kamboj**

- GitHub: [Dushyantkamboj](https://github.com/Dushyantkamboj)
- LinkedIn: [Dushyant Kamboj](https://linkedin.com/in/dushyant-kamboj-8837b7386)

---

⭐ If you like this project, don't forget to give it a star!
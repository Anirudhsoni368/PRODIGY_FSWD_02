# ⚡ EmployeeHub — Employee Management System

A full-stack web application that enables administrators to manage employee records through a simple, interactive dashboard. Built as **Task 2 of my Full Stack Web Development Internship at Prodigy Infotech**.

## 🚀 Features

- **Admin Authentication:** Login system with JWT-based authentication.
- **Create Employees:** Add employee details, including name, email, phone, department, position, and salary.
- **View Employees:** Display employee records in a dashboard.
- **Update Employees:** Edit existing employee information.
- **Delete Employees:** Remove employee records with confirmation.
- **Search Functionality:** Search employee records by name, email, department, or position.
- **Input Validation:** Validate required fields, email format, phone numbers, and salary.
- **Database Integration:** Store employee records and admin credentials in SQLite.
- **Password Security:** Hash administrator passwords using bcrypt.
- **Dashboard Statistics:** View employee totals and department counts.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Web page structure |
| CSS3 | Styling and responsive interface |
| JavaScript | Frontend functionality and API requests |
| Node.js | Backend runtime |
| Express.js | REST API and server |
| SQLite | Database management |
| bcryptjs | Password hashing |
| JSON Web Token (JWT) | Authentication |
| dotenv | Environment configuration |

## 📁 Project Structure

```text
Employee-Management-System/
├── public/
│   ├── index.html
│   ├── dashboard.html
│   ├── style.css
│   └── script.js
├── database.js
├── server.js
├── seed.js
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd Employee-Management-System
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual repository URL.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=3001
JWT_SECRET=replace_with_a_long_random_secret
```

Use a strong, private secret for your own setup. Never commit your `.env` file to GitHub.

### 4. Initialize the database and admin account

```bash
node seed.js
```

This initializes the SQLite database and creates the demo administrator account if it does not already exist.

**Demo credentials for the original local setup:**

- Username: `admin`
- Password: `admin123`

Change the demo password before deploying or sharing a publicly accessible instance. Do not expose real credentials.

### 5. Start the application

```bash
node server.js
```

Open the application in your browser:

```text
http://localhost:3001
```

## 🔐 Security

- Passwords are stored as bcrypt hashes.
- JWT authentication protects employee management API endpoints.
- Server-side validation checks submitted employee data.
- Parameterized SQL queries help prevent SQL injection.
- Environment variables are used for configuration and JWT secrets.

**Note:** This project is intended for learning and demonstration. A production deployment should also use HTTPS, secure cookie-based token handling where appropriate, stronger credential management, rate limiting, and additional access controls.

## 🎯 Learning Outcomes

Through this project, I practiced:

- Developing RESTful APIs using Express.js.
- Implementing authentication and protected routes.
- Performing CRUD operations with SQLite.
- Validating and handling user input.
- Connecting frontend interfaces to backend APIs.
- Organizing a full-stack web application.

## 👨‍💻 Internship

Developed as **Task 2** during my Full Stack Web Development Internship at **Prodigy Infotech**.

## 📄 License

This project is available for educational and portfolio purposes. Add a license file if you intend to distribute it under specific reuse terms.
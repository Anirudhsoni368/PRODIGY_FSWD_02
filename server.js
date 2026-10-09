const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config({ override: true });

const db = require("./database");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.static("public"));


// ==========================================
// ADMIN LOGIN
// ==========================================

app.post("/api/login", (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required."
        });
    }

    db.get(
        "SELECT * FROM admins WHERE username = ?",
        [username],
        async (error, admin) => {

            if (error) {
                console.error(error);
                return res.status(500).json({
                    message: "Database error."
                });
            }

            if (!admin) {
                return res.status(401).json({
                    message: "Invalid username or password."
                });
            }

            const passwordMatch = await bcrypt.compare(
                password,
                admin.password
            );

            if (!passwordMatch) {
                return res.status(401).json({
                    message: "Invalid username or password."
                });
            }

            const token = jwt.sign(
                {
                    id: admin.id,
                    username: admin.username,
                    role: "admin"
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "2h"
                }
            );

            res.json({
                message: "Login successful!",
                token
            });
        }
    );
});


// ==========================================
// AUTHENTICATION MIDDLEWARE
// ==========================================

function authenticateAdmin(req, res, next) {

    const authHeader = req.headers.authorization;

    const token =
        authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Access denied. Please login."
        });
    }

    jwt.verify(
        token,
        process.env.JWT_SECRET,
        (error, admin) => {

            if (error) {
                return res.status(403).json({
                    message: "Invalid or expired token."
                });
            }

            if (admin.role !== "admin") {
                return res.status(403).json({
                    message: "Admin access required."
                });
            }

            req.admin = admin;
            next();
        }
    );
}


// ==========================================
// GET ADMIN PROFILE
// ==========================================

app.get(
    "/api/profile",
    authenticateAdmin,
    (req, res) => {

        res.json({
            username: req.admin.username,
            role: req.admin.role
        });
    }
);


// ==========================================
// CREATE EMPLOYEE
// ==========================================

app.post(
    "/api/employees",
    authenticateAdmin,
    (req, res) => {

        const {
            name,
            email,
            phone,
            department,
            position,
            salary
        } = req.body;

        // Validation
        if (
            !name ||
            !email ||
            !phone ||
            !department ||
            !position ||
            salary === undefined ||
            salary === ""
        ) {
            return res.status(400).json({
                message: "All fields are required."
            });
        }

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Please enter a valid email."
            });
        }

        if (!/^\d{10}$/.test(phone)) {
            return res.status(400).json({
                message: "Phone number must contain exactly 10 digits."
            });
        }

        if (Number(salary) <= 0) {
            return res.status(400).json({
                message: "Salary must be greater than 0."
            });
        }

        db.run(
            `INSERT INTO employees
            (name, email, phone, department, position, salary)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                name.trim(),
                email.trim().toLowerCase(),
                phone.trim(),
                department.trim(),
                position.trim(),
                Number(salary)
            ],
            function (error) {

                if (error) {

                    if (error.message.includes("UNIQUE")) {
                        return res.status(400).json({
                            message: "An employee with this email already exists."
                        });
                    }

                    console.error(error);

                    return res.status(500).json({
                        message: "Could not create employee."
                    });
                }

                res.status(201).json({
                    message: "Employee created successfully!",
                    id: this.lastID
                });
            }
        );
    }
);


// ==========================================
// GET ALL EMPLOYEES
// ==========================================

app.get(
    "/api/employees",
    authenticateAdmin,
    (req, res) => {

        db.all(
            `SELECT * FROM employees
             ORDER BY id DESC`,
            [],
            (error, employees) => {

                if (error) {
                    console.error(error);

                    return res.status(500).json({
                        message: "Could not fetch employees."
                    });
                }

                res.json(employees);
            }
        );
    }
);


// ==========================================
// GET SINGLE EMPLOYEE
// ==========================================

app.get(
    "/api/employees/:id",
    authenticateAdmin,
    (req, res) => {

        db.get(
            "SELECT * FROM employees WHERE id = ?",
            [req.params.id],
            (error, employee) => {

                if (error) {
                    return res.status(500).json({
                        message: "Database error."
                    });
                }

                if (!employee) {
                    return res.status(404).json({
                        message: "Employee not found."
                    });
                }

                res.json(employee);
            }
        );
    }
);


// ==========================================
// UPDATE EMPLOYEE
// ==========================================

app.put(
    "/api/employees/:id",
    authenticateAdmin,
    (req, res) => {

        const {
            name,
            email,
            phone,
            department,
            position,
            salary
        } = req.body;

        if (
            !name ||
            !email ||
            !phone ||
            !department ||
            !position ||
            salary === undefined ||
            salary === ""
        ) {
            return res.status(400).json({
                message: "All fields are required."
            });
        }

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Please enter a valid email."
            });
        }

        if (!/^\d{10}$/.test(phone)) {
            return res.status(400).json({
                message: "Phone number must contain exactly 10 digits."
            });
        }

        if (Number(salary) <= 0) {
            return res.status(400).json({
                message: "Salary must be greater than 0."
            });
        }

        db.run(
            `UPDATE employees
             SET name = ?,
                 email = ?,
                 phone = ?,
                 department = ?,
                 position = ?,
                 salary = ?
             WHERE id = ?`,
            [
                name.trim(),
                email.trim().toLowerCase(),
                phone.trim(),
                department.trim(),
                position.trim(),
                Number(salary),
                req.params.id
            ],
            function (error) {

                if (error) {

                    if (error.message.includes("UNIQUE")) {
                        return res.status(400).json({
                            message: "Another employee already uses this email."
                        });
                    }

                    console.error(error);

                    return res.status(500).json({
                        message: "Could not update employee."
                    });
                }

                if (this.changes === 0) {
                    return res.status(404).json({
                        message: "Employee not found."
                    });
                }

                res.json({
                    message: "Employee updated successfully!"
                });
            }
        );
    }
);


// ==========================================
// DELETE EMPLOYEE
// ==========================================

app.delete(
    "/api/employees/:id",
    authenticateAdmin,
    (req, res) => {

        db.run(
            "DELETE FROM employees WHERE id = ?",
            [req.params.id],
            function (error) {

                if (error) {
                    console.error(error);

                    return res.status(500).json({
                        message: "Could not delete employee."
                    });
                }

                if (this.changes === 0) {
                    return res.status(404).json({
                        message: "Employee not found."
                    });
                }

                res.json({
                    message: "Employee deleted successfully!"
                });
            }
        );
    }
);


// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {
    console.log(`⚡ Employee Management System running at http://localhost:${PORT}`);
});
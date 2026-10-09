// ==========================================
// GLOBAL
// ==========================================

let employees = [];


// ==========================================
// LOGIN PAGE
// ==========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const username =
            document.getElementById("username").value.trim();

        const password =
            document.getElementById("password").value;

        const message =
            document.getElementById("loginMessage");

        message.textContent = "⚡ AUTHENTICATING...";

        try {

            const response = await fetch("/api/login", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username,
                    password
                })

            });

            const data = await response.json();

            if (!response.ok) {

                message.textContent = "❌ " + data.message;

                return;
            }

            localStorage.setItem(
                "adminToken",
                data.token
            );

            message.textContent =
                "✓ LOGIN SUCCESSFUL!";

            setTimeout(() => {

                window.location.href =
                    "dashboard.html";

            }, 600);

        } catch (error) {

            console.error(error);

            message.textContent =
                "❌ Unable to connect to server.";
        }

    });
}


// ==========================================
// DASHBOARD
// ==========================================

const employeeTableBody =
    document.getElementById("employeeTableBody");

if (employeeTableBody) {

    initializeDashboard();
}


async function initializeDashboard() {

    const token =
        localStorage.getItem("adminToken");

    if (!token) {

        window.location.href = "index.html";

        return;
    }

    try {

        await loadProfile();

        await loadEmployees();

    } catch (error) {

        console.error(error);

        localStorage.removeItem("adminToken");

        window.location.href =
            "index.html";
    }
}


// ==========================================
// API HELPER
// ==========================================

function getHeaders() {

    const token =
        localStorage.getItem("adminToken");

    return {

        "Content-Type": "application/json",

        "Authorization":
            `Bearer ${token}`

    };
}


// ==========================================
// LOAD ADMIN PROFILE
// ==========================================

async function loadProfile() {

    const response =
        await fetch("/api/profile", {

            headers: getHeaders()

        });

    if (!response.ok) {

        throw new Error("Unauthorized");

    }

    const data =
        await response.json();

    const adminName =
        document.getElementById("adminName");

    if (adminName) {

        adminName.textContent =
            data.username.toUpperCase();

    }
}


// ==========================================
// LOAD EMPLOYEES
// ==========================================

async function loadEmployees() {

    const response =
        await fetch("/api/employees", {

            headers: getHeaders()

        });

    if (!response.ok) {

        throw new Error(
            "Unable to load employees"
        );

    }

    employees =
        await response.json();

    renderEmployees(employees);

    updateStats();
}


// ==========================================
// RENDER EMPLOYEES
// ==========================================

function renderEmployees(list) {

    employeeTableBody.innerHTML = "";

    const emptyState =
        document.getElementById("emptyState");

    if (list.length === 0) {

        emptyState.style.display =
            "block";

        return;

    }

    emptyState.style.display =
        "none";


    list.forEach(employee => {

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>${employee.id}</td>

            <td>
                <strong>
                    ${escapeHtml(employee.name)}
                </strong>
            </td>

            <td>
                ${escapeHtml(employee.email)}
            </td>

            <td>
                ${escapeHtml(employee.phone)}
            </td>

            <td>
                <span class="department-badge">
                    ${escapeHtml(employee.department)}
                </span>
            </td>

            <td>
                ${escapeHtml(employee.position)}
            </td>

            <td>
                ₹${Number(employee.salary).toLocaleString("en-IN")}
            </td>

            <td>

                <button
                    class="action-button edit-button"
                    onclick="editEmployee(${employee.id})"
                >
                    ✏️
                </button>

                <button
                    class="action-button delete-button"
                    onclick="deleteEmployee(${employee.id})"
                >
                    🗑️
                </button>

            </td>

        `;

        employeeTableBody.appendChild(row);

    });
}


// ==========================================
// UPDATE STATS
// ==========================================

function updateStats() {

    const totalEmployees =
        document.getElementById(
            "totalEmployees"
        );

    const totalDepartments =
        document.getElementById(
            "totalDepartments"
        );

    if (totalEmployees) {

        totalEmployees.textContent =
            employees.length;

    }

    if (totalDepartments) {

        const departments =
            new Set(
                employees.map(
                    employee =>
                        employee.department
                )
            );

        totalDepartments.textContent =
            departments.size;

    }
}


// ==========================================
// SEARCH
// ==========================================

const searchInput =
    document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener(
        "input",
        () => {

            const search =
                searchInput.value
                    .toLowerCase()
                    .trim();

            const filtered =
                employees.filter(employee =>

                    employee.name
                        .toLowerCase()
                        .includes(search)

                    ||

                    employee.email
                        .toLowerCase()
                        .includes(search)

                    ||

                    employee.department
                        .toLowerCase()
                        .includes(search)

                    ||

                    employee.position
                        .toLowerCase()
                        .includes(search)

                );

            renderEmployees(filtered);

        }
    );
}


// ==========================================
// MODAL
// ==========================================

const modal =
    document.getElementById(
        "employeeModal"
    );

const addEmployeeButton =
    document.getElementById(
        "addEmployeeButton"
    );

const closeModal =
    document.getElementById(
        "closeModal"
    );


if (addEmployeeButton) {

    addEmployeeButton.addEventListener(
        "click",
        () => {

            openAddModal();

        }
    );
}


if (closeModal) {

    closeModal.addEventListener(
        "click",
        () => {

            closeEmployeeModal();

        }
    );
}


function openAddModal() {

    document.getElementById(
        "modalTitle"
    ).textContent =
        "Add Employee";

    document.getElementById(
        "employeeForm"
    ).reset();

    document.getElementById(
        "employeeId"
    ).value = "";

    document.getElementById(
        "formMessage"
    ).textContent = "";

    modal.style.display = "flex";
}


function closeEmployeeModal() {

    modal.style.display = "none";

}


// ==========================================
// CREATE / UPDATE EMPLOYEE
// ==========================================

const employeeForm =
    document.getElementById(
        "employeeForm"
    );

if (employeeForm) {

    employeeForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            const id =
                document.getElementById(
                    "employeeId"
                ).value;

            const employee = {

                name:
                    document.getElementById(
                        "employeeName"
                    ).value.trim(),

                email:
                    document.getElementById(
                        "employeeEmail"
                    ).value.trim(),

                phone:
                    document.getElementById(
                        "employeePhone"
                    ).value.trim(),

                department:
                    document.getElementById(
                        "employeeDepartment"
                    ).value,

                position:
                    document.getElementById(
                        "employeePosition"
                    ).value.trim(),

                salary:
                    document.getElementById(
                        "employeeSalary"
                    ).value

            };


            const formMessage =
                document.getElementById(
                    "formMessage"
                );

            formMessage.textContent =
                "⚡ SAVING...";


            try {

                const url =
                    id
                        ? `/api/employees/${id}`
                        : "/api/employees";

                const method =
                    id
                        ? "PUT"
                        : "POST";


                const response =
                    await fetch(url, {

                        method,

                        headers:
                            getHeaders(),

                        body:
                            JSON.stringify(
                                employee
                            )

                    });


                const data =
                    await response.json();


                if (!response.ok) {

                    formMessage.textContent =
                        "❌ " + data.message;

                    return;

                }


                formMessage.textContent =
                    "✓ " + data.message;


                await loadEmployees();


                setTimeout(() => {

                    closeEmployeeModal();

                }, 500);


            } catch (error) {

                console.error(error);

                formMessage.textContent =
                    "❌ Server error.";

            }

        }
    );
}


// ==========================================
// EDIT EMPLOYEE
// ==========================================

async function editEmployee(id) {

    try {

        const response =
            await fetch(
                `/api/employees/${id}`,
                {
                    headers:
                        getHeaders()
                }
            );


        const employee =
            await response.json();


        if (!response.ok) {

            alert(employee.message);

            return;

        }


        document.getElementById(
            "modalTitle"
        ).textContent =
            "Edit Employee";


        document.getElementById(
            "employeeId"
        ).value =
            employee.id;


        document.getElementById(
            "employeeName"
        ).value =
            employee.name;


        document.getElementById(
            "employeeEmail"
        ).value =
            employee.email;


        document.getElementById(
            "employeePhone"
        ).value =
            employee.phone;


        document.getElementById(
            "employeeDepartment"
        ).value =
            employee.department;


        document.getElementById(
            "employeePosition"
        ).value =
            employee.position;


        document.getElementById(
            "employeeSalary"
        ).value =
            employee.salary;


        document.getElementById(
            "formMessage"
        ).textContent = "";


        modal.style.display =
            "flex";


    } catch (error) {

        console.error(error);

        alert(
            "Unable to load employee."
        );

    }
}


// ==========================================
// DELETE EMPLOYEE
// ==========================================

async function deleteEmployee(id) {

    const employee =
        employees.find(
            item => item.id === id
        );

    if (!employee) return;


    const confirmed =
        confirm(
            `Are you sure you want to delete ${employee.name}?`
        );


    if (!confirmed) return;


    try {

        const response =
            await fetch(
                `/api/employees/${id}`,
                {
                    method: "DELETE",
                    headers:
                        getHeaders()
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(data.message);

            return;

        }


        alert(
            "✓ Employee deleted successfully."
        );


        await loadEmployees();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to delete employee."
        );

    }
}


// ==========================================
// LOGOUT
// ==========================================

const logoutButton =
    document.getElementById(
        "logoutButton"
    );

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "adminToken"
            );

            window.location.href =
                "index.html";

        }
    );
}


// ==========================================
// BASIC HTML ESCAPING
// ==========================================

function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}
const bcrypt = require("bcryptjs");
const db = require("./database");

const username = "admin";
const password = "admin123";

bcrypt.hash(password, 10, (error, hashedPassword) => {

    if (error) {
        console.error("❌ Password hashing failed:", error);
        return;
    }

    db.run(
        `INSERT OR IGNORE INTO admins (username, password)
         VALUES (?, ?)`,
        [username, hashedPassword],
        function (error) {

            if (error) {
                console.error("❌ Admin creation failed:", error.message);
            } else {
                console.log("✅ Admin account ready");
                console.log("Username: admin");
                console.log("Password: admin123");
            }

            db.close();
        }
    );
});
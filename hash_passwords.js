const mysql = require("mysql");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "hotel_management",
});

db.connect(err => {
  if (err) {
    console.error("DB connection failed", err);
    process.exit(1);
  }
});

db.query("SELECT guest_id, email, password FROM Guest", async (err, users) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  for (const u of users) {
    if (!u.password) continue;

    const looksHashed = u.password.startsWith("$2b$");

    if (!looksHashed) {
      const hashed = await bcrypt.hash(u.password, SALT_ROUNDS);

      db.query(
        "UPDATE Guest SET password = ? WHERE guest_id = ?",
        [hashed, u.guest_id],
        (err) => {
          if (err) console.error("Failed to update", u.email, err);
          else console.log("Hashed password for:", u.email);
        }
      );
    } else {
      console.log("Already hashed:", u.email);
    }
  }

  setTimeout(() => {
    console.log("Done.");
    process.exit(0);
  }, 2000);
});
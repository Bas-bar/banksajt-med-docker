import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mysql from "mysql2/promise";

const app = express();
const port = 3006;

app.use(cors());
app.use(bodyParser.json());

const pool = mysql.createPool({
  user: "root",
  password: "root",
  host: "localhost",
  database: "bank",
  port: 8889,
});

async function query(sql, params) {
  const [results] = await pool.execute(sql, params);
  return results;
}

// Login
app.post("/sessions", async (req, res) => {
  const { username, password } = req.body;
  try {
    const users = await query(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [username, password]
    );

    if (users.length === 0) {
      return res
        .status(401)
        .json({ message: "Fel användarnamn eller lösenord" });
    }

    const user = users[0];
    res.json({ userId: user.id, username: user.username });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internt serverfel" });
  }
});

// Registrera ny användare
app.post("/users", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, password]
    );

    const userId = result.insertId;
    await query("INSERT INTO accounts (userId, amount) VALUES (?, ?)", [
      userId,
      0,
    ]);

    res.status(201).send({ id: userId, username });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Internal server error");
  }
});

// Hämta saldo
app.post("/me/accounts", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "UserId is required" });
  }

  try {
    const accounts = await query(
      "SELECT amount FROM accounts WHERE userId = ?",
      [userId]
    );

    if (accounts.length === 0) {
      return res.status(404).json({ message: "Account not found" });
    }

    res.json({ balance: accounts[0].amount });
  } catch (error) {
    console.error("Error checking balance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Sätta in pengar
app.post("/me/accounts/transactions", async (req, res) => {
  const { userId, amount } = req.body;
  console.log("Received data:", { userId, amount });

  if (!userId || !amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: "Invalid request data" });
  }

  try {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      console.log("Fetching account info for userId:", userId);
      const [accounts] = await connection.query(
        "SELECT id, amount FROM accounts WHERE userId = ? FOR UPDATE",
        [userId]
      );

      if (accounts.length === 0) {
        await connection.rollback();
        return res.status(404).json({ message: "Account not found" });
      }

      const account = accounts[0];
      const newBalance = parseFloat(account.amount) + parseFloat(amount);
      console.log("Updating balance:", newBalance);

      await connection.query("UPDATE accounts SET amount = ? WHERE id = ?", [
        newBalance,
        account.id,
      ]);
      console.log("Inserting transaction for account:", account.id);

      await connection.query(
        "INSERT INTO transactions (accountId, amount, newBalance, type) VALUES (?, ?, ?, ?)",
        [account.id, amount, newBalance, "deposit"]
      );

      await connection.commit();

      res.json({
        message: "Deposit successful",
        newBalance,
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error depositing money:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Bank backend running at http://localhost:${port}`);
});

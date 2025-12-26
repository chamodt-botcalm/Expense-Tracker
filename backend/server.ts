import express from "express"
import dotenv from "dotenv"
import { sql } from './config/db'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

async function initDB() {
    try {
        await sql`CREATE TABLE IF NOT EXISTS transactions(
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            category VARCHAR(255) NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE
            )`;
        console.log('Database initialized successfully')
    } catch (error) {
        console.error('Error initializing database', error)
        process.exit(1)
    }
}

app.get("/api/transaction", async (req, res) => {
    res.send('API is running...');
});

app.post("/api/transaction", async (req, res) => {
    try {
        const { title, amount, category, user_id } = req.body;

        if (!title || !amount || !category || !user_id) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const result = await sql`
            INSERT INTO transactions (title, amount, category, user_id)
            VALUES (${title}, ${amount}, ${category}, ${user_id})
            RETURNING *
        `;
        console.log("Transaction created:", result);
        res.status(201).json({ message: "Transaction created successfully", transaction: result[0] });
    } catch (error) {
        console.log("Error creating transaction:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

app.get("/api/transaction:user_id", async (req, res) => {
    try {
        const transactions = await sql`SELECT * FROM transactions WHERE user_id = ${req.params.user_id} ORDER BY created_at DESC`;
        res.status(200).json({ message: "Transactions fetched successfully", transactions });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    } ``
});
app.delete("/api/transaction/:id", async (req, res) => {
    try {
        const result = await sql`DELETE FROM transactions WHERE id = ${req.params.id} RETURNING *`;

        if(isNaN(Number(req.params.id))) {
            return res.status(400).json({ message: "Invalid transaction ID" });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        
            res.status(200).json({ message: "Transaction deleted successfully" });
        
    }
    catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }

});

app.get("/api/transaction/summary/:user_id", async (req, res) => {
    try {
        const balanceResult = await sql`SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions WHERE user_id = ${req.params.user_id}`;
        const incomeResult = await sql`SELECT COALESCE(SUM(amount), 0) AS income FROM transactions WHERE user_id = ${req.params.user_id} AND amount > 0`;
        const expenseResult = await sql`SELECT COALESCE(SUM(amount), 0) AS expense FROM transactions WHERE user_id = ${req.params.user_id} AND amount < 0`;
        
        res.status(200).json({
            balance: balanceResult[0].balance,
            income: incomeResult[0].income,
            expense: expenseResult[0].expense
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});


initDB().then(() =>
    app.listen(PORT, () => {
        console.log("SERVER IS UP AND RUNNING ON PORT:", PORT);
    })
)


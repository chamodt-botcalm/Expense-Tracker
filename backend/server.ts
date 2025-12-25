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

app.get("/api/transactions", async (req, res) => {
    res.send('API is running...');
});

app.post("/api/transactions", async (req, res) => {
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
        res.status(201).json({ message: "Transaction created successfully", transaction : result[0] });
    } catch (error) {
        console.log("Error creating transaction:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

initDB().then(() =>
    app.listen(PORT, () => {
        console.log("SERVER IS UP AND RUNNING ON PORT:", PORT);
    })
)


import { sql } from '../config/db';


export async function getTransactionByUserId(req: any, res: any) {
    try {
        const transactions = await sql`SELECT * FROM transactions WHERE user_id = ${req.params.user_id} ORDER BY created_at DESC`;
        res.status(200).json({ message: "Transactions fetched successfully", transactions });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}

export async function createTransaction(req: any, res: any) {
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
        // amazonq-ignore-next-line
        console.log("Transaction created:", result);
        res.status(201).json({ message: "Transaction created successfully", transaction: result[0] });
    } catch (error) {
        console.log("Error creating transaction:", error);
        res.status(500).json({ message: "Server Error" });
    }
}

export async function deleteTransaction(req: any, res: any) {
    try {
        if (isNaN(Number(req.params.id))) {
            return res.status(400).json({ message: "Invalid transaction ID" });
        }

        const result = await sql`DELETE FROM transactions WHERE id = ${req.params.id} RETURNING *`;

        if (result.length === 0) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.status(200).json({ message: "Transaction deleted successfully" });

    }
    catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
}

export async function getTransactionSummaryByUserId(req: any, res: any) {
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
}

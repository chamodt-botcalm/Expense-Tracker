import express from "express";
import {
    createTransaction,
    deleteTransaction,
    getTransactionByUserId,
    getTransactionSummaryByUserId
} from '../controllers/transactionsController';

const router = express.Router();

router.post("/", createTransaction);

router.get("/:user_id", getTransactionByUserId);

router.delete("/:id", deleteTransaction);

router.get("/summary/:user_id", getTransactionSummaryByUserId);

export default router;
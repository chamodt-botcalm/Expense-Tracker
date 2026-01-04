import express from "express"
import dotenv from "dotenv"
import { initDB, sql } from './config/db'
import rateLimiter from './middleware/RateLimiter';
import transactionsRoutes from './routes/transactionsRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(rateLimiter)
app.use(express.json());
app.use('/api/transaction',transactionsRoutes)


initDB().then(() =>
    app.listen(PORT, () => {
        console.log("SERVER IS UP AND RUNNING ON PORT:", PORT);
    })
)


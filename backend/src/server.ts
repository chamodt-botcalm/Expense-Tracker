import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { initDB, sql } from './config/db'
import rateLimiter from './middleware/rateLimiter';
import transactionsRoutes from './routes/transactionsRoutes';
import authRoutes from './routes/authRoutes';
import signupRoutes from './routes/signupRoutes';
import profileRoutes from './routes/profileRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(rateLimiter)
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/auth', signupRoutes);
app.use('/api/transaction',transactionsRoutes)
app.use('/api/profile', profileRoutes);


initDB().then(() =>
    app.listen(PORT, () => {
        console.log("SERVER IS UP AND RUNNING ON PORT:", PORT);
    })
)


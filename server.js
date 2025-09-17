import express from 'express';

import dotenv from 'dotenv';
dotenv.config();

// db and authenticateUser
import connectDB from "./db/connect.js";

// routers
import authRouter from './routes/authRoutes.js';
import jobsRouter from './routes/jobsRoutes.js';

// middleware
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';


const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome!'); 
})

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', jobsRouter);


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const PORT = process.env.PORT || 5000;



const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(PORT, () =>
          console.log(`Server is listening on port ${PORT}...`)
        ); 
    } catch (error) {
        console.log(error);
    }
}

start(); 
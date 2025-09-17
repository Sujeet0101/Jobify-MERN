import express from 'express';
import connectDB from './db/connect.js';

import dotenv from 'dotenv';
dotenv.config();

//middleware
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';


const app = express();

app.get('/', (req, res) => {
    res.send('Welcome!'); 
})

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
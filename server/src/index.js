import express from 'express';
import routes from './routes.js';
import mongoose from 'mongoose';
import { authMiddleware } from './middlewares/authMiddleware.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
const app = express();

app.use(
    cors({
        credentials: true,
        origin: ["http://localhost:4200"],
        optionsSuccessStatus: 200,
    })
);

// const url = 'mongodb://localhost:27017';
const url = 'mongodb://127.0.0.1:27017';

mongoose
    .connect(url, { 
        dbName: 'devlink',
    })
    .then(async () => {
        console.log('Connected to DB');
    })
    .catch((err) => console.log(`Failed to connect to DB: ${err}`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(authMiddleware);
app.use(routes);

app.listen(3030, () => console.log('App is listening on http://localhost:3030'));

export default app;
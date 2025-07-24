import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import routes from './routes.js';
import mongoose from 'mongoose';
import { authMiddleware } from './middlewares/authMiddleware.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import AdminChatMessage from './models/message.js';

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use(
    cors({
        credentials: true,
        origin: ["http://localhost:4200"],
        optionsSuccessStatus: 200,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
    })
);

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

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('admin-message', async (data) => {
        try {
            const newMessage = new AdminChatMessage({
                content: data.message,
                username: data.username || 'Admin',
                profileImage: data.profileImage || null,
                adminId: data.userId
            });

            const savedMessage = await newMessage.save();

            io.emit('new-admin-message', {
                id: savedMessage._id,
                content: savedMessage.content,
                timestamp: savedMessage.timestamp,
                username: savedMessage.username,
                profileImage: savedMessage.profileImage,
                adminId: savedMessage.adminId
            });

        } catch (error) {
            console.error('Error saving admin message:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(3030, () => console.log('App is listening on http://localhost:3030'));

export default app;
export { io };
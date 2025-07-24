import { Router } from "express";
import AdminChatMessage from "../models/message.js";

const chatController = Router();

chatController.get('/admin-chat', async (req, res) => {
    try {
        const messages = await AdminChatMessage.find()
            .sort({ timestamp: -1 })
            .limit(100)
            .lean();

        res.json(messages.reverse());
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch admin messages' });
    }
});

chatController.delete('/admin-chat', async (req, res) => {
    try {
        await AdminChatMessage.deleteMany({});
        res.json({ message: 'Admin chat cleared successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to clear admin chat' });
    }
});

export default chatController;
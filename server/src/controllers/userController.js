import { json, Router } from "express";
import userService from "../services/userService.js";
import User from "../models/user.js";

const userController = Router();

userController.get('/users', async (req, res) => {
    const users = await userService.getAll().lean();
    res.json(users);
});

userController.get('/edit-profile/:userId', async (req, res) => {
    const userId = req.params.userId;
    const user = await userService.getOne(userId).lean();
    res.json(user);
})

userController.post('/edit-profile/:userId', async (req, res) => {
    const userId = req.params.userId;
    const updatedData = req.body;
    const updatedUser = await userService.updateUser(userId, updatedData);
    res.json(updatedUser);
});

userController.post('/adminpanel/:userId/edit-user', async (req, res) => {
    const userId = req.params.userId;
    const updatedData = req.body;
    const updatedUser = await userService.updateUser(userId, updatedData);
    res.json(updatedUser);
});

userController.get('/users/:userId', async (req, res) => {
    const userId = req.params.userId;
    const userInfo = await userService.getOne(userId);
    res.json(userInfo);
});

userController.post('/profile/:userId/star', async (req, res) => {
    try {
        const targetUserId = req.params.userId;
        const likerUserId = req.user._id;
        await userService.starUser(targetUserId, likerUserId);
        res.status(200)
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

userController.get('/peojects/:projectId/:userId/save', async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const userId = req.params.userId;
        await userService.saveProject(userId, projectId);
        res.status(200)
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

userController.get('/peojects/:projectId/:userId/save', async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const userId = req.params.userId;
        await userService.saveProject(userId, projectId);
        res.status(200)
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

userController.get('/profile/:devId/:userId/save', async (req, res) => {
    const devId = req.params.devId;
    const userId = req.params.userId

    try {
        await userService.saveDeveloper(userId, devId);
        res.status(200).json({ message: 'Developer save successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save this developer.' });
    }
});

userController.post('/users/:devId/:userId/reviews', async (req, res) => {
    const devId = req.params.devId;
    const userId = req.params.userId;
    const { content, stars } = req.body;

    try {
        const updatedUser = await userService.postReview(devId, userId, content, stars);
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'Review added successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add review.' });
    }
});

userController.put('/users/:userId/updateProfileImage', async (req, res) => {
    const { userId } = req.params;
    const { profileImageUrl } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profileImage: profileImageUrl },
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

userController.patch('/users/:id/admin-status', async (req, res) => {
    try {
        const { id } = req.params;
        const { isAdmin } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { isAdmin },
            { new: true }
        );

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update admin status' });
    }
});

userController.get('/adminpanel/usermanagement/:userId/delete', async (req, res) => {
    const userId = req.params.userId;
    console.log(userId);

    try {
        const user = await userService.delete(userId);
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500), json({ message: 'Failed to delete user' });
    }
})


userController.get('/users/:userId/profileImage', async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await userService.getOne(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ profileImage: user.profileImage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

userController.post('/feedback', async (req, res) => {
    const { owner, content, stars } = req.body;
    try {
        const feedback = await userService.postFeedback(owner, content, stars);
        res.status(200).json({ message: 'Feedback added successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add feedback.' });
    }
})
export default userController;
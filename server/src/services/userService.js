import User from "../models/user.js";

const userService = {
    getAll() {
        return User.find();
    },
    getOne(userId) {
        return User.findById(userId);
    },
    updateUser(userId, updateData) {
        return User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true }
        );
    },
    async starUser(targetUserId, likerUserId) {
        const user = await User.findById(targetUserId);

        if (!user.stars.includes(likerUserId)) {
            return User.findByIdAndUpdate(targetUserId, { $push: { stars: likerUserId } });
        } else {
            return User.findByIdAndUpdate(targetUserId, { $pull: { stars: likerUserId } });
        }
    },
    updateProfileImage: async (userId, profileImage) => {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        user.profileImage = profileImage;

        await user.save();

        return user;
    }
};

export default userService;

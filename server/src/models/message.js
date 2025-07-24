import { model, Schema, Types } from 'mongoose';

const adminChatMessageSchema  = new Schema({
    content: {
        type: String,
        required: true,
        maxLength: 500
    },
    username: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        default: null
    },
    adminId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const AdminChatMessage = model('AdminChatMessage', adminChatMessageSchema);

export default AdminChatMessage;
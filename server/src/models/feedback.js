import { model, Schema, Types } from 'mongoose';

const feedbackSchema = new Schema({
    owner: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 500,
    },
    stars: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Feedback = model('Feedback', feedbackSchema);

export default Feedback;
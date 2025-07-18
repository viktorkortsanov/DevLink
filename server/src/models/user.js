import { model, Schema, Types } from "mongoose";
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        minLength: [2, 'Username must be at least 2 characters long']
    },

    email: {
        type: String,
        required: true,
        minLength: [10, 'Email must be at least 10 characters long']
    },

    role: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
        minLength: [4, 'Password must be at least 4 characters long']
    },

    isAdmin: {
        type: Boolean,
        required: true,
    },

    savedProjects: [{
        type: Types.ObjectId,
        ref: 'Project'
    }],

    savedDevelopers: [{
        type: Types.ObjectId,
        ref: 'User'
    }],

    stars: [{
        type: Types.ObjectId,
        ref: 'User'
    }],

    profileImage: {
        type: String,
        default: null
    },

    bio: {
        type: String,
        default: null
    },

    techStack: {
        type: String,
        default: null,
    },

    reviews: [{
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
    }],

    location: {
        type: String,
        default: null,
    },

    githubLink: {
        type: String,
        default: null,
    },

    linkedinLink: {
        type: String,
        default: null,
    }
});

userSchema.pre('save', async function (next) {
    if (this.isModified('password') && !this.password.startsWith('$2a$')) {
        try {
            const hash = await bcrypt.hash(this.password, SALT_ROUNDS);
            this.password = hash;
        } catch (error) {
            return next(error);
        }
    }
    next();
});

const User = model('User', userSchema);
export default User;
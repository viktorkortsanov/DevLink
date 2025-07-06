import { Schema, Types, model } from "mongoose";

const projectSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    projectLogo: {
        type: String,
    },
    shortDescription: {
        type: String,
        required: true
    },
    fullDescription: {
        type: String,
        required: true
    },
    requirements: {
        type: String,
        required: true
    },
    projectType: {
        type: String,
        required: true
    },
    experienceLevel: {
        type: String,
        required: true
    },
    workType: {
        type: String,
        required: true
    },
    techStack: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    owner: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    favourites: [{
        type: Types.ObjectId,
        ref: 'User',
    }]
});

const Project = model('Project', projectSchema);
export default Project;
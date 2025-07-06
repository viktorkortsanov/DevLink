export interface Project {
    _id?: string;
    title: string;
    projectLogo: string;
    shortDescription: string;
    fullDescription: string;
    requirements: string;
    projectType: string;
    experienceLevel: string;
    workType: 'office' | 'hybrid' | 'remote';
    techStack: string;
    createdAt?: string;
    owner?: string;
    favourites?: string[];
}

// const projectSchema = new Schema({
//     title: {
//         type: String,
//         required: true
//     },
//     projectLogo: {
//         type: String,
//         required: true
//     },
//     shortDescription: {
//         type: String,
//         required: true
//     },
//     fullDescription: {
//         type: String,
//         required: true
//     },
//     projectType: {
//         type: String,
//         required: true
//     },
//     experienceLevel: {
//         type: String,
//         required: true
//     },
//     workType: {
//         type: String,
//         required: true
//     },
//     techStack: {
//         type: String,
//         required: true
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     },
//     owner: {
//         type: Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     favourites: [{
//         type: Types.ObjectId,
//         ref: 'User',
//     }]
// });
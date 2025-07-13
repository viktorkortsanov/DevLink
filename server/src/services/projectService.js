import Project from "../models/project.js"

const projectService = {

    getAll() {
        return Project.find().populate('owner', 'username profileImage').exec();;
    },

    getOne(projectId) {
        return Project.findById(projectId);
    },

    create(projectData, userId) {
        return Project.create({ ...projectData, owner: userId });
    },

    edit(projectId, projectData) {
        return Project.findByIdAndUpdate(projectId, projectData, { runValidators: true });
    },

    delete(projectId) {
        return Project.findByIdAndDelete(projectId);
    },

    apply(projectId, userId) {
        return Project.findByIdAndUpdate(projectId, { $push: { appliedUsers: userId } });
    },
}

export default projectService;
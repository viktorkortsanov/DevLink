import Project from "../models/project.js"

const projectService = {

    getAll() {
        return Project.find();
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
}

export default projectService;
import Project from "../models/project.js"

const projectService = {

    getAll() {
        return Project.find();
    },

    create(projectData, userId) {
        return Project.create({ ...projectData, owner: userId });
    }
}

export default projectService;
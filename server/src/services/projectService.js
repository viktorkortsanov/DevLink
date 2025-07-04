import Project from "../models/project.js"

const projectService = {
    create(projectData, userId) {
        return Project.create({ ...projectData, owner: userId });
    }
}

export default projectService;
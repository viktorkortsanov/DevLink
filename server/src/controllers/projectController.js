import { Router } from "express";
import projectService from "../services/projectService.js";

const projectController = Router();

projectController.get('/projects', async (req, res) => {
    try {
        const projects = await projectService.getAll().lean();
        res.status(200).json(projects);
    } catch (err) {
        res.status(400).json(err.message);
    }
});

projectController.get('/projects/:projectId/details', async (req, res) => {
    const projectId = req.params.projectId;

    try {
        const project = await projectService.getOne(projectId).lean();
        res.status(200).json(project)
    } catch (err) {
        res.status(400).json(err.message)
    }
});

projectController.post('/create-project', async (req, res) => {
    const projectData = req.body;
    const userId = req.user._id;

    try {
        const project = await projectService.create(projectData, userId);
        res.status(200).json(project)
    } catch (err) {
        console.log(err);
        res.status(400).json(err.message);
    }
});

projectController.post('/projects/:projectId/edit', async (req, res) => {
    const projectData = req.body;
    const projectId = req.params.projectId;

    if (!isProjectOwner(projectId, req.user?._id)) {
        return res.status(403).json({ error: 'Not authorized to edit this project.' });
    }

    try {
        await projectService.edit(projectId, projectData);
        res.status(200).json({ message: 'Project updated successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update project.' });
    }
});

async function isProjectOwner(projectId, userId) {
    const project = await projectService.getOne(projectId);
    return project.owner.toString() === userId;
}

export default projectController;
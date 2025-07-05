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

projectController.get('/projects/:projectId/details', async(req,res) => {
    const projectId = req.params.projectId;
    console.log(projectId);
    try {
        const project = await projectService.getOne(projectId).lean();
        res.status(200).json(project)
    }catch(err) {
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

export default projectController;
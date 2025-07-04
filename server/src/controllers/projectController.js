import { Router } from "express";
import projectService from "../services/projectService.js";


const projectController = Router();

projectController.post('/create-project', async (req, res) => {
    const projectData = req.body;
    const userId = req.user._id;

    try {
        const project = await projectService.create(projectData, userId);
        res.status(200).json(project)
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

export default projectController;
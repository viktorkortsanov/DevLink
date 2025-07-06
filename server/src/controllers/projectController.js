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

projectController.get('/projects/:projectId/delete', async (req, res) => {
    if (!isProjectOwner(req.params.projectId, req.user?._id)) {
        return res.status(403).json({ error: 'Not authorized to delete this project.' });
    }

    try {
        await projectService.delete(req.params.projectId);
        res.status(200).json({ message: 'Project deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete project.' });
    }
});

projectController.get('/projects/:projectId/:userId/apply', async (req, res) => {
  const userId = req.params.userId;
  const projectId = req.params.projectId;

  try {
    const isOwner = await isProjectOwner(projectId, userId);
    if (isOwner) {
      return res.status(403).json({ error: 'Owners cannot apply to their own projects.' });
    }

    await projectService.apply(projectId, userId);
    res.status(200).json({ message: 'Project applied successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to apply to this project.' });
  }
});



async function isProjectOwner(projectId, userId) {
    const project = await projectService.getOne(projectId);
    return project.owner.toString() === userId;
}

export default projectController;
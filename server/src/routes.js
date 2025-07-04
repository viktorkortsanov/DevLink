import { Router } from "express";
import authController from "./controllers/authController.js";
import postController from "./controllers/postController.js";
import userController from "./controllers/userController.js";
import projectController from "./controllers/projectController.js";

const routes = Router();

routes.use(userController);
routes.use(authController);
routes.use(postController);
routes.use(projectController);
export default routes
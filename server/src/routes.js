import { Router } from "express";
import authController from "./controllers/authController.js";
import postController from "./controllers/postController.js";
import userController from "./controllers/userController.js";
import projectController from "./controllers/projectController.js";
import chatController from "./controllers/adminChatController.js";

const routes = Router();

routes.use(userController);
routes.use(authController);
routes.use(postController);
routes.use(projectController);
routes.use(chatController);
export default routes
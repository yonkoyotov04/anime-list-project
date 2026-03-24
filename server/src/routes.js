import { Router } from "express";
import userController from "./controllers/userController.js";
import animeController from "./controllers/animeController.js";
import reviewController from "./controllers/reviewController.js";

const routes = Router();

routes.use('/user', userController);
routes.use('/anime', animeController);
routes.use('/review', reviewController);

export default routes;
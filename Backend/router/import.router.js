import { Router } from "express";
import {upload} from "../middleware/upload.js";
import { isProtected } from '../middleware/authMiddleware.js';
import { importAssets , importUsers } from "../controllers/import.controller.js";
const importRouter = Router();

importRouter.post("/users", isProtected, upload.single("file"), importUsers);
importRouter.post("/assets", isProtected, upload.single("file"), importAssets);



export default importRouter;
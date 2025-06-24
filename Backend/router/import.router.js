import { Router } from "express";
import {upload} from "../middleware/upload.js";
import { importAssets , importUsers } from "../controllers/import.controller.js";
const importRouter = Router();

importRouter.post("/users", upload.single("file"), importUsers);
importRouter.post("/assets", upload.single("file"), importAssets);



export default importRouter;
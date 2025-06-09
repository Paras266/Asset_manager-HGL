import { Router } from "express";
import { isProtected } from "../middleware/authMiddleware.js";
import { addUser } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.post('/AddUser', isProtected , addUser)

export default userRouter;
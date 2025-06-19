import { Router } from "express";
import { isProtected } from "../middleware/authMiddleware.js";
import { addUser, getAllUsers , getUserById , updateUser} from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.post('/AddUser', isProtected , addUser)
userRouter.get('/getAllUsers', isProtected, getAllUsers);
userRouter.post('/getUserById', isProtected, getUserById);
userRouter.put('/updateUser/:id', isProtected, updateUser);

export default userRouter;
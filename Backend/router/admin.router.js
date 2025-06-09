import { Router } from "express";
import { verifyAdminCode , registerAdmin, loginAdmin, logoutAdmin, getAdminProfile} from "../controllers/admin.controllers.js";
import { isProtected } from "../middleware/authMiddleware.js";

const adminRouter = Router();
// Route to verify admin registration code
adminRouter.post('/verify-code', verifyAdminCode);  
// Route to register a new admin
adminRouter.post('/register', registerAdmin); 
// Route to login a new admin
adminRouter.post('/login', loginAdmin); 
// Route to logout an admin
adminRouter.get('/logout',logoutAdmin) ;
//Router to view profile
adminRouter.get('/profile',isProtected,getAdminProfile)

// Export the admin router
export default adminRouter;
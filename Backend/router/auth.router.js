import express from "express";
import {
  forgotPassword,
  verifyCode,
  resetPassword,
} from "../controllers/auth.controller.js";

const authrouter = express.Router();

authrouter.post("/forgot-password", forgotPassword);
authrouter.post("/verify-code", verifyCode);
authrouter.post("/reset-password", resetPassword);

export default authrouter;

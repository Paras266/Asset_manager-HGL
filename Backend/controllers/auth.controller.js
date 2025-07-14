import Admin from "../models/admin.model.js";
import { sendMail } from "../utils/sendMail.js";
import { ApiError } from "../utils/ApiError.js";

const otpStore = new Map();

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await Admin.findOne({ email });
    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, code);

    await sendMail(email, "Reset Password", `Your code is: ${code}`);
    res.status(200).json({ success: true });
  } catch (error) {
    next(new ApiError(500, "Failed to send reset password email"));
  }
};

export const verifyCode = (req, res , next) => {
 try {
   const { email, code } = req.body;
  console.log(otpStore);
  
  if (!otpStore.has(email)) {
    return next(new ApiError( "Internal server error" , 500));
  }
  if (otpStore.get(email) !== code) {
    return next(new ApiError("Invalid code" , 400));
  }
 
   res.status(200).json({ message : "Code verified succesfully" , success: true });
 } catch (error) {
  next(error)
 }
};

export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
   console.log("Resetting password for email:", email);
   
  try {
    const user = await Admin.findOne({ email });
    console.log("Resetting password for user:", user);
    
    if (!user) return next(new ApiError(404, "User not found"));

    user.password = newPassword;
    await user.save();

    otpStore.delete(email);
    res.status(200).json({ message:"Password reset Successfully", success: true });
  } catch (err) {
    console.error("Error resetting password:", err.message);
    next(err)
  }
};

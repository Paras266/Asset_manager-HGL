import Admin from "../models/admin.model.js";
import { sendMail } from "../utils/sendMail.js";

const otpStore = new Map();

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await Admin.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, code);

    await sendMail(email, "Reset Password", `Your code is: ${code}`);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error.message);
    res.status(500).json({ success: false });
  }
};

export const verifyCode = (req, res) => {
  const { email, code } = req.body;

  if (!otpStore.has(email) || otpStore.get(email) !== code) {
    return res.status(400).json({ success: false });
  }

  res.status(200).json({ success: true });
};

export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
   console.log("Resetting password for email:", email);
   
  try {
    const user = await Admin.findOne({ email });
    console.log("Resetting password for user:", user);
    
    if (!user) return res.status(404).json({ success: false , message: "User not found" });

    user.password = newPassword;
    await user.save();

    otpStore.delete(email);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error resetting password:", err.message);
    res.status(500).json({ success: false , message: "Failed to reset password" });
  }
};

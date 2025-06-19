import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Services/api";
import toast from "react-hot-toast";
import { MdEmail } from "react-icons/md";
import { BiSolidLockAlt } from "react-icons/bi";
import { FaCode } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1); // 1: email, 2: code, 3: reset
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleSendCode = async () => {
    if (!email) return toast.error("Please enter your email");
    try {
      const res = await api.post("/auth/forgot-password", { email });
      toast.success(res.data.message || "Verification code sent");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send code");
    }
  };

  const handleVerifyCode = async () => {
    if (!code) return toast.error("Please enter the verification code");
    try {
      const res = await api.post("/auth/verify-code", { email, code });
      toast.success(res.data.message || "Code verified");
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid code");
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }
    try {
      const res = await api.post("/auth/reset-password", {
        email,
        newPassword,
      });
      toast.success(res.data.message || "Password reset successful");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-white via-blue-50 to-green-100 px-4">
            <button
        onClick={() => navigate("/login")}
        className="absolute top-6 left-6 flex items-center gap-2 text-blue-700 hover:text-green-600 font-semibold transition"
      >
        <FiArrowLeft className="text-xl" />
        <span>Back to Login</span>
      </button>
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-blue-100">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Forgot Password</h2>
              
        {step === 1 && (
          <>
            <div className="relative mb-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-blue-200 p-3 w-full rounded-xl pl-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <MdEmail className="absolute left-3 top-3.5 text-gray-500" size={20} />
            </div>

            <button
              onClick={handleSendCode}
              className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition-all font-semibold"
            >
              Send Code
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Enter verification code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="border border-blue-200 p-3 w-full rounded-xl pl-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <FaCode className="absolute left-3 top-3.5 text-gray-500" size={18} />
            </div>

            <button
              onClick={handleVerifyCode}
              className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition-all font-semibold"
            >
              Verify Code
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <div className="relative mb-4">
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border border-green-200 p-3 w-full rounded-xl pl-10 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <BiSolidLockAlt className="absolute left-3 top-3.5 text-gray-500" size={20} />
            </div>

            <button
              onClick={handleResetPassword}
              className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition-all font-semibold"
            >
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
};

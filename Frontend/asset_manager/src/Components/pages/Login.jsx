// src/Components/Auth/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import toast, { Toaster } from "react-hot-toast";
import api from "../../Services/api";

export const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("admin/login", form);
      if (res.data.success) {
        toast.success("Login successful!");
        setTimeout(() => navigate("/dashboard"), 1000); // Or your target page
      } else {
        toast.error(res.data.message || "Invalid credentials");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-white via-blue-50 to-green-50 flex items-center justify-center px-4">
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Admin Login</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <FaUserAlt className="absolute top-3 left-3 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
             
              className="pl-10 pr-3 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
             
              className="pl-10 pr-10 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />
            <span
              className="absolute top-3 right-3 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </span>
          </div>

          <div className="flex justify-between text-sm text-blue-700">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="hover:underline"
            >
              Forgot Password?
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="hover:underline"
            >
              Go to Registration
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold shadow-md transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

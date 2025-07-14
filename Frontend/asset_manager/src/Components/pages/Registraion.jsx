import { useState } from "react";
import api from "../../Services/api.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff, FiUser, FiMail, FiKey, FiLock, FiImage } from "react-icons/fi";


export const Registraion = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "admin",
    headCode: "" ,
  });

  const [profileImage, setProfileImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const formData = new FormData();
      for (const key in form) {
        formData.append(key, form[key]);
      }
      if (profileImage) {
        formData.append("file", profileImage);
      }

      const res = await api.post("admin/register", formData);
      console.log(res.data);
      
      if (res.data.success) {
        toast.success(res.data.message || `Registration successful as ${res.data.admin.role}`);
        setSuccess("Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
         setError(res.data.message || "Registration failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-100 flex items-center justify-center px-4">
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-blue-100">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Register New Admin</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Username */}
          <div className="relative">
            <FiUser className="absolute top-3.5 left-3 text-gray-500" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
              className="pl-10 border border-blue-200 p-3 rounded-xl w-full"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <FiMail className="absolute top-3.5 left-3 text-gray-500" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="pl-10 border border-blue-200 p-3 rounded-xl w-full"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FiKey className="absolute top-3.5 left-3 text-gray-500" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="pl-10 pr-10 border border-blue-200 p-3 rounded-xl w-full"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5">
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>

          {/* Role */}
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="border border-blue-200 p-3 rounded-xl"
          >
            <option value="admin">Admin</option>
            <option value="head-admin">Head Admin</option>
          </select>

          {/* Head Code */}
          {form.role === "head-admin" && (
            <div className="relative">
              <FiLock className="absolute top-3.5 left-3 text-gray-500" />
              <input
                type={showCode ? "text" : "password"}
                name="headCode"
                placeholder="Enter Head Admin Code"
                value={form.headCode}
                onChange={handleChange}
                required
                className="pl-10 pr-10 border border-green-300 p-3 rounded-xl w-full"
              />
              <button type="button" onClick={() => setShowCode(!showCode)} className="absolute right-3 top-3.5">
                {showCode ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          )}

          {/* Profile Image */}
          <div className="relative">
            <FiImage className="absolute top-3.5 left-3 text-gray-500" />
            <input
              type="file"
              name="file"
              onChange={(e) => setProfileImage(e.target.files[0])}
              className="pl-10 border border-blue-200 p-3 rounded-xl w-full"
            />
          </div>

          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl">
            Register
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-blue-700 hover:underline text-sm font-medium text-center"
          >
            Already have an account? Go to Login
          </button>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && <p className="text-green-700 text-sm text-center">{success}</p>}
        </form>
      </div>
    </div>
  );
};

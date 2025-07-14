/* eslint-disable no-unused-vars */
// src/components/Auth/CodeVerify.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Services/api.js";
import { toast } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react"; // Optional: if using lucide icons


const CodeVerify = ({ onClose }) => {
  const [showCode, setShowCode] = useState(false);
  const [registrationcode, setregistraionCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/admin/verify-code", {
        registrationCode: registrationcode,
      });
      if (res.data.success) {
        toast.success(res.data.message || "Code verified!");
        navigate("/register");
      } else {
        toast.error(res.data.message || "Invalid code");
      }
    } catch (err) {
      // Optionally extract backend error message if exists
      const message = err.response?.data?.message || "Something went wrong";
      console.log("error in verifying code", err);
      toast.error(message);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-white via-blue-100 to-green-200 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 shadow-lg max-w-sm w-full relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
          onClick={onClose}
        >
          ✖
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">
          Enter Secret Code
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <input
              type={showCode ? "text" : "password"}
              placeholder="Enter code"
              value={registrationcode}
              onChange={(e) => setregistraionCode(e.target.value)}
              className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowCode((prev) => !prev)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-black"
            >
              {showCode ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CodeVerify;

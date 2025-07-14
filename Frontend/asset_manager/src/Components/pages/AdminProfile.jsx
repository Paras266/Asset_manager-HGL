import { useEffect, useState } from "react";
import { FaUserCircle, FaEnvelope, FaShieldAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../../services/api"; // Adjust the import path as necessary
import axios from "axios";

export const AdminProfile = () => {
  const [admin, setadmin] = useState(null);
  console.log(admin);
  const navigate = useNavigate();
  useEffect(() => {


    const checkAuth = async () => {
        try {
          await api.get("admin/auth/me", { withCredentials: true }); // ✅ use credentials
        } catch (error) {
          console.log("in uplaod page : " ,error);
          
          toast.error("You must be logged in to access this page");
          navigate("/login");
        }
      };
  
   const fetchProfile = async () => {
      
      try {
        const res = await axios.get("http://localhost:4000/api/admin/profile", {
          withCredentials: true,
        });

        setadmin(res.data.data);
      } catch (error) {
        const message = error.response?.data?.message || "Failed to fetch peofile data";
        toast.error(message);
      }
    };
    checkAuth();
    fetchProfile();

  }, [navigate]);

  if (!admin) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold text-blue-500 animate-pulse">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-10 max-w-4xl mx-auto bg-white rounded-xl shadow-lg mt-8 mb-12">
      <h2 className="text-3xl font-bold text-center text-green-600 mb-6">
        Admin Profile
      </h2>

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
        <img
          src={admin.profileImage}
          alt="ProfileImage"
          className="w-24 h-24 rounded-full object-cover border-2 border-blue-400 shadow-md"
        />
        <div className="flex-1 w-full">
          <div className="mb-4">
            <label className="text-gray-600 flex items-center gap-2">
              <FaUserCircle className="text-green-500" />
              <span className="font-medium">Username:</span>
            </label>
            <div className="mt-1 p-2 border rounded bg-gray-50">
              {admin.username}
            </div>
          </div>

          <div className="mb-4">
            <label className="text-gray-600 flex items-center gap-2">
              <FaEnvelope className="text-green-500" />
              <span className="font-medium">Email:</span>
            </label>
            <div className="mt-1 p-2 border rounded bg-gray-50">
              {admin.email}
            </div>
          </div>

          <div className="mb-4">
            <label className="text-gray-600 flex items-center gap-2">
              <FaShieldAlt className="text-green-500" />
              <span className="font-medium">Role:</span>
            </label>
            <div className="mt-1 p-2 border rounded bg-gray-50 capitalize">
              {admin.role}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

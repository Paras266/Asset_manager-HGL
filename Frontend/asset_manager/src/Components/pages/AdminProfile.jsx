import { useEffect, useState } from "react";
import { FaUserCircle, FaEnvelope, FaShieldAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import axios from "axios";

export const AdminProfile = () => {
  const [admin, setadmin] = useState(null);
  console.log(admin);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/admin/profile", {
          withCredentials: true,
        });
        console.log(res.data);

        setadmin(res.data.data);
      } catch (error) {
        toast.error("Failed to load profile data");
        console.error(error);
      }
    };

    fetchProfile();
  }, []);

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

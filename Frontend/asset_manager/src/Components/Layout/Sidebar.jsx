// src/components/layout/Sidebar.jsx
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt, FaHome , FaFileUpload } from "react-icons/fa";
import api from "../../services/api.js"; // Adjust the import path as necessary

export const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    api.get("/admin/logout")
      .then((response) => {
        console.log("Logout successful:", response.data);
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="w-60 bg-blue-700 text-white flex flex-col p-4 min-h-screen">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">DASHBOARD</h2>
      </div>

      <nav className="flex-1 space-y-4">
        {/* Home */}
        <Link
          to="/dashboard"
          className="flex items-center gap-3 hover:bg-blue-600 p-2 rounded"
        >
          <FaHome size={20} />
          <span>Home</span>
        </Link>

        {/* View Profile */}
        <Link
          to="/dashboard/profile"
          className="flex items-center gap-3 hover:bg-blue-600 p-2 rounded"
        >
          <FaUserCircle size={20} />
          <span>View Profile</span>
        </Link>

        <Link
          to="/dashboard/upload"
          className="flex items-center gap-3 hover:bg-blue-600 p-2 rounded"
        >
          <FaFileUpload size={20} />

          <span>Uplod File</span>
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 hover:bg-blue-600 p-2 rounded w-full text-left"
        >
          <FaSignOutAlt size={20} />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
};

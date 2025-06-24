import { Link } from "react-router-dom";
import { FaUserPlus, FaPlusCircle, FaUserCircle } from "react-icons/fa";

export const Header = () => (
  <header className="bg-white/95 shadow-lg border-b border-gray-200 px-5 py-4 flex flex-wrap justify-between items-center backdrop-blur-md z-50">
    {/* Logo + Project Name */}
    <Link to="/dashboard" className="flex items-center gap-2 group">
      <img
        src="/haldyn_logo.jpg"
        alt="Haldyn Logo"
        className="h-8 sm:h-10 transition-transform group-hover:scale-105"
      />
      <span className="text-lg sm:text-xl md:text-2xl font-bold text-blue-700 group-hover:text-green-600 transition-colors whitespace-nowrap">
        Asset Manager
      </span>
    </Link>

    {/* Navigation Links */}
    <nav className="flex flex-wrap gap-4 sm:gap-6 items-center mt-3 sm:mt-0">
      {/* Add User */}
      <Link
        to="/dashboard/add-user"
        className="flex items-center gap-2 px-3 py-1.5 rounded-md text-blue-700 hover:bg-green-50 hover:text-green-600 transition-all duration-200"
      >
        <FaUserPlus className="text-md" />
        <span className="text-sm font-semibold">Add User</span>
      </Link>

      {/* Add Asset */}
      <Link
        to="/dashboard/add-asset"
        className="flex items-center gap-2 px-3 py-1.5 rounded-md text-blue-700 hover:bg-green-50 hover:text-green-600 transition-all duration-200"
      >
        <FaPlusCircle className="text-md" />
        <span className="text-sm font-semibold">Add Asset</span>
      </Link>

    
    </nav>
  </header>
);

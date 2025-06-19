import { Link } from 'react-router-dom';

export const Header = () => (
  <header className="bg-white/95 shadow-lg border-b border-gray-200 px-4 py-3 flex flex-wrap justify-between items-center backdrop-blur-md z-50">
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
    <nav className="flex flex-wrap gap-4 sm:gap-6 items-center text-blue-600 text-sm sm:text-md font-semibold mt-3 sm:mt-0">
      <Link
        to="/dashboard/add-user"
        className="flex items-center gap-1 hover:text-green-600 transition-colors duration-200"
      >
        <i className="fa fa-user-plus"></i>
        <span>Add User</span>
      </Link>

      <Link
        to="/dashboard/add-asset"
        className="flex items-center gap-1 hover:text-green-600 transition-colors duration-200"
      >
        <i className="fa fa-plus-circle"></i>
        <span>Add Asset</span>
      </Link>

      <Link
        to="/profile/me"
        className="text-xl hover:text-green-600 transition-colors duration-200"
        title="My Profile"
      >
        <i className="fa fa-user-circle"></i>
      </Link>
    </nav>
  </header>
);

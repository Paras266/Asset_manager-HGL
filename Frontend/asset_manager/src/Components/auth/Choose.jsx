import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CodeVerify from "./CodeVerify";
import { Toaster, toast } from "react-hot-toast";

export const Choose = () => {
  const [showCodeBox, setShowCodeBox] = useState(false);
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    setShowCodeBox(true);
    toast("Enter the verification code");
  };

  const handleClose = () => {
    setShowCodeBox(false);
    toast.error("Code Verification cancelled");
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-gradient-to-br from-white via-blue-50 to-green-100 flex items-center justify-center relative">
      {/* Toast container */}
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />

      {/* Soft translucent overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white-200/50 to-green-200/30 z-0 backdrop-blur-sm"></div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-blue-800 text-4xl sm:text-5xl font-bold mb-8 drop-shadow">
          Welcome to Admin Panel
        </h1>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-md transition duration-300"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-md transition duration-300"
            onClick={handleRegisterClick}
          >
            Register
          </button>
        </div>
      </div>

      {/* Code box modal */}
      {showCodeBox && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-2xl border border-blue-100">
            <CodeVerify onClose={handleClose} />
          </div>
        </div>
      )}
    </div>
  );
};

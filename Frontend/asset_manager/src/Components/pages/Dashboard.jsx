/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Services/api";
import { toast } from "react-hot-toast";

export const Dashboard = () => {
  const [assets, setAssets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await api.get("/assets/getAssets");
        setAssets(res.data.assets || []);
      } catch (err) {
        toast.error("Failed to load assets");
        console.error(err);
      }
    };

    fetchAssets();
  }, []);

  const totalAssets = assets.length;
  
  

const allocatedAssetsList = assets.filter((a) => a.status === "allocated");
const availableAssetsList = assets.filter((a) => a.status === "available");

const allocatedAssets = allocatedAssetsList.length;
const availableAssets = availableAssetsList.length;

  const allocatedPercent = totalAssets ? Math.round((allocatedAssets / totalAssets) * 100) : 0;
  const availablePercent = totalAssets ? Math.round((availableAssets / totalAssets) * 100) : 0;

  const Ring = ({ percent, label, color, onClick }) => (
    <div
      className="relative w-44 h-44 rounded-full border-8"
      style={{
        background: `conic-gradient(${color} ${percent}%, #e5e7eb ${percent}%)`,
        borderColor: color,
      }}
    >
      <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center text-center shadow-sm">
        <p className="text-xl font-bold text-gray-700">{percent}%</p>
        <p className="text-sm text-gray-500">{label}</p>
        <button
          onClick={onClick}
          className="mt-2 text-blue-600 text-xs underline hover:text-green-600 transition"
        >
          View Assets
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-700 mb-10">Asset Manager Dashboard</h1>

      {/* Two Progress Rings */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-10 mb-12">
        <Ring
          percent={allocatedPercent}
          label="Allocated Assets"
          color="#3b82f6"
          onClick={() => navigate("allocated")}
        />
        <Ring
          percent={availablePercent}
          label="Available Assets"
          color="#10b981"
          onClick={() => navigate("available")}
        />
      </div>

      {/* Functional Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <button
          onClick={() => navigate("assets")}
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg shadow-md transition"
        >
          Show All Assets
        </button>
        <button
          onClick={() => navigate("users")}
          className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg shadow-md transition"
        >
          Show All Users
        </button>
        <button
          onClick={() => navigate("search-by-serial")}
          className="bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-lg shadow-md transition"
        >
          Get Asset by Serial Number
        </button>
        <button
          onClick={() => navigate("userBycode")}
          className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg shadow-md transition"
        >
          Get User by Employee Code
        </button>
      </div>
    </div>
  );
};


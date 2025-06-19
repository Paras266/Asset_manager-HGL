import { useEffect, useState } from "react";
import api from "../../services/api";

export const AllocatedAssets = () => {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const fetchAllocatedAssets = async () => {
      try {
        const res = await api.get("/assets/getAllocatedAssets");
        setAssets(res.data.data || []);
      } catch (error) {
        console.error("Error fetching allocated assets:", error);
      }
    };

    fetchAllocatedAssets();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Allocated Assets</h1>
      <div className="overflow-x-auto bg-white shadow rounded-lg p-4">
        <table className="min-w-full text-left border">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">Device Type</th>
              <th className="px-4 py-2">Device Name</th>
              <th className="px-4 py-2">Model</th>
              <th className="px-4 py-2">Serial Number</th>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">User Email</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset._id} className="border-t">
                <td className="px-4 py-2">{asset.deviceType}</td>
                <td className="px-4 py-2">{asset.deviceName}</td>
                <td className="px-4 py-2">{asset.modelNumber}</td>
                <td className="px-4 py-2">{asset.serialNumber}</td>
                <td className="px-4 py-2">{asset.allocatedTo?.username || "N/A"}</td>
                <td className="px-4 py-2">{asset.allocatedTo?.email || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

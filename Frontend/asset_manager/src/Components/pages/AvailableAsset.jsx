import { useEffect, useState } from "react";
import api from "../../services/api";

export const AvailableAssets = () => {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const fetchAvailableAssets = async () => {
      try {
        const res = await api.get("/assets/getAvailableAssets");
        setAssets(res.data.data || []);
      } catch (error) {
        console.error("Error fetching available assets:", error);
      }
    };

    fetchAvailableAssets();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-green-700">Available Assets</h1>
      <div className="overflow-x-auto bg-white shadow rounded-lg p-4">
        <table className="min-w-full text-left border">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">Device Type</th>
              <th className="px-4 py-2">Device Name</th>
              <th className="px-4 py-2">Model</th>
              <th className="px-4 py-2">Serial Number</th>
              <th className="px-4 py-2">Condition</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset._id} className="border-t">
                <td className="px-4 py-2">{asset.deviceType}</td>
                <td className="px-4 py-2">{asset.deviceName}</td>
                <td className="px-4 py-2">{asset.modelNumber}</td>
                <td className="px-4 py-2">{asset.serialNumber}</td>
                <td className="px-4 py-2">{asset.deviceCondition}</td>
                <td className="px-4 py-2">{asset.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

import { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";

export const AvailableAssets = () => {
  const [allAssets, setAllAssets] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [filteredAssets, setFilteredAssets] = useState([]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await api.get("/assets/getAvailableAssets");
        setAllAssets(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch assets:", error);
        toast.error("Failed to fetch available assets");
      }
    };
    fetchAssets();
  }, []);

  const handleGetAsset = () => {
    if (!selectedType) {
      setFilteredAssets([]);
      return;
    }
    const filtered = allAssets.filter(
      (asset) => asset.deviceType.toLowerCase() === selectedType.toLowerCase()
    );
    if (filtered.length === 0) {
      toast.error("Device not found");
    }
    setFilteredAssets(filtered);
  };

  const uniqueDeviceTypes = [...new Set(allAssets.map((a) => a.deviceType))].sort();

  // Grouped allAssets by deviceType
  const groupedAssets = allAssets.reduce((acc, asset) => {
    const type = asset.deviceType;
    if (!acc[type]) acc[type] = [];
    acc[type].push(asset);
    return acc;
  }, {});

  const sortedTypes = [...new Set(allAssets.map((a) => a.deviceType))]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-green-700">Available Assets</h1>

      {/* Dropdown + Button */}
      <div className="flex items-center gap-4 mb-6">
        <select
          className="border border-gray-300 px-4 py-2 rounded shadow-sm"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">-- Select Device Type --</option>
          {uniqueDeviceTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <button
          onClick={handleGetAsset}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Get Asset
        </button>
      </div>

      {/* Filtered Table */}
      {filteredAssets.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-2 text-blue-600">
            Filtered Assets: {selectedType}
          </h2>
          <div className="overflow-x-auto bg-white shadow rounded-lg p-4">
            <table className="min-w-full text-left border">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2">Device Name</th>
                  <th className="px-4 py-2">Model</th>
                  <th className="px-4 py-2">Serial Number</th>
                  <th className="px-4 py-2">Condition</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset) => (
                  <tr key={asset._id} className="border-t">
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
      )}

      {/* Grouped All Available Assets Table */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-green-700">All Available Assets ({allAssets.length})</h2>
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
              {sortedTypes.map((type) =>
                groupedAssets[type].map((asset, index) => (
                  <tr key={asset._id} className="border-t">
                    <td className="px-4 py-2">
                      {index === 0 ? (
                        <span className="font-semibold text-blue-700">{type}</span>
                      ) : (
                        ""
                      )}
                    </td>
                    <td className="px-4 py-2">{asset.deviceName}</td>
                    <td className="px-4 py-2">{asset.modelNumber}</td>
                    <td className="px-4 py-2">{asset.serialNumber}</td>
                    <td className="px-4 py-2">{asset.deviceCondition}</td>
                    <td className="px-4 py-2">{asset.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

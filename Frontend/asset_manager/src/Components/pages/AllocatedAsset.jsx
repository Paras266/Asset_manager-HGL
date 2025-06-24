import React from "react";
import { useEffect, useState } from "react";
import api from "../../services/api";

export const AllocatedAssets = () => {
  const [assets, setAssets] = useState([]);
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [filteredAssets, setFilteredAssets] = useState([]);

  useEffect(() => {
    const fetchAllocatedAssets = async () => {
      try {
        const res = await api.get("/assets/getAllocatedAssets");
        const data = res.data.data || [];
        setAssets(data);

        // Extract unique device types
        const types = [...new Set(data.map((asset) => asset.deviceType))];
        setDeviceTypes(types);
      } catch (error) {
        console.error("Error fetching allocated assets:", error);
      }
    };

    fetchAllocatedAssets();
  }, []);

  const handleFilter = () => {
    if (selectedType) {
      const filtered = assets.filter((asset) => asset.deviceType === selectedType);
      setFilteredAssets(filtered);
    } else {
      setFilteredAssets([]);
    }
  };

  const groupedAssets = assets.reduce((groups, asset) => {
    if (!groups[asset.deviceType]) {
      groups[asset.deviceType] = [];
    }
    groups[asset.deviceType].push(asset);
    return groups;
  }, {});

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Allocated Assets</h1>

      {/* Dropdown and Button */}
      <div className="flex gap-4 mb-6">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Select Device Type</option>
          {deviceTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <button
          onClick={handleFilter}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Get Asset
        </button>
      </div>

      {/* Filtered Assets Table */}
      {filteredAssets.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-green-700 mb-2">Filtered Assets</h2>
          <table className="min-w-full text-left border bg-white shadow rounded">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2">Device Name</th>
                <th className="px-4 py-2">Serial Number</th>
                <th className="px-4 py-2">User Name</th>
                <th className="px-4 py-2">User Email</th>
                <th className="px-4 py-2">Contact Number</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset) => (
                <tr key={asset._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{asset.deviceName}</td>
                  <td className="px-4 py-2">{asset.serialNumber}</td>
                  <td className="px-4 py-2">{asset.allocatedTo?.username || "N/A"}</td>
                  <td className="px-4 py-2">{asset.allocatedTo?.email || "N/A"}</td>
                  <td className="px-4 py-2">{asset.allocatedTo?.contactNumber || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Grouped Allocated Assets Table */}
      <h2 className="text-xl font-semibold text-blue-700 mb-2">All Allocated Assets ({assets.length})</h2>
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full text-left border">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">Device Type</th>
              <th className="px-4 py-2">Device Name</th>
              <th className="px-4 py-2">Serial Number</th>
              <th className="px-4 py-2">User Name</th>
              <th className="px-4 py-2">User Email</th>
              <th className="px-4 py-2">Employee Code</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedAssets).map(([type, items]) => (
              <React.Fragment key={type}>
                {items.map((asset, idx) => (
                  <tr key={asset._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{idx === 0 ? type : ""}</td>
                    <td className="px-4 py-2">{asset.deviceName}</td>
                    <td className="px-4 py-2">{asset.serialNumber}</td>
                    <td className="px-4 py-2">{asset.allocatedTo?.username || "N/A"}</td>
                    <td className="px-4 py-2">{asset.allocatedTo?.email || "N/A"}</td>
                    <td className="px-4 py-2">{asset.allocatedTo?.employeeCode || "N/A"}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import api from "../../services/api";
import { toast } from "react-hot-toast";

export const GetAssetBySr = () => {
  const [serialNumber, setSerialNumber] = useState("");
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAsset = async () => {
    if (!serialNumber.trim()) return toast.error("Enter a serial number");
    setLoading(true);
    try {
      const res = await api.post("/assets/getAssetsBySerialno", { serialNumber });
      setAsset(res.data.data);
    } catch (err) {
      toast.error("Asset not found");
      setAsset(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this asset?")) return;

    try {
      await api.delete(`/assets/delete/${asset._id}`);
      toast.success("Asset deleted successfully");
      setAsset(null);
      setSerialNumber("");
    } catch (err) {
      toast.error("Failed to delete asset");
    }
  };

  return (
    <div className="p-6 text-gray-800">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Get Asset by Serial Number</h1>
      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          value={serialNumber}
          onChange={(e) => setSerialNumber(e.target.value)}
          placeholder="Enter serial number"
          className="border p-2 rounded w-80"
        />
        <button
          onClick={fetchAsset}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {loading ? "Loading..." : "Search"}
        </button>
        {/* <button
            onClick={handleDelete}
            className=" bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete Asset
          </button> */}
      </div>

      {asset && (
        <div className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">Asset Details</h2>
          <table className="min-w-full mb-4 border">
            <tbody>
              {[
                ["Device Type", asset.deviceType],
                ["Device Name", asset.deviceName],
                ["Model Number", asset.modelNumber],
                ["Serial Number", asset.serialNumber],
                ["Status", asset.status],
              ].map(([label, value]) => (
                <tr key={label}>
                  <td className="px-4 py-2 font-medium bg-gray-100">{label}</td>
                  <td className="px-4 py-2">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 className="text-lg font-semibold text-blue-700 mb-2">Allocation History</h3>
          {asset.allocationHistory?.length > 0 ? (
            <ul className="space-y-3">
              {asset.allocationHistory.map((entry, index) => (
                <li key={index} className="p-3 border rounded bg-gray-50">
                  <p><strong>User:</strong> {entry.user?.username} ({entry.user?.email})</p>
                  <p><strong>Allocated:</strong> {new Date(entry.allocatedDate).toLocaleString()}</p>
                  <p><strong>Deallocated:</strong> {entry.deallocatedDate ? new Date(entry.deallocatedDate).toLocaleString() : "Currently in use"}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No allocation history found.</p>
          )}

          
        </div>
      )}
    </div>
  );
};


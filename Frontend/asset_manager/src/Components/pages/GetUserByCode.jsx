/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import api from "../../services/api";
import { toast } from "react-hot-toast";

export const GetUserByCode = () => {
  const [employeeCode, setEmployeeCode] = useState("");
  const [userData, setUserData] = useState(null);
  const [assets, setAssets] = useState([]);
  const [availableAssets, setAvailableAssets] = useState([]);
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    if (!employeeCode.trim()) return toast.error("Enter employee code");
    setLoading(true);
    try {
      const res = await api.post(`/users/getUserById`, { employeeCode });
      setUserData(res.data.user);
      setAssets(res.data.asset);
      fetchAvailableAssets(); // fetch available assets
    } catch (error) {
      toast.error("User not found");
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableAssets = async () => {
    try {
      const res = await api.get("/assets/getAvailableAssets");
  
      const available = res.data?.data || [];
  
      if (available.length === 0) {
        toast.error("No available assets found");
        setAvailableAssets([]); // Clear list to be safe
        return;
      }
  
      setAvailableAssets(available);
      console.log("Available assets from backend:", available);
    } catch (err) {
      console.error("Error fetching available assets:", err);
      toast.error("Failed to fetch assets. Please check your server.");
    }
  };
  

  const handleDeallocate = async (assetId) => {
    try {
      await api.put("/assets/deallocate", {
        userId: userData._id,
        assetId,
      });
      toast.success("Asset deallocated");
      handleFetch();
    } catch {
      toast.error("Failed to deallocate asset");
    }
  };

  const handleAllocate = async () => {
    if (!selectedAssetId) return toast.error("Select an asset to allocate");
     console.log("Selected asset ID:", selectedAssetId ,  "User ID:", userData._id);
     
    try {
      await api.put("/assets/allocate", {
        userId: userData._id,
        assetId: selectedAssetId,
      });
      toast.success("Asset allocated successfully");
      setSelectedAssetId("");
      handleFetch();
    } catch {
      toast.error("Failed to allocate asset");
    }
  };

  const handleDeleteUser = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user? This action cannot be undone.");
    if (!confirmDelete) return;
  
    try {
      await api.delete(`/users/delete/${userData._id}`);
      toast.success("User deleted successfully");
  
      // Reset UI
      setUserData(null);
      setAssets([]);
      setEmployeeCode("");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete user");
    }
  };
  

  return (
    <div className="p-6 text-gray-800 over">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">
        Get User by Employee Code
      </h1>

      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Enter employee code"
          value={employeeCode}
          onChange={(e) => setEmployeeCode(e.target.value)}
          className="border p-2 rounded w-64"
        />
        <button
          onClick={handleFetch}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {loading ? "Loading..." : "Search"}
        </button>
        {/* Delete User */}
{/* <div className=" text-right">
  <button
    onClick={handleDeleteUser}
    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
  >
    Delete User
  </button>
</div> */}

      </div>

      {/* Asset Assignment History */}
{/* <div className="mt-6">
  <h2 className="text-lg font-semibold text-blue-700 mb-2">
    Asset Assignment History
  </h2> */}

  {/* {userData.assignedItems && userData.assignedItems.length > 0 ? (
    <table className="min-w-full border text-sm shadow-sm rounded bg-white">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 text-left">Device Name</th>
          <th className="p-2 text-left">Device Type</th>
          <th className="p-2 text-left">Serial Number</th>
          <th className="p-2 text-left">Allocated On</th>
          <th className="p-2 text-left">Deallocated On</th>
        </tr>
      </thead>
      <tbody>
        {userData.assignedItems.map((item, index) => (
          <tr key={index} className="border-t">
            <td className="p-2">{item.asset?.deviceName || "N/A"}</td>
            <td className="p-2">{item.asset?.deviceType || "N/A"}</td>
            <td className="p-2">{item.asset?.serialNumber || "N/A"}</td>
            <td className="p-2">
              {item.allocatedDate
                ? new Date(item.allocatedDate).toLocaleDateString()
                : "N/A"}
            </td>
            <td className="p-2">
              {item.deallocatedDate
                ? new Date(item.deallocatedDate).toLocaleDateString()
                : "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p className="text-gray-600">No asset history available.</p>
  )}
</div> */}


      {userData && (
        <div className="bg-white shadow rounded-lg p-4 ">
          {/* User Info Table */}
          <h2 className="text-xl font-semibold text-blue-700 mb-2">
            User Details
          </h2>
          <table className="min-w-full text-left border mb-6 ">
            <tbody className="divide-y">
              {Object.entries(userData).map(
                ([key, value]) =>
                  !["_id", "__v", "currentItem", "assignedItems"].includes(key) && (
                    <tr key={key}>
                      <th className="capitalize px-4 py-2 bg-gray-100">
                        {key}
                      </th>
                      <td className="px-4 py-2">
                        {typeof value === "object"
                          ? JSON.stringify(value)
                          : value?.toString()}
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </table>

          {/* Current Assets */}
          <div>
            <h2 className="text-lg font-semibold text-blue-700 mb-2">
              Allocated Assets
            </h2>

            {assets.length > 0 ? (
              assets.map((asset) => (
                <div
                  key={asset._id}
                  className="p-4 mb-3 border rounded bg-gray-50 shadow-sm"
                >
                  <p>
                    <strong>{asset.deviceType}:</strong> {asset.deviceName}
                  </p>
                  <p>
                    <strong>Model:</strong> {asset.modelNumber} |{" "}
                    <strong>Serial:</strong> {asset.serialNumber}
                  </p>
                  <button
                    onClick={() => handleDeallocate(asset._id)}
                    className="mt-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Deallocate
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No assets currently assigned.</p>
            )}
          </div>

          {/* Allocate New Asset */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-blue-700 mb-2">
              Allocate New Asset
            </h2>
            <div className="flex items-center gap-4">
              <select
                value={selectedAssetId}
                onChange={(e) => setSelectedAssetId(e.target.value)}
                className="border p-2 rounded w-80"
              >
                <option value="">Select an available asset</option>
                {availableAssets.map((asset) => (
                  <option key={asset._id} value={asset._id}>
                    {asset.deviceType} - {asset.deviceName} ({asset.serialNumber})
                  </option>
                ))}
              </select>
              <button
                onClick={handleAllocate}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Allocate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

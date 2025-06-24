import { useState, useRef } from "react";
import api from "../../services/api";
import { toast } from "react-hot-toast";

export const ExcelUpload = () => {
  const [userFileName, setUserFileName] = useState("");
  const [assetFileName, setAssetFileName] = useState("");

  const userInputRef = useRef(null);
  const assetInputRef = useRef(null);

  const handleUpload = async (type) => {
    const fileInput = type === "user" ? userInputRef.current : assetInputRef.current;
    const file = fileInput?.files[0];

    if (!file) return toast.error("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post(`/upload/${type === "user" ? "users" : "assets"}`, formData);
      toast.success(`${type === "user" ? "Users" : "Assets"} uploaded successfully`);

      // Clear input
      fileInput.value = null;
      if (type === "user") setUserFileName("");
      else setAssetFileName("");
    } catch (error) {
      console.error(error);
      toast.error("Upload failed");
    }
  };

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold text-blue-700">Excel Upload</h2>

      {/* User Upload */}
      <div className="bg-white p-4 shadow rounded-lg">
        <label className="block font-medium mb-2 text-gray-700">Upload Users Master</label>
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept=".xlsx, .xls"
            ref={userInputRef}
            className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            onChange={(e) => setUserFileName(e.target.files[0]?.name || "")}
          />
          {userFileName && <span className="text-gray-600 text-sm">{userFileName}</span>}
        </div>
        <button
          onClick={() => handleUpload("user")}
          className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Upload Users
        </button>
      </div>

      {/* Asset Upload */}
      <div className="bg-white p-4 shadow rounded-lg">
        <label className="block font-medium mb-2 text-gray-700">Upload Assets Master</label>
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept=".xlsx, .xls"
            ref={assetInputRef}
            className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            onChange={(e) => setAssetFileName(e.target.files[0]?.name || "")}
          />
          {assetFileName && <span className="text-gray-600 text-sm">{assetFileName}</span>}
        </div>
        <button
          onClick={() => handleUpload("asset")}
          className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Upload Assets
        </button>
      </div>
    </div>
  );
};

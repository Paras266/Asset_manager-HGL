/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";



const CONDITION_OPTIONS = ["New", "Good", "Fair", "Damaged", "Repaired"];
const STORAGE_TYPES = ["SATA", "SSD", "HDD", "NVMe"];
const IP_ASSIGNMENTS = ["Manual", "DHCP"];
const STATUS_OPTIONS = ["repair", "damaged", "scrape"]; // Only editable if asset is not allocated

export const ViewAssets = () => {
  const [allAssets, setAllAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [expandedTypes, setExpandedTypes] = useState({});
  const [editIndex, setEditIndex] = useState(null);
  const [editedAsset, setEditedAsset] = useState({});

  const editableFields = [
    "deviceType", "modelNumber", "partNumber", "serialNumber", "exportCode",
    "ram", "processor", "storageType", "storageCapacity", "deviceName",
    "ipAssignment", "ipAddress", "lanMacAddress", "wifiMacAddress",
    "vendorName", "vendorContactNumber", "vendorEmail", "invoiceNumber",
    "purchaseOrderNumber", "warrantyType", "warrantyPeriod", "deviceCost",
    "capexNumber", "deviceCondition", "mouseSerialNumber", "keyboardSerialNumber",
    "monitorScreenSize", "monitorSerialNumber", "osKey", "officeKey", "status"
  ];

  const DEVICE_TYPES = [...new Set(allAssets.map((asset) => asset.deviceType))];


  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const res = await api.get("/assets/getAssets");
      if (res.data.success) {
        const sortedAssets = sortAssetsByType(res.data.assets);
        setAllAssets(sortedAssets);
  
        if (selectedType) {
          const filtered = res.data.assets.filter((a) => a.deviceType === selectedType);
          setFilteredAssets(filtered);
          setExpandedTypes({ [selectedType]: true });
  
          if (filtered.length === 0) {
            toast.error(`No assets found for ${selectedType}`);
          }
        }
      } else {
        toast.error("No assets found");
      }
    } catch (error) {
      console.error("Error fetching assets:", error);
      toast.error("Failed to load assets");
    }
  };
  

  const sortAssetsByType = (assets) => {
    const typeOrder = DEVICE_TYPES.reduce((acc, type, index) => {
      acc[type] = index;
      return acc;
    }, {});
    return assets.sort((a, b) => {
      const aOrder = typeOrder[a.deviceType] ?? DEVICE_TYPES.length;
      const bOrder = typeOrder[b.deviceType] ?? DEVICE_TYPES.length;
      return aOrder - bOrder;
    });
  };

  const handleEdit = (index, source) => {
    setEditIndex({ index, source });
    const assetList = source === "filtered" ? filteredAssets : allAssets;
    setEditedAsset({ ...assetList[index] });
  };

  const handleCancel = () => {
    setEditIndex(null);
    setEditedAsset({});
  };

  const handleChange = (e) => {
    setEditedAsset({ ...editedAsset, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const { allocatedTo, previousUsers, createdAt, updatedAt, __v, ...dataToUpdate } = editedAsset;
      const res = await api.put(`/assets/update/${editedAsset._id}`, dataToUpdate);
      if (res.data.success) {
        toast.success("Asset updated");
        const updatedList = editIndex.source === "filtered" ? [...filteredAssets] : [...allAssets];
        updatedList[editIndex.index] = editedAsset;
        editIndex.source === "filtered" ? setFilteredAssets(updatedList) : setAllAssets(updatedList);
        setEditIndex(null);
        setEditedAsset({});
      } else {
        toast.error("Failed to update");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Error updating asset");
    }
  };

  const exportToExcel = () => {
    const cleanData = allAssets.map(({ allocatedTo, previousUsers, __v, createdAt, updatedAt, ...a }) => a);
    const worksheet = XLSX.utils.json_to_sheet(cleanData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "AllAssets");
    XLSX.writeFile(workbook, "AllAssets.xlsx");
  };

  const exportToExcel2 = () => {
    const cleanData = filteredAssets.map(({ allocatedTo, previousUsers, __v, createdAt, updatedAt, ...a }) => a);
    const worksheet = XLSX.utils.json_to_sheet(cleanData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "FilteredAssets");
    XLSX.writeFile(workbook, "FilteredAssets.xlsx");
  };

  const toggleCollapse = (type) => {
    setExpandedTypes((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const renderInput = (field, value, disabled = false) => {
    const commonProps = {
      name: field,
      value: value || "",
      onChange: handleChange,
      className: "border px-2 py-1 rounded w-full",
      disabled
    };

    if (field === "deviceCondition") {
      return (
        <select {...commonProps}>
          <option value="">Select</option>
          {CONDITION_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      );
    }

    if (field === "storageType") {
      return (
        <select {...commonProps}>
          <option value="">Select</option>
          {STORAGE_TYPES.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      );
    }

    if (field === "ipAssignment") {
      return (
        <select {...commonProps}>
          <option value="">Select</option>
          {IP_ASSIGNMENTS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      );
    }

    if (field === "status") {
      const isAllocated = editedAsset?.allocatedTo;
      return (
        <select {...commonProps} disabled={!!isAllocated}>
          <option value="">Select</option>
          {STATUS_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      );
    }

    return <input type="text" {...commonProps} />;
  };

  const renderTable = (assets, source) => (
    <table className="min-w-[1500px] w-full text-sm text-left border-t">
      <thead className="bg-blue-200 text-blue-900 font-semibold">
        <tr>
          {editableFields.map((field) => (
            <th key={field} className="p-2 capitalize">
              {field.replace(/([A-Z])/g, " $1")}
            </th>
          ))}
          <th className="p-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {assets.map((asset, index) => (
          <tr key={asset._id} className="border-b hover:bg-gray-50">
            {editableFields.map((field) => (
              <td key={field} className="p-2">
                {editIndex?.index === index && editIndex?.source === source
                  ? renderInput(field, editedAsset[field])
                  : asset[field] || "-"}
              </td>
            ))}
            <td className="p-2 whitespace-nowrap">
              {editIndex?.index === index && editIndex?.source === source ? (
                <>
                  <button onClick={handleSave} className="bg-blue-600 text-white px-2 py-1 rounded mr-2">Save</button>
                  <button onClick={handleCancel} className="bg-gray-500 text-white px-2 py-1 rounded">Cancel</button>
                </>
              ) : (
                <button onClick={() => handleEdit(index, source)} className="bg-blue-600 text-white px-2 py-1 rounded">Edit</button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="p-6 text-gray-800">
      <div className="flex items-center gap-4 mb-6">
        <select
          className="border rounded px-4 py-2 text-gray-700"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">Select Device Type</option>
          {DEVICE_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <button onClick={fetchAssets} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Get Assets
        </button>

        <button onClick={exportToExcel2} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Export Filtered
        </button>
      </div>

      {filteredAssets.length > 0 && selectedType && (
        <div className="mb-8 border border-gray-300 rounded">
          <div
            className="bg-blue-100 px-4 py-2 cursor-pointer flex justify-between items-center"
            onClick={() => toggleCollapse(selectedType)}
          >
            <h2 className="text-lg font-semibold text-blue-800">
              {selectedType} Assets ({filteredAssets.length})
            </h2>
            <span className="text-blue-600 text-sm">
              {expandedTypes[selectedType] ? "▲ Collapse" : "▼ Expand"}
            </span>
          </div>
          {expandedTypes[selectedType] && <div className="overflow-auto">{renderTable(filteredAssets, "filtered")}</div>}
        </div>
      )}

      <div className="border-t pt-6 mt-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-blue-700">All Assets ({allAssets.length})</h1>
          <button onClick={exportToExcel} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Export All
          </button>
        </div>
        <div className="overflow-auto">
          {renderTable(allAssets, "all")}
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";

export const ViewSingleAsset = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [asset, setAsset] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const res = await api.get(`/assets/getassetById/${id}`);
        setAsset(res.data.asset);
        setFormData(res.data.asset); // initialize form
      } catch (err) {
        console.error("Failed to fetch asset:", err);
        toast.error("Failed to fetch asset details");
      }
    };
    fetchAsset();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const res = await api.put(`/assets/update/${id}`, formData);
      setAsset(res.data.data);
      setIsEditing(false);
      toast.success("Asset updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update asset");
    }
  };

  if (!asset) return <div>Loading...</div>;

  const renderInput = (label, name) => (
    <div key={name}>
      <strong>{label}:</strong>{" "}
      {isEditing ? (
        <input
          type="text"
          name={name}
          value={formData[name] || ""}
          onChange={handleChange}
          className="border px-2 py-1 rounded w-full"
        />
      ) : (
        <span>{asset[name] || "-"}</span>
      )}
    </div>
  );

  const handleUploadInvoice = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf,.jpg,.jpeg,.png";

    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formDataToSend = new FormData();
      formDataToSend.append("file", file);

      try {
        setUploading(true);
        const res = await api.put(
          `/assets/uploadInvoice/${id}`,
          formDataToSend,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        // Update the asset with new invoice URL
        setAsset((prev) => ({
          ...prev,
          invoice: res.data.invoiceUrl,
        }));
        toast.success("Invoice uploaded successfully");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to upload invoice");
      } finally {
        setUploading(false);
      }
    };

    fileInput.click();
  };

  const downloadInvoice = (url) => {
    // Force download using an anchor element
    const link = document.createElement("a");
    link.href = url.replace("/upload/", "/upload/fl_attachment/"); // cloudinary trick
    link.download = ""; // Optional: force browser to treat it as downloadable
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // list of fields to display (excluding _id, __v, allocationHistory, invoice)
  const fields = [
    ["Device Type", "deviceType"],
    ["Device Name", "deviceName"],
    ["Serial Number", "serialNumber"],
    ["Model Number", "modelNumber"],
    ["Part Number", "partNumber"],
    ["RAM", "ram"],
    ["Processor", "processor"],
    ["Storage Type", "storageType"],
    ["Storage Capacity", "storageCapacity"],
    ["OS Key", "OsKey"],
    ["Office Key", "OfficeKey"],
    ["IP Assignment", "ipAssignment"],
    ["IP Address", "ipAddress"],
    ["LAN MAC Address", "lanMacAddress"],
    ["WiFi MAC Address", "wifiMacAddress"],
    ["Operating System", "operatingSystem"],
    ["Office Application", "officeApplication"],
    ["Vendor Name", "vendorName"],
    ["Vendor Contact Number", "vendorContactNumber"],
    ["Vendor Email", "vendorEmail"],
    ["Vendor Invoice Number", "vendorInvoiceNumber"],
    ["Purchase Order Number", "purchaseOrderNumber"],
    ["Warranty Type", "warrantyType"],
    ["Warranty Period", "warrantyPeriod"],
    ["Device Cost", "deviceCost"],
    ["CAPEX Number", "capexNumber"],
    ["Device Condition", "deviceCondition"],
    ["Mouse Serial Number", "mouseSerialNumber"],
    ["Keyboard Serial Number", "keyboardSerialNumber"],
    ["Monitor Screen Size", "monitorScreenSize"],
    ["Monitor Serial Number", "monitorSerialNumber"],
    ["Other Details", "otherDetails"],
    ["Status", "status"],
  ];

  return (
    <div className="p-4">
      <button
        onClick={() => navigate("/dashboard/assets")}
        className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded"
      >
        &larr; Back
      </button>
      <h2 className="text-xl font-bold mb-4">Asset Details</h2>

      <div className="grid grid-cols-2 gap-4">
        {fields.map(([label, name]) => renderInput(label, name))}
      </div>

      <div className="mt-6 flex gap-4">
        {asset.invoice ? (
          <>
            {/* <a
              href={asset.invoice}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              View Invoice
            </a> */}
            <button
              onClick={() => downloadInvoice(asset.invoice)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Download Invoice
            </button>
            <button
              onClick={handleUploadInvoice}
              disabled={uploading}
              className={`bg-blue-600 text-white px-4 py-2 rounded ${
                uploading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {uploading ? "Uploading..." : "Edit Invoice"}
            </button>
          </>
        ) : (
          <button
            onClick={handleUploadInvoice}
            disabled={uploading}
            className={`bg-blue-600 text-white px-4 py-2 rounded ${
              uploading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {uploading ? "Uploading..." : "Add Invoice"}
          </button>
        )}

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-yellow-600 text-white px-4 py-2 rounded"
          >
            Edit Asset
          </button>
        ) : (
          <button
            onClick={handleUpdate}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
        )}
      </div>
    </div>
  );
};

/* eslint-disable no-unused-vars */
// src/Components/pages/AddAsset.jsx
import { useState } from "react";
import api from "../../services/api";
import { toast } from "react-hot-toast";

const initialState = {
  deviceType: "",
  OsKey: "",
  OfficeKey: "",
  operatingSystem: "",
  officeApplication: "",
  modelNumber: "",
  partNumber: "",
  serialNumber: "",
  express_serviceCode: "",
  ram: "",
  processor: "",
  storageType: "",
  storageCapacity: "",
  deviceName: "",
  ipAssignment: "",
  ipAddress: "",
  lanMacAddress: "",
  wifiMacAddress: "",
  vendorName: "",
  vendorContactNumber: "",
  vendorEmail: "",
  vendorInvoiceNumber: "",
  purchaseOrderNumber: "",
  warrantyType: "",
  warrantyPeriod: "",
  deviceCost: "",
  capexNumber: "",
  deviceCondition: "Good",
  mouseSerialNumber: "",
  keyboardSerialNumber: "",
  monitorScreenSize: "",
  monitorSerialNumber: "",
  otherDetails: "",
  file: null, // for file upload
  status: "available"
};

export const AddAsset = () => {
  const [form, setForm] = useState(initialState);

  // Handles both text and file inputs
  const [invoiceFile, setInvoiceFile] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
      setInvoiceFile(files[0]);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // Step 1: Submit asset details (excluding invoiceFile)
    const { file, ...assetData } = form;

    const res = await api.post("/assets/add", assetData);
    console.log(res.data);
    
    const assetId = res.data.asset._id;
    console.log(assetId);
    
    // Step 2: If invoice selected, upload it
    if (invoiceFile) {
      const formData = new FormData();
      formData.append("file", invoiceFile);

      await api.put(`/assets/uploadInvoice/${assetId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Invoice uploaded");
    }

    toast.success("Asset added successfully");
    setForm(initialState);
    setInvoiceFile(null); // Reset file input
    // Reset the file input element's value as well
    if (document.querySelector('input[type="file"][name="file"]')) {
      document.querySelector('input[type="file"][name="file"]').value = "";
    }
  } catch (error) {
    const message = error.response?.data?.message || "Failed to add asset";
    toast.error(message);
    console.error("Asset add failed", error);
  }
};


  return (
    <div className="p-4 md:p-8 max-h-screen overflow-y-auto">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Add New Asset</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        {[
          { label: "Device Type", name: "deviceType", type: "select", options: ['Laptop', 'Desktop System', 'Monitor', 'Printer', 'UPS' ,'Storage Devices' , 'Server','Networking Devices', 'Wireless Mouse', 'Keyboard and Mouse' ,'Other'] },
          { label: "OS Key", name: "OsKey" },
          { label: "Office Key", name: "OfficeKey" },
          { label: "Operating System", name: "operatingSystem" },
          { label: "Office Application", name: "officeApplication" },
          { label: "Model Number", name: "modelNumber" },
          { label: "Part Number", name: "partNumber" },
          { label: "Serial Number", name: "serialNumber" },
          { label: "Express Service Code", name: "express_serviceCode" }, 
          { label: "RAM", name: "ram" },
          { label: "Processor", name: "processor" },
          { label: "Storage Type", name: "storageType", type: "select", options: ["SATA", "SSD", "HDD", "NVMe" , "None"] },
          { label: "Storage Capacity", name: "storageCapacity" },
          { label: "Device Name", name: "deviceName" },
          { label: "IP Assignment", name: "ipAssignment", type: "select", options: ["Manual", "DHCP" , "None"] },
          { label: "IP Address", name: "ipAddress" },
          { label: "LAN MAC Address", name: "lanMacAddress" },
          { label: "WiFi MAC Address", name: "wifiMacAddress" },
          { label: "Vendor Name", name: "vendorName" },
          { label: "Vendor Contact Number", name: "vendorContactNumber" },
          { label: "Vendor Email", name: "vendorEmail" },
          { label: "Vendor Invoice Number", name: "vendorInvoiceNumber" },
          { label: "Purchase Order Number", name: "purchaseOrderNumber" },
          { label: "Warranty Type", name: "warrantyType" },
          { label: "Warranty Period", name: "warrantyPeriod" },
          { label: "Device Cost", name: "deviceCost", type: "number" },
          { label: "CAPEX Number", name: "capexNumber" },
          { label: "Device Condition", name: "deviceCondition", type: "select", options: ["New", "Good", "Fair", "Damaged", "Repaired"] },
          { label: "Mouse Serial Number", name: "mouseSerialNumber" },
          { label: "Keyboard Serial Number", name: "keyboardSerialNumber" },
          { label: "Monitor Screen Size", name: "monitorScreenSize" },
          { label: "Monitor Serial Number", name: "monitorSerialNumber" },
          { label: "Other Details", name: "otherDetails" },
          { label: "Status", name: "status", type: "select", options: ["available", "repair", "damaged"] } ,
          { label: "Upload Invoice", name: "file" , type: "file" , accept: ".jpg,.jpeg,.png,.webp,.pdf" }

        ].map(({ label, name, type,accept, options }) => (
          <div key={name} className="flex flex-col">
            <label htmlFor={name} className="font-medium mb-1">{label}</label>
            {type === "select" ? (
              <select name={name} value={form[name]} onChange={handleChange} className="border border-gray-300 p-2 rounded">
                <option value="">Select {label}</option>
                {options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                type={type || "text"}
                name={name}
                {...(type === "file"
                  ? { onChange: handleChange, className: "border border-gray-300 p-2 rounded", accept }
                  : { value: form[name] || "", onChange: handleChange, className: "border border-gray-300 p-2 rounded" }
                )}
              />
            )}
          </div>
        ))}

        <div className="md:col-span-2">
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition">
            Add Asset
          </button>
        </div>
      </form>
    </div>
  );
};


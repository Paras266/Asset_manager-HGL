/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import api from "../../services/api"; // your Axios instance
import { toast } from "react-hot-toast";

const initialUser = {
  username: "",
  email: "",
  department: "",
  employeeCode: "",
  designation: "",
  contactNumber: "",
  reportingPerson: "",
  dateOfJoining: "",
  dateOfBirth: "",
  location: "",
  permanentAddress: "",
  presentAddress: "",
  roleInCompany: "",
  assetId: "", // selected asset
};

const departments = ["IT", "HR", "Finance", "Production", "Planing", "Manufacture", "Design", "Quality"];
const designations = ["Manager", "Engineer", "Technician", "Intern", "Executive", "GET"];

export const AddUser = () => {
  const [form, setForm] = useState(initialUser);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    api.get("/assets/getassets")
      .then((res) => {
        const availableAssets = res.data.assets.filter(asset => asset.status === "available");
        setAssets(availableAssets);
      })
      .catch((err) => {
        toast.error("Failed to load assets");
        console.error(err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting form:", form);
      
      const res = await api.post("/users/AddUser", form);
      toast.success("User added and asset assigned!");
      setForm(initialUser);
    } catch (error) {
      toast.error("Failed to add user");
      console.error(error);
    }
  };

  return (
    <div className="p-4 md:p-8 max-h-screen ">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Add New User</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        {[{ label: "Name", name: "username" },
          { label: "Email", name: "email" },
          { label: "Employee Code", name: "employeeCode" },
          { label: "Contact Number", name: "contactNumber" },
          { label: "Reporting Person", name: "reportingPerson" },
          { label: "Date of Joining", name: "dateOfJoining", type: "date" },
          { label: "Date of Birth", name: "dateOfBirth", type: "date" },
          { label: "Location", name: "location" },
          { label: "Permanent Address", name: "permanentAddress" },
          { label: "Present Address", name: "presentAddress" },
          { label: "Role in Company", name: "roleInCompany" }
        ].map(({ label, name, type }) => (
          <div key={name} className="flex flex-col">
            <label className="mb-1 font-medium">{label}</label>
            <input
              type={type || "text"}
              name={name}
              value={form[name]}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded"
            />

          </div>
        ))}

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Department</label>
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded"
          >
            <option value="">Select Department</option>
            {departments.map(dep => (
              <option key={dep} value={dep}>{dep}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Designation</label>
          <select
            name="designation"
            value={form.designation}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded"
          >
            <option value="">Select Designation</option>
            {designations.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Assign Asset</label>
          <select
            name="assetId"
            value={form.assetId}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded"
          >
            <option value="">Select Available Asset</option>
            {assets.map((asset) => (
              <option key={asset._id} value={asset._id}>
                {asset.deviceType} - {asset.serialNumber}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">

          <button type="submit" className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition">
            Add User & Assign Asset
          </button>
        </div>
      </form>
    </div>
  );
};



/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import api from "../../services/api";
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
  assetId: "",
};

const departments = [
  "Engineering Services",
  "Workshop",
  "Glass",
  "Production 3",
  "Operations",
  "Warehouse",
  "Quality 3",
  "Quality",
  "Production 4",
  "Stores",
  "Design",
  "Accounts",
  "I S Maintenance",
  "IT",
  "MRS",
  "Foundry",
  "Administration",
  "Quality 4",
  "PPC & NPD",
  "Improvement Cell",
  "Human Resources",
  "Exports",
  "Purchase",
  "Logistics",
  "Sales",
  "Costing & MIS",
  "Safety"
];
const designations =  [
  "Sr. Electrician",
  "Assistant Manager",
  "Asst. Manager",
  "Sr. Supervisor",
  "Officer",
  "Sr. Officer",
  "Jr. Officer",
  "Jr. Supervisor",
  "Sr. Assistant",
  "Operator",
  "Deputy Manager",
  "Supervisor",
  "Asst Manager",
  "Sr.Technician",
  "Assistant",
  "C.N.C Operator",
  "Technical Assistant",
  "Lab Assistant",
  "Trainee",
  "Timekeeper",
  "Manager",
  "Worker Trainee",
  "Senior Manager - (Electrical)",
  "General Manager-Group Engg Head",
  "Asst General Manager",
  "Timekeepar",
  "Asst Mgr",
  "Senior Manager",
  "Executive",
  "General Manager",
  "Asst.Supervisor",
  "Sr.Exective",
  "Sr Manager",
  "Sr.Executive",
  "Asst Operator",
  "Sr Executive",
  "Sr. Manager",
  "GET",
  "Time Keeper Trainee",
  "Shift Supervisor",
  "CNC Supervisor",
  "Jr.Supervisor",
  "Jr. Executive",
  "Mentor",
  "DGM",
  "Management Trainee",
  "Technician"
];

export const AddUser = () => {
  const [form, setForm] = useState(initialUser);
  const [assets, setAssets] = useState([]);
  const [errors, setErrors] = useState({});
  const [Adding, setAdding] = useState(false)
  useEffect(() => {
    api.get("/assets/getassets")
      .then((res) => {
        const availableAssets = res.data.assets.filter(asset => asset.status === "available");
        setAssets(availableAssets);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Failed to load assets");
        console.error(err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    // Clear error on field change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
     setAdding(true);
    const requiredFields = [
      "username", "email", "department", "employeeCode",
      "designation", "contactNumber", "reportingPerson",
      "dateOfJoining", "dateOfBirth", "location",
      "permanentAddress", "presentAddress", "roleInCompany"
    ];
    
    const newErrors = {};
    requiredFields.forEach(field => {
      if (!form[field]) newErrors[field] = "This field is required";
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const res = await api.post("/users/AddUser", form);
      toast.success("User added");
      setForm(initialUser);
      setErrors({});
    } catch (error) {
      const msg = error.response?.data?.message || 'Something went wrong';
      toast.error(msg);
    }finally{
      setAdding(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-h-screen">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Add New User</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        {[{ label: "Username", name: "username" },
          { label: "Email", name: "email" },
          { label: "Employee Code", name: "employeeCode" },
          { label: "Contact Number", name: "contactNumber" },
          { label: "Reporting Person", name: "reportingPerson" },
          { label: "Date of Joining", name: "dateOfJoining", type: "date" },
          { label: "Date of Birth", name: "dateOfBirth", type: "date" },
          { label: "Location", name: "location" },
          { label: "Permanent Address", name: "permanentAddress" },
          { label: "Present Address", name: "presentAddress" },
          { label: "Company Role", name: "companyRole" }
        ].map(({ label, name, type }) => (
          <div key={name} className="flex flex-col">
            <label className="mb-1 font-medium">{label}</label>
            <input
              type={type || "text"}
              name={name}
              value={form[name]}
              onChange={handleChange}
              className={`border p-2 rounded ${errors[name] ? "border-red-500" : "border-gray-300"}`}
            />
            {errors[name] && <span className="text-red-500 text-xs mt-1">{errors[name]}</span>}
          </div>
        ))}

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Department</label>
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            className={`border p-2 rounded ${errors.department ? "border-red-500" : "border-gray-300"}`}
          >
            <option value="">Select Department</option>
            {departments.map(dep => (
              <option key={dep} value={dep}>{dep}</option>
            ))}
          </select>
          {errors.department && <span className="text-red-500 text-xs mt-1">{errors.department}</span>}
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Designation</label>
          <select
            name="designation"
            value={form.designation}
            onChange={handleChange}
            className={`border p-2 rounded ${errors.designation ? "border-red-500" : "border-gray-300"}`}
          >
            <option value="">Select Designation</option>
            {designations.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          {errors.designation && <span className="text-red-500 text-xs mt-1">{errors.designation}</span>}
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
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
          >
            {Adding ? "Adding User..." : "Add User"}
          </button>
        </div>
      </form>
    </div>
  );
};

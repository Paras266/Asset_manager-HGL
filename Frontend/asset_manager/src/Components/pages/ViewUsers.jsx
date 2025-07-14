/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { FaEdit, FaSave } from "react-icons/fa";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";
import api from "../../services/api";

export const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [editableRow, setEditableRow] = useState(null);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users/getAllUsers");
      console.log("Fetched users:", res.data.users);
      setUsers(res.data.users);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to fetch users";
      toast.error(message);
    }
  };

  const handleEdit = (id) => {
    setEditableRow(id);
    const selectedUser = users.find((u) => u._id === id);
    setEditedData(selectedUser);
  };

  const handleInputChange = (e, key) => {
    setEditedData((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const handleSave = async (id) => {
    try {
      const {
        username,
        email,
        employeeCode,
        department,
        designation,
        companyRole,
        dateOfJoining,
        dateOfBirth,
        location,
        permanentAddress,
        presentAddress,
        contactNumber,
        reportingPerson,
      } = editedData;

      const updatedUser = {
        username,
        email,
        employeeCode,
        department,
        designation,
        companyRole,
        dateOfJoining,
        dateOfBirth,
        location,
        permanentAddress,
        presentAddress,
        contactNumber,
        reportingPerson,
      };

      await api.put(`/users/updateUser/${id}`, updatedUser);
      toast.success("User updated successfully");
      setEditableRow(null);
      fetchUsers();
    } catch (err) {
      const message = err.response?.data?.message || "Update failed";
      toast.error(message);
    }
  };

  // ✅ Helper to format date to dd-mm-yyyy
const formatDateToDDMMYYYY = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[d.getMonth()];
  const year = String(d.getFullYear()).slice(-2); // Last 2 digits
  return `${day}-${month}-${year}`;
};



 const exportToExcel = () => {
  const exportData = users.map((user, index) => ({
    "Sr. No.": index + 1,
    "Username": user.username || "",
    "Email": user.email || "",
    "Employee Code": user.employeeCode || "",
    "Department": user.department || "",
    "Location": user.location || "",
    "Designation": user.designation || "",
    "Company Role": user.roleInCompany || "",
    "Date of Joining": user.dateOfJoining ? formatDateToDDMMYYYY(user.dateOfJoining) : "",
    "Date of Birth": user.dateOfBirth ? formatDateToDDMMYYYY(user.dateOfBirth) : "",
    "Permanent Address": user.permanentAddress || "",
    "Present Address": user.presentAddress || "",
    "Contact Number": user.contactNumber || "",
    "Reporting Person": user.reportingPerson || ""
  }));

  // Ensure there's at least the header row
  const dataToExport = exportData.length > 0 ? exportData : [{
    "Sr. No.": "",
    "Username": "",
    "Email": "",
    "Employee Code": "",
    "Department": "",
    "Location": "",
    "Designation": "",
    "Company Role": "",
    "Date of Joining": "",
    "Date of Birth": "",
    "Permanent Address": "",
    "Present Address": "",
    "Contact Number": "",
    "Reporting Person": ""
  }];

  const ws = XLSX.utils.json_to_sheet(dataToExport, { skipHeader: false });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Users");
  XLSX.writeFile(wb, "AllUsers.xlsx");
  toast.success("Exported to Excel");
};


  const departmentOptions = [
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
    "Safety",
  ];

  const designationOptions = [
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
    "Technician",
  ];

  return (
    <div className="p-4 w-full h-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-blue-700">All Users</h1>
        <button
          onClick={exportToExcel}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Export to Excel
        </button>
      </div>

      <div className="overflow-auto max-h-[72vh] border border-gray-300 rounded">
        <table className="min-w-[1600px] w-full text-sm text-left">
          <thead className="bg-blue-600 text-white sticky top-0 z-10">
            <tr>
              {[
                "Username",
                "Email",
                "Emp Code",
                "Department",
                "Designation",
                "Company Role",
                "DOJ",
                "DOB",
                "Location",
                "Permanent Address",
                "Present Address",
                "Contact",
                "Reporting Person",
                "Actions",
              ].map((title) => (
                <th key={title} className="px-3 py-2 whitespace-nowrap">{title}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {users.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-100 even:bg-gray-50">
                {[
                  "username",
                  "email",
                  "employeeCode",
                  "department",
                  "designation",
                  "companyRole",
                  "dateOfJoining",
                  "dateOfBirth",
                  "location",
                  "permanentAddress",
                  "presentAddress",
                  "contactNumber",
                  "reportingPerson",
                ].map((key) => (
                  <td key={key} className="px-4 py-2 ">
                    {editableRow === user._id ? (
                      key === "department" ? (
                        <select
                          value={editedData[key]}
                          onChange={(e) => handleInputChange(e, key)}
                          className="border p-1 w-full"
                        >
                          <option value="">Select Department</option>
                          {departmentOptions.map((dept) => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                      ) : key === "designation" ? (
                        <select
                          value={editedData[key]}
                          onChange={(e) => handleInputChange(e, key)}
                          className="border p-1 w-full"
                        >
                          <option value="">Select Designation</option>
                          {designationOptions.map((role) => (
                            <option key={role} value={role}>{role}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          value={editedData[key] || ""}
                          onChange={(e) => handleInputChange(e, key)}
                          type={["dateOfJoining", "dateOfBirth"].includes(key) ? "date" : "text"}
                          className="border p-1 w-full"
                        />
                      )
                    ) : key === "dateOfJoining" || key === "dateOfBirth" ? (
                      formatDateToDDMMYYYY(user[key])
                    ) : (
                      user[key]
                    )}
                  </td>
                ))}
                <td className="px-3 py-2">
                  {editableRow === user._id ? (
                    <button
                      onClick={() => handleSave(user._id)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <FaSave />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(user._id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

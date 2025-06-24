/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { FaEdit, FaSave } from "react-icons/fa";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";
import api from "../../services/api";
// Ensure consistent import casing
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
      toast.error("Failed to fetch users");
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
      // Only pick allowed editable fields
      const {
        username,
        email,
        employeeCode,
        department,
        designation,
        roleInCompany,
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
        roleInCompany,
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
      console.error(err.response?.data || err.message);
      toast.error("Update failed");
    }
  };
  

  

  const exportToExcel = () => {
    const exportData = users.map((user) => ({
      Username: user.username,
      Email: user.email,
      EmployeeCode: user.employeeCode,
      Department: user.department,
      Designation: user.designation,
      RoleInCompany: user.roleInCompany,
      DateOfJoining: user.dateOfJoining?.split("T")[0],
      DateOfBirth: user.dateOfBirth?.split("T")[0],
      Location: user.location,
      PermanentAddress: user.permanentAddress,
      PresentAddress: user.presentAddress,
      ContactNumber: user.contactNumber,
      ReportingPerson: user.reportingPerson,
      assignedAssets: user.assignedAssets?.length > 0 ? user.assignedAssets.map((a) => `${a.deviceType} - ${a.deviceName}`).join(", ") : "None",
      CurrentAssets: user.currentItem?.length > 0
        ? user.currentItem.map((a) => `${a.deviceType} - ${a.deviceName}`).join(", ")
        : "None",
      Actions: "", // Placeholder for actions, not exported
      _id: user._id, // Include ID for reference

    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    XLSX.writeFile(wb, "AllUsers.xlsx");
    toast.success("Exported to Excel");
  };

  const departmentOptions = [
    "IT", "HR", "Finance", "Production", "Planing", "Manufacture", "Design", "Quality"
  ];
  
  const designationOptions = [
    "Manager", "Engineer", "Technician", "Intern", "Executive", "GET"
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
                "Role In Company",
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
                {/* Editable fields */}
                {[
                  "username",
                  "email",
                  "employeeCode",
                  "department",
                  "designation",
                  "roleInCompany",
                  "dateOfJoining",
                  "dateOfBirth",
                  "location",
                  "permanentAddress",
                  "presentAddress",
                  "contactNumber",
                  "reportingPerson",
                ].map((key) => (
                  <td key={key} className="px-3 py-2">
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
    user[key]?.split("T")[0]
  ) : (
    user[key]
  )}
</td>

                ))}

                {/* Current Assets Display */}
                

                {/* Edit / Save Action */}
                <td className="px-3 py-2">
                  {editableRow === user._id ? (
                  <button
                  onClick={() => {
                    console.log("Save clicked for:", user._id);
                    handleSave(user._id);
                  }}
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

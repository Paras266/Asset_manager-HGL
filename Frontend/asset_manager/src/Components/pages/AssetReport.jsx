import React, { useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

export const AssetReport = () => {
  const [serialNumber, setSerialNumber] = useState("");
  const [allocationPreview, setAllocationPreview] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setError("");
    setAllocationPreview(null);
    try {
      const res = await api.post(
        `/assets/getallocationhistory/${serialNumber}`
      );
      setAllocationPreview(res.data);
      toast.success("Allocation info fetched successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Asset not found");
      toast.error(
        err.response?.data?.message || "Failed to fetch allocation info"
      );
    }
  };

 const handleDownloadPDF = async () => {
  try {
    const response = await api.get(
      `/assets/getallocationpdf/${serialNumber}`,
      {
        responseType: 'blob',
      }
    );

    console.log("PDF response:", response.data);

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${serialNumber}_Asset_Report.pdf`);
    document.body.appendChild(link);
    link.click();
    const pdfWindow = window.open();
    pdfWindow.location.href = url;
    // Clean up
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast.success("PDF downloaded successfully");
  } catch (error) {
    toast.error("Failed to download PDF");
    console.error("Failed to download PDF:", error);
  }
};


  return (
    <div
      style={{ background: "#f0faff", padding: "2rem", borderRadius: "10px" }}
    >
      <h2 style={{ color: "#0077b6", marginBottom: "1rem" }}>
        Asset Allocation Report
      </h2>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Enter Serial Number"
          value={serialNumber}
          onChange={(e) => setSerialNumber(e.target.value)}
          style={{
            padding: "0.5rem",
            border: "1px solid #0077b6",
            borderRadius: "5px",
            flex: 1,
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            backgroundColor: "#00b38f",
            color: "white",
            padding: "0.6rem 1rem",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Search
        </button>
      </div>

      {error && <div style={{ color: "red" }}>{error}</div>}

      {allocationPreview && (
        <div
          style={{
            background: "#fff",
            padding: "1rem",
            borderRadius: "10px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ color: "#0077b6" }}>Short Info:</h3>
          <p>
            <strong>Device:</strong> {allocationPreview.deviceName}
          </p>
          <p>
            <strong>Model No.:</strong> {allocationPreview.modelNumber}
          </p>
          <p>
            <strong>Serial No.:</strong> {allocationPreview.serialNumber}
          </p>
          <p>
            <strong>Status:</strong> {allocationPreview.status}
          </p>

          {allocationPreview.userhistory &&
          allocationPreview.userhistory.length > 0 ? (
            <div>
              <h4 style={{ color: "#0077b6" }}>Allocation History:</h4>
              {allocationPreview.userhistory.map((entry, index) => (
                <div
                  key={index}
                  style={{
                    borderLeft: "3px solid #00b38f",
                    paddingLeft: "1rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <p>
                    <strong>Issued To:</strong> {entry.user?.username},{" "}
                    {entry.user?.employeeCode}
                  </p>
                  <p>
                    <strong>Designation:</strong> {entry.user?.designation}
                  </p>
                  <p>
                    <strong>Department:</strong> {entry.user?.department}
                  </p>
                  <p>
                    <strong>Issued Date:</strong>{" "}
                    {new Date(entry.allocatedDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Returned Date:</strong>{" "}
                    {entry.deallocatedDate
                      ? new Date(entry.deallocatedDate).toLocaleDateString()
                      : "Not Returned"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>No allocation history found.</p>
          )}

          <button
            onClick={handleDownloadPDF}
            style={{
              marginTop: "1rem",
              backgroundColor: "#0077b6",
              color: "white",
              padding: "0.6rem 1rem",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Download Full Report (PDF)
          </button>
        </div>
      )}
    </div>
  );
};

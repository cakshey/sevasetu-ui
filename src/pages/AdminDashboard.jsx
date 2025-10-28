import React, { useState } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";
import "../App.css"; // optional styling

function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  const functions = getFunctions();
  const auth = getAuth();

  const handleExportProviders = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("Please log in first!");
        return;
      }

      const exportFunc = httpsCallable(functions, "exportServiceProviders");
      const result = await exportFunc();
      const { fileBase64 } = result.data;

      // Download Excel file locally
      const link = document.createElement("a");
      link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${fileBase64}`;
      link.download = `service_providers_${Date.now()}.xlsx`;
      link.click();

      toast.success("✅ Export successful!");
    } catch (error) {
      console.error(error);
      toast.error("❌ Export failed");
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="admin-dashboard container text-center py-5" style={{ marginTop: "90px" }}>
  <div className="p-5 bg-light rounded shadow-sm">
    <h2 className="fw-bold mb-3 text-primary">⚙️ SevaSetu Admin Dashboard</h2>
    <p className="text-muted mb-4">
      Manage and export service provider data securely.
    </p>
    <button className="btn btn-primary px-4 py-2 fw-semibold">
      📘 Export Providers to Excel
    </button>
  </div>
</div>
  );
}

export default AdminDashboard;

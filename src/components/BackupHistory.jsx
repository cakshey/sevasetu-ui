// src/components/BackupHistory.jsx
import React, { useEffect, useState } from "react";
import "./AdminFeedback.css"; // reuse existing styling

function BackupHistory() {
  const [backups, setBackups] = useState([]);

  useEffect(() => {
    // ✅ Simulate reading backup files from local /utils/backups/services/
    // In a real app, this could be fetched from a server or Firestore
    const simulatedBackups = [
      {
        name: "services-backup-2025-11-03T01-41-32-123Z.json",
        size: "24 KB",
        date: "Nov 03, 2025 - 07:11 AM",
      },
      {
        name: "normalized-backup-2025-11-05T07-18-10-762Z.json",
        size: "31 KB",
        date: "Nov 05, 2025 - 12:48 PM",
      },
      {
        name: "cleanup-backup-2025-11-02T05-35-26-810Z.zip",
        size: "62 KB",
        date: "Nov 02, 2025 - 05:35 AM",
      },
    ];
    setBackups(simulatedBackups);
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-primary mb-4">📦 Backup History</h2>
      <p className="text-muted">
        View the list of system backup files created during service cleanup and import operations.
      </p>

      <div className="table-responsive mt-4">
        <table className="table table-bordered table-hover">
          <thead className="table-primary">
            <tr>
              <th>File Name</th>
              <th>Size</th>
              <th>Created On</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {backups.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">
                  No backup records found.
                </td>
              </tr>
            ) : (
              backups.map((backup, index) => (
                <tr key={index}>
                  <td>{backup.name}</td>
                  <td>{backup.size}</td>
                  <td>{backup.date}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() =>
                        alert(`Download started: ${backup.name}`)
                      }
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BackupHistory;

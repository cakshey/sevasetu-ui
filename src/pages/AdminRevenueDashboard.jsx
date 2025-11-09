// ✅ src/pages/AdminRevenueDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { Bar, Pie } from "react-chartjs-2";
import * as XLSX from "xlsx";
import "./AdminRevenueDashboard.css";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  Title,
} from "chart.js";
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  Title
);

export default function AdminRevenueDashboard() {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [localEdits, setLocalEdits] = useState({});

  // 🧭 Fetch all services in real-time
  useEffect(() => {
    const q = query(collection(db, "services"), orderBy("name"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setServices(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // 📊 Aggregates (revenue, cost, commission, margin)
  const aggregates = useMemo(() => {
    const byCategory = {};
    const byArea = {};
    let totalRevenue = 0;
    let totalCost = 0;
    let totalCommission = 0;

    services.forEach((s) => {
      const price = Number(s.sellPrice || 0);
      const cost = Number(s.providerCost || 0);
      const commPct = Number(s.commissionPercent || 0);
      const bookings = Number(s.bookingsCount || 0);

      const commissionAmt = price * (commPct / 100);
      const netRevenue = bookings * (price - cost - commissionAmt);

      totalRevenue += price * bookings;
      totalCost += cost * bookings;
      totalCommission += commissionAmt * bookings;

      const cat = s.category || "Other";
      const area = s.area || "All";

      if (!byCategory[cat])
        byCategory[cat] = { revenue: 0, cost: 0, commission: 0, bookings: 0 };
      byCategory[cat].revenue += netRevenue;
      byCategory[cat].cost += cost * bookings;
      byCategory[cat].commission += commissionAmt * bookings;
      byCategory[cat].bookings += bookings;

      if (!byArea[area])
        byArea[area] = { revenue: 0, cost: 0, commission: 0, bookings: 0 };
      byArea[area].revenue += netRevenue;
      byArea[area].cost += cost * bookings;
      byArea[area].commission += commissionAmt * bookings;
      byArea[area].bookings += bookings;
    });

    const profit = totalRevenue - totalCost - totalCommission;
    const avgMarginPct = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

    return {
      byCategory,
      byArea,
      totalRevenue,
      totalCost,
      totalCommission,
      profit,
      avgMarginPct,
    };
  }, [services]);

  // 🧾 Table data
  const tableRows = useMemo(() => {
    return services.map((s) => {
      const price = Number(s.sellPrice || 0);
      const cost = Number(s.providerCost || 0);
      const commPct = Number(s.commissionPercent || 0);
      const bookings = Number(s.bookingsCount || 0);
      const commissionAmt = price * (commPct / 100);
      const netRevenue = bookings * (price - cost - commissionAmt);
      return {
        id: s.id,
        name: s.name || "Unnamed",
        category: s.category || "Other",
        area: s.area || "All",
        servicePrice: price,
        providerCost: cost,
        commissionPercent: commPct,
        bookingsCount: bookings,
        commissionAmount: commissionAmt,
        revenueFromService: netRevenue,
      };
    });
  }, [services]);

  // 💾 Save edits
  const saveEdits = async (rowId) => {
    try {
      const edits = localEdits[rowId];
      if (!edits) return;
      const ref = doc(db, "services", rowId);
      const payload = {};
      if (edits.providerCost !== undefined)
        payload.providerCost = Number(edits.providerCost);
      if (edits.commissionPercent !== undefined)
        payload.commissionPercent = Number(edits.commissionPercent);
      if (edits.servicePrice !== undefined)
        payload.sellPrice = Number(edits.servicePrice);
      await updateDoc(ref, payload);
      setEditingRow(null);
      setLocalEdits((p) => {
        const c = { ...p };
        delete c[rowId];
        return c;
      });
      alert("✅ Saved changes for service.");
    } catch (err) {
      console.error("Save failed:", err);
      alert("❌ Failed to save changes.");
    }
  };

  // 📤 Export Excel
  const exportToExcel = () => {
    const data = tableRows.map((r) => ({
      serviceId: r.id,
      name: r.name,
      category: r.category,
      area: r.area,
      sellPrice: r.servicePrice,
      providerCost: r.providerCost,
      commissionPercent: r.commissionPercent,
      bookingsCount: r.bookingsCount,
      revenueFromService: r.revenueFromService,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ServicesFinancials");
    XLSX.writeFile(
      wb,
      `services-financials-${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  // 📥 Import Excel with backup + skip log
  const handleExcelImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const confirmBackup = window.confirm(
      "⚠️ Before importing, would you like to create a backup of your current data?"
    );

    if (confirmBackup) {
      try {
        const snap = await getDocs(collection(db, "services"));
        const data = snap.docs.map((d) => d.data());
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "ServicesBackup");
        const fileName = `SevaSetu_ServicesBackup_${new Date()
          .toISOString()
          .replace(/[:.]/g, "-")}.xlsx`;
        XLSX.writeFile(wb, fileName);
        alert("✅ Backup created successfully!");
      } catch (err) {
        console.error("Backup failed:", err);
        alert("⚠️ Backup failed, check console.");
      }
    }

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        let imported = 0;
        let skipped = 0;

        for (const row of json) {
          const serviceId = row.serviceId || row.id;
          const found = services.find(
            (s) =>
              (serviceId && s.id === serviceId) ||
              (row.name && s.name === row.name)
          );

          if (!found) {
            skipped++;
            continue;
          }

          const payload = {};
          if (row.providerCost !== undefined && row.providerCost !== "")
            payload.providerCost = Number(row.providerCost);
          if (
            row.commissionPercent !== undefined &&
            row.commissionPercent !== ""
          )
            payload.commissionPercent = Number(row.commissionPercent);
          if (row.sellPrice !== undefined && row.sellPrice !== "")
            payload.sellPrice = Number(row.sellPrice);

          if (Object.keys(payload).length > 0) {
            await updateDoc(doc(db, "services", found.id), payload);
            imported++;
          }
        }

        alert(`✅ Imported: ${imported}\n⚠️ Skipped: ${skipped} (no match found)`);
      } catch (err) {
        console.error("Import failed:", err);
        alert("❌ Import failed, check console.");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // 📊 Chart data
  const catLabels = Object.keys(aggregates.byCategory);
  const catRevenue = catLabels.map((k) => aggregates.byCategory[k].revenue || 0);
  const catCost = catLabels.map((k) => aggregates.byCategory[k].cost || 0);
  const barData = {
    labels: catLabels,
    datasets: [
      { label: "Revenue", data: catRevenue, backgroundColor: "rgba(54,162,235,0.6)" },
      { label: "Cost", data: catCost, backgroundColor: "rgba(255,99,132,0.6)" },
    ],
  };

  const pieData = {
    labels: Object.keys(aggregates.byArea),
    datasets: [
      {
        label: "Revenue by Area",
        data: Object.keys(aggregates.byArea).map(
          (k) => aggregates.byArea[k].revenue || 0
        ),
        backgroundColor: [
          "#4dc9f6",
          "#f67019",
          "#f53794",
          "#537bc4",
          "#acc236",
          "#166a8f",
          "#00a950",
        ],
      },
    ],
  };

  if (loading) return <div className="p-4">Loading financial dashboard...</div>;

  return (
    <div className="container admin-financial mt-4">
      <h2>📈 Financials — Revenue, Cost & Margin</h2>

      {/* SUMMARY */}
      <div className="summary-cards row mt-3">
        <div className="col-md-3">
          <div className="card p-3">
            <div className="card-title">Total Revenue</div>
            <div className="card-value">
              ₹ {aggregates.totalRevenue.toLocaleString()}
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3">
            <div className="card-title">Total Cost</div>
            <div className="card-value">
              ₹ {aggregates.totalCost.toLocaleString()}
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3">
            <div className="card-title">Total Commission</div>
            <div className="card-value">
              ₹ {aggregates.totalCommission.toLocaleString()}
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3">
            <div className="card-title">Net Profit</div>
            <div className="card-value">
              ₹ {aggregates.profit.toLocaleString()}
            </div>
            <small className="text-muted">
              Margin: {aggregates.avgMarginPct.toFixed(1)}%
            </small>
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="row mt-4">
        <div className="col-md-8">
          <div className="chart-card p-3">
            <h5>Revenue vs Cost by Category</h5>
            <Bar data={barData} />
          </div>
        </div>
        <div className="col-md-4">
          <div className="chart-card p-3">
            <h5>Revenue share by Area</h5>
            <Pie data={pieData} />
          </div>
        </div>
      </div>

      {/* IMPORT / EXPORT */}
      <div className="d-flex justify-content-between align-items-center mt-4">
        <div>
          <button className="btn btn-primary me-2" onClick={exportToExcel}>
            📤 Export Table to Excel
          </button>
          <label className="btn btn-outline-secondary mb-0">
            📥 Import Excel
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleExcelImport}
              style={{ display: "none" }}
            />
          </label>
        </div>
        <div>
          <small className="text-muted">
            Tip: update providerCost / commissionPercent directly and click Save
          </small>
        </div>
      </div>

      {/* TABLE */}
      <div className="table-responsive mt-3">
        <table className="table table-striped table-bordered">
          <thead className="table-light">
            <tr>
              <th>Service</th>
              <th>Category</th>
              <th>Area</th>
              <th>Sell Price (₹)</th>
              <th>Provider Cost (₹)</th>
              <th>Commission (%)</th>
              <th>Commission (₹)</th>
              <th>Bookings</th>
              <th>Revenue (₹)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map((r) => {
              const editing = editingRow === r.id;
              const edited = localEdits[r.id] || {};
              return (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td>{r.category}</td>
                  <td>{r.area}</td>
                  <td>
                    {editing ? (
                      <input
                        type="number"
                        className="form-control"
                        value={
                          edited.servicePrice !== undefined
                            ? edited.servicePrice
                            : r.servicePrice
                        }
                        onChange={(e) =>
                          setLocalEdits((p) => ({
                            ...p,
                            [r.id]: {
                              ...(p[r.id] || {}),
                              servicePrice: e.target.value,
                            },
                          }))
                        }
                      />
                    ) : (
                      r.servicePrice
                    )}
                  </td>
                  <td>
                    {editing ? (
                      <input
                        type="number"
                        className="form-control"
                        value={
                          edited.providerCost !== undefined
                            ? edited.providerCost
                            : r.providerCost
                        }
                        onChange={(e) =>
                          setLocalEdits((p) => ({
                            ...p,
                            [r.id]: {
                              ...(p[r.id] || {}),
                              providerCost: e.target.value,
                            },
                          }))
                        }
                      />
                    ) : (
                      r.providerCost
                    )}
                  </td>
                  <td>
                    {editing ? (
                      <input
                        type="number"
                        className="form-control"
                        value={
                          edited.commissionPercent !== undefined
                            ? edited.commissionPercent
                            : r.commissionPercent
                        }
                        onChange={(e) =>
                          setLocalEdits((p) => ({
                            ...p,
                            [r.id]: {
                              ...(p[r.id] || {}),
                              commissionPercent: e.target.value,
                            },
                          }))
                        }
                      />
                    ) : (
                      r.commissionPercent
                    )}
                  </td>
                  <td>₹ {r.commissionAmount.toLocaleString()}</td>
                  <td>{r.bookingsCount}</td>
                  <td>₹ {Math.round(r.revenueFromService).toLocaleString()}</td>
                  <td>
                    {editing ? (
                      <>
                        <button
                          className="btn btn-sm btn-success me-2"
                          onClick={() => saveEdits(r.id)}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => {
                            setEditingRow(null);
                            setLocalEdits((p) => {
                              const c = { ...p };
                              delete c[r.id];
                              return c;
                            });
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => setEditingRow(r.id)}
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

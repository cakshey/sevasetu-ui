// ✅ exportServiceProvidersToExcel.js
import admin from "firebase-admin";
import xlsx from "xlsx";
import fs from "fs";
import path from "path";
import { appendExportLog } from "./appendLog.js";
import { exec } from "child_process";

// 🟦 Load Firebase Admin SDK
const serviceAccount = JSON.parse(fs.readFileSync("./serviceAccountKey.json", "utf8"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// 🧩 Parse CLI args
const args = process.argv.slice(2);
let state = null,
  category = null,
  dateFilter = null;

args.forEach((arg) => {
  if (arg.startsWith("--state=")) state = arg.split("=")[1].replace(/['"]/g, "");
  if (arg.startsWith("--category=")) category = arg.split("=")[1].replace(/['"]/g, "");
  if (arg.startsWith("--date=")) dateFilter = arg.split("=")[1].replace(/['"]/g, "");
});

console.log("📦 Starting Firestore → Excel export...");
console.log(
  `📋 Filters applied: State=${state || "All States"}, Category=${category || "All Categories"}${
    dateFilter ? `, Date=${dateFilter}` : ""
  }`
);

try {
  const providersRef = db.collection("service_providers");
  let query = providersRef;

  if (state) query = query.where("state", "==", state);
  if (category) query = query.where("category", "==", category);

  const snapshot = await query.get();
  if (snapshot.empty) {
    console.log("⚠️ No data found with the applied filters.");
    process.exit(0);
  }

  // 🧾 Convert Firestore docs to JSON rows
  const data = snapshot.docs.map((doc) => ({
    ID: doc.id,
    Name: doc.data().name || "",
    Phone: doc.data().phone || "",
    Category: doc.data().category || "",
    SubCategory: doc.data().subCategory || "",
    City: doc.data().city || "",
    District: doc.data().district || "",
    State: doc.data().state || "",
    Pincode: doc.data().pincode || "",
    Availability: doc.data().available ? "Available" : "Unavailable",
    Verified: doc.data().verified ? "Yes" : "No",
    Rating: doc.data().rating || 0,
    JobsCompleted: doc.data().jobsCompleted || 0,
    Tags: (doc.data().tags || []).join(", "),
    CreatedAt: doc.data().createdAt?._seconds
      ? new Date(doc.data().createdAt._seconds * 1000).toLocaleString()
      : "",
  }));

  // 📂 Prepare backup directory
  const folder = new Date().toISOString().slice(0, 7); // e.g. "2025-10"
  const dir = path.join(process.cwd(), "backups", folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  // 🗓️ Construct file name
  const safeState = (state || "AllStates").replace(/\s+/g, "_");
  const safeCategory = (category || "AllCategories").replace(/\s+/g, "_");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const fileName = `Service_Providers_Backup_${safeState}_${safeCategory}_${timestamp}.xlsx`;
  const filePath = path.join(dir, fileName);

  // 📊 Create workbook
  const ws = xlsx.utils.json_to_sheet(data);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, "Providers");
  xlsx.writeFile(wb, filePath);

  // 🪵 Log export info
  appendExportLog({
    file: filePath,
    filters: { state, category, dateFilter },
    count: data.length,
  });

  console.log(`✅ Export complete! File saved to: ${filePath}`);
  console.log(`🧾 Records exported: ${data.length}`);

  // 🧹 Optional: Run cleanup automatically
  const AUTO_CLEANUP = true;
  if (AUTO_CLEANUP) {
    console.log("🧹 Running silent cleanup...");
    exec("npm run cleanup", (err, stdout) => {
      if (err) console.error("⚠️ Cleanup failed:", err.message);
      else console.log("✨ Cleanup complete.");
    });
  }
} catch (error) {
  console.error("❌ Error exporting data:", error);
  process.exit(1);
}

// src/utils/excelToJson.js
/**
 * Run this file with: node src/utils/excelToJson.js
 * It will create src/data/services.json from your Excel file.
 */

const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const excelPath = path.resolve(__dirname, "../data/services.xlsx");
const outputPath = path.resolve(__dirname, "../data/services.json");

if (!fs.existsSync(excelPath)) {
  console.error("❌ Excel file not found. Please add src/data/services.xlsx");
  process.exit(1);
}

const workbook = XLSX.readFile(excelPath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet);

const grouped = rows.reduce((acc, row) => {
  const main = row["Main Service"];
  if (!main) return acc;
  if (!acc[main]) acc[main] = [];
  acc[main].push({
    subService: row["Sub-Service"],
    price: row["Tier-2 City Avg Price (₹)"],
    remarks: row["Remarks"]
  });
  return acc;
}, {});

fs.writeFileSync(outputPath, JSON.stringify(grouped, null, 2));
console.log("✅ Excel converted → services.json created successfully!");

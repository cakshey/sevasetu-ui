import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";

const filePath = path.resolve("./SevaSetu_Master_Project_Tracker_v1.3.xlsx");

async function updateTracker() {
  if (!fs.existsSync(filePath)) {
    console.error("❌ File not found:", filePath);
    return;
  }

  console.log("📘 Loading workbook...");
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  // Auto-update all sheets except Bug tracker
  workbook.eachSheet((sheet) => {
    if (sheet.name.includes("Bug")) return;

    const headerRow = sheet.getRow(1);
    if (!headerRow.values.includes("% Complete")) return;

    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      const total = row.getCell(2).value;
      const completed = row.getCell(3).value;

      if (typeof total === "number" && total > 0 && typeof completed === "number") {
        const percent = Math.round((completed / total) * 100);
        row.getCell(5).value = percent;

        // Conditional formatting style
        if (percent >= 80) row.getCell(5).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "C6EFCE" } };
        else if (percent >= 50) row.getCell(5).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFEB9C" } };
        else row.getCell(5).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFC7CE" } };
      }
    });
  });

  // Handle Bug Tracker auto ID and color coding
  const bugSheet = workbook.getWorksheet("Bug_Issue_Tracker");
  if (bugSheet) {
    let counter = 1;
    bugSheet.eachRow((row, i) => {
      if (i === 1) return;
      row.getCell(1).value = `B${String(counter++).padStart(3, "0")}`;

      const severity = (row.getCell(4).value || "").toString().toLowerCase();
      if (severity.includes("critical"))
        row.getCell(4).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0000" } };
      else if (severity.includes("medium"))
        row.getCell(4).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD700" } };
      else if (severity.includes("low"))
        row.getCell(4).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "90EE90" } };
    });
  }

  // Timestamp update on Dashboard sheet
  const dash = workbook.getWorksheet("Dashboard");
  if (dash) {
    dash.getCell("J2").value = `Last Updated: ${new Date().toLocaleString()}`;
  }

  await workbook.xlsx.writeFile(filePath);
  console.log("✅ Tracker auto-updated successfully!");
}

updateTracker();

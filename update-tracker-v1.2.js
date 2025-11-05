/**
 * 🚀 SevaSetu Master Project Tracker Auto Upgrade Script (v1.2)
 * Adds "Bug_Issue_Tracker" sheet with:
 * ✅ Color formatting
 * ✅ Formulas
 * ✅ Dashboard updates
 * ✅ Auto-ID generator (B001, B002…)
 */

const ExcelJS = require("exceljs");
const fs = require("fs");

const INPUT_FILE = "SevaSetu_Master_Project_Tracker_v1.0.xlsx";
const OUTPUT_FILE = "SevaSetu_Master_Project_Tracker_v1.2.xlsx";

async function upgradeTracker() {
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`❌ File not found: ${INPUT_FILE}`);
    return;
  }

  console.log(`📘 Loading ${INPUT_FILE} ...`);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(INPUT_FILE);

  // ✅ Add new sheet (safe name)
  console.log("➕ Adding 'Bug_Issue_Tracker' sheet...");
  const bugSheet = workbook.addWorksheet("Bug_Issue_Tracker");

  // Headers
  const headers = [
    "ID",
    "Module",
    "Reported By",
    "Date Reported",
    "Severity",
    "Issue Title",
    "Description",
    "Status",
    "Owner",
    "Target Fix Date",
    "Date Resolved",
    "Resolution Notes",
    "Days Open",
    "Overdue",
  ];
  bugSheet.addRow(headers);

  // Sample data
  const sampleRows = [
    [
      "B001",
      "Customer",
      "Akhsey",
      "2025-10-31",
      "High",
      "OTP Verification Loop",
      "OTP not verifying properly in dev environment",
      "Resolved",
      "Dev Team",
      "2025-10-31",
      "2025-10-31",
      "ReCaptcha reinit fixed",
    ],
    [
      "B002",
      "Feedback",
      "Akhsey",
      "2025-10-31",
      "Medium",
      "Feedback Form Alignment",
      "Fields misaligned after animation update",
      "Resolved",
      "UI Team",
      "2025-10-31",
      "2025-10-31",
      "CSS grid adjusted",
    ],
    [
      "B003",
      "Admin",
      "Akhsey",
      "2025-11-01",
      "Low",
      "Report Table Pagination",
      "Admin table shows only 10 rows",
      "Open",
      "Dev Team",
      "2025-11-02",
      "",
      "Pending pagination logic",
    ],
  ];

  bugSheet.addRows(sampleRows);

  // ✅ Add formula for Days Open & Overdue
  for (let i = 2; i <= 50; i++) {
    bugSheet.getCell(`M${i}`).value = {
      formula: `IF(K${i}="",TODAY()-D${i},K${i}-D${i})`,
    };
    bugSheet.getCell(`N${i}`).value = {
      formula: `IF(AND(K${i}="",J${i}<TODAY()),"⚠️ Yes","No")`,
    };
  }

  // ✅ Auto-ID Formula (B001 → B002 → …)
  // Excel formula pattern: =IF(B2<>"", "B" & TEXT(ROW(A2)-1, "000"), "")
  for (let i = 2; i <= 200; i++) {
    bugSheet.getCell(`A${i}`).value = {
      formula: `IF(B${i}<>"","B"&TEXT(ROW(A${i})-1,"000"),"")`,
    };
  }

  // Header styling
  bugSheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  bugSheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF004080" },
  };
  bugSheet.columns.forEach((col) => {
    col.width = 20;
  });

  // 🎨 Apply color formatting
  bugSheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const severity = row.getCell(5).value;
    const status = row.getCell(8).value;
    const overdue = row.getCell(14).value;

    // Severity coloring
    if (severity === "High") {
      row.getCell(5).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFF9999" }, // Red
      };
    } else if (severity === "Medium") {
      row.getCell(5).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFF99" }, // Yellow
      };
    } else if (severity === "Low") {
      row.getCell(5).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFCCFFCC" }, // Green
      };
    }

    // Status coloring
    if (status === "Resolved") {
      row.getCell(8).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFB6D7A8" },
      };
    } else if (status === "Open") {
      row.getCell(8).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFC7CE" },
      };
    } else if (status === "In Progress") {
      row.getCell(8).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFF99" },
      };
    }

    // Overdue text highlight
    if (overdue === "⚠️ Yes") {
      row.getCell(14).font = { color: { argb: "FFFF0000" }, bold: true };
    }
  });

  // ✅ Update Dashboard Summary
  const dashboard = workbook.getWorksheet("Dashboard Summary");
  if (dashboard) {
    console.log("🔁 Updating Dashboard Summary with Bug Tracker row...");
    const nextRow = dashboard.lastRow.number + 1;
    dashboard.addRow([
      "Bug_Issue_Tracker",
      { formula: `COUNTA(Bug_Issue_Tracker!A2:A100)` },
      { formula: `COUNTIF(Bug_Issue_Tracker!H2:H100,"Resolved")` },
      { formula: `COUNTIF(Bug_Issue_Tracker!H2:H100,"Open")` },
      { formula: `IF(B${nextRow}=0,0,ROUND(C${nextRow}/B${nextRow}*100,0))` },
      "Monitoring",
      "Daily Review",
    ]);
  }

  // ✅ Update Auto Summary
  const autoSummary = workbook.getWorksheet("Auto Summary");
  if (autoSummary) {
    console.log("📈 Adding Bug metrics to Auto Summary...");
    autoSummary.addRows([
      ["Total Bugs", { formula: `COUNTA(Bug_Issue_Tracker!A2:A100)` }],
      ["Open Bugs", { formula: `COUNTIF(Bug_Issue_Tracker!H2:H100,"Open")` }],
      ["Resolved Bugs", { formula: `COUNTIF(Bug_Issue_Tracker!H2:H100,"Resolved")` }],
      ["Overdue Bugs", { formula: `COUNTIF(Bug_Issue_Tracker!N2:N100,"⚠️ Yes")` }],
    ]);
  }

  // ✅ Save
  console.log(`💾 Saving ${OUTPUT_FILE} ...`);
  await workbook.xlsx.writeFile(OUTPUT_FILE);
  console.log(`✅ Upgrade complete! File saved as ${OUTPUT_FILE}`);
}

upgradeTracker();

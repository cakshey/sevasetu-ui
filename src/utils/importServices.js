// src/utils/importServices.js
import { collection, addDoc } from "firebase/firestore";
import Papa from "papaparse";
import { db } from "../firebase.js"; // ✅ Use your existing firebase config

// ✅ Function to import CSV and push to Firestore (with data cleaning)
async function importCSV(filePath) {
  try {
    const response = await fetch(filePath);
    const csvText = await response.text();

    const parsed = Papa.parse(csvText, { header: true });
    const rows = parsed.data.filter(
      (r) => r["Main Service"] && r["Sub-Service"]
    );

    console.log(`📋 Found ${rows.length} rows to import`);

    for (const row of rows) {
      // 🔍 Clean up category and name text
      const cleanCategory = row["Main Service"]
        .trim()
        .replace(/’/g, "'") // right curly
        .replace(/‘/g, "'") // left curly
        .replace(/\u00A0/g, " "); // non-breaking space

      const cleanSubService = row["Sub-Service"]
        .trim()
        .replace(/’/g, "'")
        .replace(/‘/g, "'")
        .replace(/\u00A0/g, " ");

      const docData = {
        category: cleanCategory,
        name: cleanSubService,
        price: parseInt(row["Tier-2 City Avg Price (₹)"]) || 0,
        description: row["Remarks"]?.trim() || "",
      };

      await addDoc(collection(db, "services"), docData);
      console.log(`✅ Added: ${docData.category} → ${docData.name}`);
    }

    console.log("🎉 Import complete!");
  } catch (error) {
    console.error("❌ Import error:", error);
  }
}

// ✅ Run the import once
importCSV("/data/services.csv");

import admin from "firebase-admin";
import XLSX from "xlsx";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load JSON dynamically — avoids the "assert" error
const serviceAccountPath = path.resolve(__dirname, "../../serviceAccountKey.json");
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function importFromExcel() {
  console.log("🚀 Starting import from Excel (duplicate prevention + description mapping)");

  const filePath = path.resolve(__dirname, "services-clean.xlsx");

  if (!fs.existsSync(filePath)) {
    console.error("❌ Excel file not found at:", filePath);
    process.exit(1);
  }

  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

  let added = 0,
    updated = 0,
    skipped = 0;

  for (const row of data) {
    const category = row["Main Service"]?.trim();
    const name = row["Sub-Service"]?.trim();

    if (!category || !name) {
      console.warn(`⚠️ Skipping row (missing required fields): ${JSON.stringify(row)}`);
      skipped++;
      continue;
    }

    const price = Number(row["Tier-2 City Avg Price (₹)"]) || 0;
    const description =
      row["Remarks"]?.trim() ||
      row["Description"]?.trim() ||
      "No description available";

    const existing = await db
      .collection("services")
      .where("category", "==", category)
      .where("name", "==", name)
      .get();

    const serviceData = {
      category,
      name,
      price,
      description,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (existing.empty) {
      await db.collection("services").add(serviceData);
      added++;
    } else {
      const doc = existing.docs[0];
      const dataInDb = doc.data();

      if (
        dataInDb.price !== price ||
        dataInDb.description !== description ||
        dataInDb.category !== category
      ) {
        await doc.ref.update(serviceData);
        updated++;
      } else {
        skipped++;
      }
    }
  }

  console.log(`✅ Import complete!`);
  console.log(`📊 Added: ${added}, Updated: ${updated}, Skipped: ${skipped}`);
}

importFromExcel().then(() => process.exit());

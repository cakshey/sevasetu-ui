import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Firebase key
const serviceAccountPath = path.resolve(__dirname, "../../serviceAccountKey.json");
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function fillMissingDescriptions() {
  console.log("🚀 Checking Firestore for missing descriptions...");

  const snapshot = await db.collection("services").get();
  let updated = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();

    if (!data.description && data.remarks) {
      await doc.ref.update({ description: data.remarks });
      updated++;
    }
  }

  console.log(`✅ Completed: Updated ${updated} services with missing descriptions.`);
}

fillMissingDescriptions().then(() => process.exit());

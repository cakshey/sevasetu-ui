// 🚀 SevaSetu Firestore Services Cleaner (Backup + Deduplicate All Categories)

import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Setup __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ Import service account safely
import serviceAccountData from "../../serviceAccountKey.json" with { type: "json" };

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountData),
  });
}

const db = admin.firestore();

(async () => {
  console.log("🚀 Starting backup + deep cleanup of Firestore services...");

  // Step 1: Backup current collection
  const snapshot = await db.collection("services").get();
  const allServices = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const backupDir = path.resolve(__dirname, "../../backups/services");
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

  const fileName = `services-backup-${new Date()
    .toISOString()
    .replace(/[:.]/g, "-")}.json`;

  fs.writeFileSync(path.join(backupDir, fileName), JSON.stringify(allServices, null, 2));
  console.log(`📦 Backup created: ${path.join(backupDir, fileName)}\n`);

  // Step 2: Deduplicate by normalized name+category
  const seen = new Map();
  const duplicates = [];

  for (const service of allServices) {
    const name = service.name?.trim().toLowerCase() || "";
    const category = service.category?.trim().toLowerCase() || "";

    const key = `${name}|${category}`;
    if (seen.has(key)) {
      duplicates.push(service.id);
    } else {
      seen.set(key, service.id);
    }
  }

  console.log(`🔍 Found ${duplicates.length} duplicate documents.`);

  if (duplicates.length === 0) {
    console.log("✅ No duplicates found — Firestore data is clean.");
    return;
  }

  // Step 3: Delete duplicates
  console.log("🗑️ Deleting duplicates...");
  let deleted = 0;

  for (const id of duplicates) {
    await db.collection("services").doc(id).delete();
    deleted++;
  }

  console.log(`✅ Deleted ${deleted} duplicate entries successfully.`);
  console.log("🎉 Cleanup complete — Firestore services are now deduplicated!");
})();

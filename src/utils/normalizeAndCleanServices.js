// 🔧 Smart Firestore Normalizer + Deduplicator (Final pass v2)
// Ensures only one unique service per normalized name + category pair

import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ Import credentials safely
import serviceAccountData from "../../serviceAccountKey.json" with { type: "json" };

// ✅ Initialize Firebase
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountData),
  });
}

const db = admin.firestore();

(async () => {
  console.log("🚀 Starting Firestore normalization + final cleanup...");

  // Step 1: Backup existing services
  const snapshot = await db.collection("services").get();
  const allServices = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const backupDir = path.resolve(__dirname, "../../backups/services");
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

  const backupFile = `normalized-backup-${new Date()
    .toISOString()
    .replace(/[:.]/g, "-")}.json`;

  fs.writeFileSync(
    path.join(backupDir, backupFile),
    JSON.stringify(allServices, null, 2)
  );
  console.log(`📦 Backup complete → ${path.join(backupDir, backupFile)}\n`);

  // Step 2: Normalize & collect duplicates
  const groupedByKey = {};

  for (const s of allServices) {
    const name = (s.name || "").trim().replace(/\s+/g, " ");
    const category = (s.category || "").trim().replace(/\s+/g, " ");
    const key = `${name.toLowerCase()}|${category.toLowerCase()}`;

    if (!groupedByKey[key]) groupedByKey[key] = [];
    groupedByKey[key].push({
      ...s,
      name,
      category,
      description: s.description?.trim() || "No description provided",
    });
  }

  let deleteCount = 0;
  let updateCount = 0;

  // Step 3: Deduplicate — keep one per group
  for (const [key, services] of Object.entries(groupedByKey)) {
    if (services.length > 1) {
      console.log(`🧹 Found ${services.length} duplicates for "${key}"`);

      // Keep the first document (latest one if you prefer)
      const [keep, ...remove] = services;

      // Delete extra duplicates
      for (const r of remove) {
        await db.collection("services").doc(r.id).delete();
        deleteCount++;
      }

      // Update kept doc with normalized name/category
      await db.collection("services").doc(keep.id).set(
        {
          ...keep,
          name: keep.name,
          category: keep.category,
          description: keep.description,
        },
        { merge: true }
      );
      updateCount++;
    } else {
      const [only] = services;
      // Normalize single entries too
      await db.collection("services").doc(only.id).set(
        {
          ...only,
          name: only.name,
          category: only.category,
          description: only.description,
        },
        { merge: true }
      );
      updateCount++;
    }
  }

  console.log(
    `\n✅ Firestore normalization + cleanup complete!\n🗑️ Deleted: ${deleteCount} duplicates\n📝 Updated: ${updateCount} documents\n`
  );
})();

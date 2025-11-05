// ✅ UNIVERSAL Firestore Services Backup Script (No ESM assert issues)

import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// 🔧 Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ Load service account JSON the safe way
import serviceAccountData from "../../serviceAccountKey.json" with { type: "json" };

// 🚀 Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountData),
  });
}

const db = admin.firestore();

(async () => {
  console.log("📦 Exporting all services for backup...");
  const snapshot = await db.collection("services").get();

  if (snapshot.empty) {
    console.log("⚠️ No services found in Firestore.");
    process.exit(0);
  }

  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const backupDir = path.resolve(__dirname, "../../backups/services");
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

  const fileName = `services-backup-${new Date()
    .toISOString()
    .replace(/[:.]/g, "-")}.json`;

  fs.writeFileSync(path.join(backupDir, fileName), JSON.stringify(data, null, 2));
  console.log(`✅ Backup saved to: ${path.join(backupDir, fileName)}`);
})();

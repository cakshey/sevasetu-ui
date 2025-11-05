// ✅ Firestore Duplicate Cleanup Script (safe + compatible)

import admin from "firebase-admin";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ Load service account key safely
import serviceAccountData from "../../serviceAccountKey.json" with { type: "json" };

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountData),
  });
}

const db = admin.firestore();

(async () => {
  console.log("🚀 Starting duplicate cleanup in Firestore...");

  const snapshot = await db.collection("services").get();
  console.log(`📊 Fetched ${snapshot.size} total services`);

  const seen = new Map();
  const duplicates = [];

  snapshot.forEach((doc) => {
    const data = doc.data();
    const key = `${data.name?.trim().toLowerCase()}|${data.category?.trim().toLowerCase()}`;
    if (seen.has(key)) {
      duplicates.push(doc.id);
    } else {
      seen.set(key, doc.id);
    }
  });

  console.log(`🧾 Found ${duplicates.length} potential duplicates.`);

  if (duplicates.length === 0) {
    console.log("✅ No duplicates found. Firestore is clean!");
    return;
  }

  // Confirm deletion
  console.log("🗑️ Deleting duplicates...");
  for (const id of duplicates) {
    await db.collection("services").doc(id).delete();
    console.log(`   → Deleted: ${id}`);
  }

  console.log(`✅ Cleanup complete! Removed ${duplicates.length} duplicates.`);
})();

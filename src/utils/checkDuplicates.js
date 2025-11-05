// 🔍 Firestore Duplicate Checker
// Verifies if any duplicate (name + category) services remain

import admin from "firebase-admin";
import serviceAccount from "../../serviceAccountKey.json" with { type: "json" };

// ✅ Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

(async () => {
  console.log("🔍 Checking Firestore for duplicate services...");

  const snap = await db.collection("services").get();
  const map = new Map();

  for (const d of snap.docs) {
    const s = d.data();
    const name = (s.name || "").trim().toLowerCase();
    const category = (s.category || "").trim().toLowerCase();
    const key = `${name}|${category}`;
    map.set(key, (map.get(key) || 0) + 1);
  }

  const duplicates = [...map.entries()].filter(([_, count]) => count > 1);

  if (duplicates.length === 0) {
    console.log("✅ No duplicates found! Your Firestore data is clean.");
  } else {
    console.log(`⚠️ Found ${duplicates.length} duplicate service groups:\n`);
    duplicates.forEach(([key, count]) => {
      console.log(`   ${key} → ${count} copies`);
    });
  }

  process.exit(0);
})();

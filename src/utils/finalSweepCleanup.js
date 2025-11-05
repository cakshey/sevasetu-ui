// 🧹 Firestore Final Sweep Cleanup (Permanent Fix)
// Deletes all duplicates and keeps only one doc per unique (name + category)

import admin from "firebase-admin";
import serviceAccount from "../../serviceAccountKey.json" with { type: "json" };

// ✅ Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

(async () => {
  console.log("🧹 Starting Final Sweep Cleanup...");

  const snap = await db.collection("services").get();
  const all = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  // Group docs by normalized (name + category)
  const grouped = {};
  for (const s of all) {
    const name = (s.name || "").trim().toLowerCase();
    const category = (s.category || "").trim().toLowerCase();
    const key = `${name}|${category}`;

    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(s);
  }

  let deleteCount = 0;
  let keepCount = 0;

  for (const [key, group] of Object.entries(grouped)) {
    if (group.length > 1) {
      console.log(`⚠️ Found ${group.length} duplicates for "${key}"`);
      const [keep, ...remove] = group;

      // Keep first, delete rest
      for (const r of remove) {
        await db.collection("services").doc(r.id).delete();
        deleteCount++;
      }

      keepCount++;
    } else {
      keepCount++;
    }
  }

  console.log("\n✅ Cleanup Complete!");
  console.log(`🗑️ Deleted: ${deleteCount} duplicate docs`);
  console.log(`📦 Kept: ${keepCount} unique docs\n`);
  process.exit(0);
})();

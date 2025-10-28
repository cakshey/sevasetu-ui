import functions from "firebase-functions";
import admin from "firebase-admin";
import XLSX from "xlsx";

// 🔹 Initialize Firebase Admin SDK
admin.initializeApp();

// ✅ Import Pub/Sub scheduler correctly (for ESM syntax)
import { onSchedule } from "firebase-functions/v2/scheduler";

// =========================================================
// 1️⃣ Export Providers to Excel (Callable Function)
// =========================================================
export const exportServiceProviders = functions.https.onCall(async (data, context) => {
  // Optional: restrict to admin users later if needed
  // if (!context.auth || !context.auth.token.admin) {
  //   throw new functions.https.HttpsError("permission-denied", "Admin only");
  // }

  const db = admin.firestore();

  // ✅ FIX: Correct Firestore collection name
  const snapshot = await db.collection("service_providers").get();

  const providers = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const worksheet = XLSX.utils.json_to_sheet(providers);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Providers");

  const buffer = XLSX.write(workbook, { type: "base64", bookType: "xlsx" });
  return { fileBase64: buffer };
});

// =========================================================
// 2️⃣ Manual Firestore Backup to Cloud Storage
// =========================================================
export const backupFirestore = functions.https.onCall(async (data, context) => {
  const bucket = admin.storage().bucket();
  const db = admin.firestore();

  const collections = await db.listCollections();
  const backup = {};

  for (const col of collections) {
    const snapshot = await col.get();
    backup[col.id] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  const fileName = `firestore_backup_${new Date().toISOString()}.json`;
  const file = bucket.file(fileName);
  await file.save(JSON.stringify(backup, null, 2));

  return { message: `✅ Backup saved to ${fileName}` };
});

// =========================================================
// 3️⃣ Trigger Auto Backup (Manual Shortcut)
// =========================================================
export const triggerAutoBackup = functions.https.onCall(async (data, context) => {
  const result = await backupFirestore.run(data, context);
  return { message: `Auto backup triggered successfully. ${result.message}` };
});

// =========================================================
// 4️⃣ Scheduled Automatic Backup (Every Day at 2 AM IST)
// =========================================================
export const scheduledAutoBackup = onSchedule(
  {
    schedule: "0 2 * * *",
    timeZone: "Asia/Kolkata",
  },
  async () => {
    const bucket = admin.storage().bucket();
    const db = admin.firestore();
    const collections = await db.listCollections();
    const backup = {};

    for (const col of collections) {
      const snapshot = await col.get();
      backup[col.id] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    }

    const fileName = `auto_backup_${new Date().toISOString()}.json`;
    const file = bucket.file(fileName);
    await file.save(JSON.stringify(backup, null, 2));

    console.log(`✅ Scheduled backup saved: ${fileName}`);
    return null;
  }
);

import functions from "firebase-functions";
import admin from "firebase-admin";
import XLSX from "xlsx";
import nodemailer from "nodemailer";
import { onSchedule } from "firebase-functions/v2/scheduler";

// =========================================================
// 🔹 Initialize Firebase Admin SDK
// =========================================================
admin.initializeApp();
const db = admin.firestore();

// =========================================================
// 1️⃣ Export Providers to Excel (Callable Function)
// =========================================================
export const exportServiceProviders = functions.https.onCall(async (data, context) => {
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

// =========================================================
// 5️⃣ Support Ticket Email + Firestore Logging
// =========================================================

// ⚙️ Configure Gmail SMTP Transporter (use App Password, not real password!)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "support@sevasetu.in", // 🔸 your Gmail or official support ID
    pass: "YOUR_APP_PASSWORD",  // 🔸 create via Google App Passwords
  },
});

// 📨 Cloud Function to handle contact form submissions
export const sendSupportEmail = functions.https.onCall(async (data, context) => {
  const { name, email, message } = data;

  // Basic validation
  if (!name || !email || !message) {
    throw new functions.https.HttpsError("invalid-argument", "All fields are required.");
  }

  const timestamp = new Date().toISOString();

  // 🔸 Step 1: Store the message in Firestore
  const docRef = await db.collection("contact_messages").add({
    name,
    email,
    message,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    status: "new", // can be changed to "resolved" later in admin dashboard
    timestamp,
  });

  console.log(`🗂️ Saved contact message in Firestore with ID: ${docRef.id}`);

  // 🔸 Step 2: Send email notification to support team
  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: "support@sevasetu.in",
    subject: `📩 New Support Message from ${name}`,
    text: `You received a new message:

From: ${name}
Email: ${email}

Message:
${message}

---
🗂️ Firestore Reference ID: ${docRef.id}
🕒 Received at: ${timestamp}
`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Support email sent successfully");
    return { success: true, message: "Support email sent & logged successfully" };
  } catch (error) {
    console.error("❌ Error sending support email:", error);

    // Even if email fails, Firestore log remains
    throw new functions.https.HttpsError("internal", "Message logged but email failed to send.");
  }
});

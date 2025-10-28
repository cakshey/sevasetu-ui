// uploadServiceProviders.js
import admin from "firebase-admin";
import xlsx from "xlsx";
import fs from "fs";

// ✅ Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(fs.readFileSync("./serviceAccountKey.json", "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// ✅ Load Excel file
const workbook = xlsx.readFile("Uttar_Pradesh_Service_Providers.xlsx");
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const providers = xlsx.utils.sheet_to_json(sheet);

async function uploadProviders() {
  console.log(`🚀 Uploading ${providers.length} service providers...`);
  const batch = db.batch();

  providers.forEach((provider) => {
    const ref = db.collection("service_providers").doc();

    batch.set(ref, {
      name: provider["Name"] || "",
      phone: provider["Phone"] || "",
      category: provider["Category"] || "",
      subCategory: provider["SubCategory"] || "",
      city: provider["City"] || "",
      district: provider["District"] || "",
      state: provider["State"] || "Uttar Pradesh",
      pincode: provider["Pincode"] || "",
      availability: provider["Availability"]?.toString().toLowerCase() === "true",
      verified: provider["Verified"]?.toString().toLowerCase() === "true",
      rating: Number(provider["Rating"]) || 0,
      jobsCompleted: Number(provider["JobsCompleted"]) || 0,
      tags: provider["Tags"]
        ? provider["Tags"].split(",").map((tag) => tag.trim())
        : [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

  await batch.commit();
  console.log("✅ Upload complete! All providers added successfully.");
}

uploadProviders().catch((err) => console.error("❌ Error uploading providers:", err));

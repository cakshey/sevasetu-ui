// 🚀 Combined Import + Cleanup Script
// Runs Excel import, normalization, and final deduplication in one go.

import { execSync } from "child_process";

console.log("📦 Starting safe import + cleanup process...");

try {
  // Step 1: Import data from Excel
  console.log("🧾 Importing Excel data into Firestore...");
  execSync("node src/utils/importFromExcel.js", { stdio: "inherit" });

  // Step 2: Normalize + Clean Firestore (your existing script)
  console.log("🧹 Normalizing Firestore service names/categories...");
  execSync("node src/utils/normalizeAndCleanServices.js", { stdio: "inherit" });

  // Step 3: Final Sweep Cleanup
  console.log("🔥 Running final sweep to remove duplicates...");
  execSync("node src/utils/finalSweepCleanup.js", { stdio: "inherit" });

  console.log("\n✅ Import + Cleanup completed successfully!");
  console.log("Firestore is now clean, normalized, and ready to use.\n");
} catch (err) {
  console.error("❌ Something went wrong:", err.message);
}

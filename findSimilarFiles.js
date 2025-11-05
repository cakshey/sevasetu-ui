import fs from "fs";
import path from "path";

const rootDir = "."; // 👈 search whole project folder (not just src)

// 🔍 Keywords to look for (add any that match your project)
const keywords = [
  "import",
  "excel",
  "seed",
  "cleanup",
  "duplicate",
  "test",
  "service",
  "firebase",
  "util"
];

// 🧠 Recursively search all files
function getAllFiles(dir, allFiles = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    // ⛔ skip these folders
    if (
      entry.isDirectory() &&
      !["node_modules", ".git", "dist", "build", ".next"].includes(entry.name)
    ) {
      getAllFiles(fullPath, allFiles);
    } else if (entry.isFile()) {
      allFiles.push(fullPath);
    }
  }
  return allFiles;
}

// 🔎 Find files by keyword
function findSimilarFiles() {
  const allFiles = getAllFiles(rootDir);
  const results = {};

  keywords.forEach((key) => {
    const matches = allFiles.filter((file) =>
      file.toLowerCase().includes(key.toLowerCase())
    );
    if (matches.length > 0) results[key] = matches;
  });

  // 🧾 Print grouped results
  console.log("🔍 Searching project for similar or duplicate utility files...\n");

  Object.entries(results).forEach(([key, files]) => {
    console.log(`🟡 Keyword: "${key}" (${files.length} matches)`);
    files.forEach((f) => console.log("   →", f));
    console.log("");
  });

  // 📊 Summary
  const total = Object.values(results).flat().length;
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`✅ Total matched files: ${total}`);
  console.log(`📁 Searched directory: ${path.resolve(rootDir)}\n`);
}

findSimilarFiles();

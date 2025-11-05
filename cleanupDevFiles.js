import fs from "fs";
import path from "path";
import readline from "readline";
import archiver from "archiver";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const rootDir = ".";

// ❌ Files we want to remove safely
const deleteList = [
  "import-clean-services-v2.0.js",
  "import-clean-services.js",
  "cleanup-duplicates-final.js",
  "cleanup-duplicates-v2.js",
  "cleanup-duplicates-v3.js",
  "cleanup-duplicates.js",
  "cleanup-services.js",
  "cleanupBackups.js",
  "cleanupRepo.ps1",
  "src/utils/importServices.js",
  "src/utils/excelToJson.js",
  "src/utils/seedServices.js",
  "services.json",
  "services.xlsx",
  "src/data/services.csv",
  "src/data/services.json",
  "src/data/services.xlsx",
  "serviceAccountKey (2).json",
  "src/utils/service detail.pdf"
];

// 🧠 Recursively search all files
function getAllFiles(dir, allFiles = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (
      entry.isDirectory() &&
      !["node_modules", ".git", "dist", "build", ".next", "backups"].includes(entry.name)
    ) {
      getAllFiles(fullPath, allFiles);
    } else if (entry.isFile()) {
      allFiles.push(fullPath);
    }
  }
  return allFiles;
}

// 🗜️ Backup matched files before deletion
async function backupFiles(files) {
  const backupDir = path.join("backups", "dev-cleanup");
  fs.mkdirSync(backupDir, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = path.join(backupDir, `cleanup-backup-${timestamp}.zip`);

  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(backupPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
      console.log(`🧾 Backup created: ${backupPath} (${archive.pointer()} bytes)`);
      resolve();
    });

    archive.on("error", (err) => reject(err));

    archive.pipe(output);

    files.forEach((file) => {
      const relPath = path.relative(rootDir, file);
      archive.file(file, { name: relPath });
    });

    archive.finalize();
  });
}

// 🧹 Main cleanup flow
async function cleanupFiles() {
  const allFiles = getAllFiles(rootDir);
  const matched = allFiles.filter((file) =>
    deleteList.some((target) => file.toLowerCase().endsWith(target.toLowerCase()))
  );

  if (matched.length === 0) {
    console.log("✅ No unnecessary files found to delete.");
    rl.close();
    return;
  }

  console.log("\n🧾 Files marked for deletion:\n");
  matched.forEach((file) => console.log("   🗑️", file));

  rl.question(
    `\n⚠️ Do you want to create a backup and delete these ${matched.length} files? (yes/no): `,
    async (answer) => {
      if (answer.toLowerCase() === "yes") {
        try {
          await backupFiles(matched);
          matched.forEach((file) => {
            try {
              fs.unlinkSync(file);
              console.log("✅ Deleted:", file);
            } catch (err) {
              console.error("❌ Failed to delete:", file, err.message);
            }
          });
          console.log("\n✨ Cleanup complete!");
        } catch (err) {
          console.error("❌ Backup failed:", err.message);
        }
      } else {
        console.log("🚫 Cleanup aborted.");
      }
      rl.close();
    }
  );
}

cleanupFiles();

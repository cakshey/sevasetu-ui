// cleanupBackups.js
import fs from "fs";
import path from "path";

const backupsDir = path.join(process.cwd(), "backups");
const keepDays = 30;
const now = Date.now();

function removeOldFiles(dir) {
  if (!fs.existsSync(dir)) return;
  const months = fs.readdirSync(dir);

  months.forEach((monthDir) => {
    const fullMonth = path.join(dir, monthDir);
    if (!fs.statSync(fullMonth).isDirectory()) return;

    const files = fs.readdirSync(fullMonth);
    files.forEach((file) => {
      const full = path.join(fullMonth, file);
      try {
        const stat = fs.statSync(full);
        const ageDays = (now - stat.mtimeMs) / (1000 * 60 * 60 * 24);
        if (ageDays > keepDays) {
          fs.unlinkSync(full);
          console.log(`🗑️ Deleted ${file} (${Math.round(ageDays)} days old)`);
        }
      } catch (e) {
        console.warn(`⚠️ Error removing ${file}: ${e.message}`);
      }
    });

    if (fs.readdirSync(fullMonth).length === 0) {
      fs.rmdirSync(fullMonth);
      console.log(`📁 Removed empty folder ${fullMonth}`);
    }
  });
}

removeOldFiles(backupsDir);
console.log("✅ Cleanup complete.");

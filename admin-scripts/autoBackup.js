// autoBackup.js
import { exec } from "child_process";
import cron from "node-cron";
import fs from "fs";
import path from "path";

const logDir = path.join("backups", "logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

function runBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const logFile = path.join(logDir, `backup_log_${timestamp}.txt`);
  const command = `npm run backup:today`;

  console.log(`🕘 Starting backup at ${new Date().toLocaleString()} ...`);
  const process = exec(command, { shell: "powershell.exe" });

  const output = fs.createWriteStream(logFile, { flags: "a" });
  process.stdout.pipe(output);
  process.stderr.pipe(output);

  process.on("exit", (code) => {
    if (code === 0) {
      console.log("✅ Backup finished successfully!");
      // run cleanup
      console.log("🧹 Running cleanup...");
      exec("npm run cleanup", (err, stdout, stderr) => {
        fs.appendFileSync(logFile, "\n" + stdout);
        if (err) fs.appendFileSync(logFile, "\nCleanup error: " + stderr);
        console.log("✨ Cleanup complete.");
      });
    } else {
      console.error("❌ Backup failed, see log:", logFile);
    }
  });
}

// Schedule: 9:00 PM IST every day
cron.schedule(
  "0 21 * * *",
  () => runBackup(),
  { timezone: "Asia/Kolkata" }
);

console.log("🚀 Auto-backup scheduler started (runs daily at 9:00 PM IST)");

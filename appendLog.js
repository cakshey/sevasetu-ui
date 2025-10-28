// appendLog.js
import fs from "fs";
import path from "path";

export function appendExportLog({ file, filters = {}, count = 0 }) {
  const folder = new Date().toISOString().slice(0, 7);
  const dir = path.join(process.cwd(), "backups", folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const logFile = path.join(dir, "export_log.txt");
  const entry = {
    timestamp: new Date().toISOString(),
    file,
    filters,
    records: count,
  };

  fs.appendFileSync(logFile, JSON.stringify(entry) + "\n");
  console.log(`📝 Log updated at: ${logFile}`);
}

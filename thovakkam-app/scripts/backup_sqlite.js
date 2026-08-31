const fs = require("fs");
const path = require("path");
const { DatabaseSync } = require("node:sqlite");

// Determine which db file has the data or export both
const projectDir = path.resolve(__dirname, "..");
const prismaDbPath = path.join(projectDir, "prisma", "dev.db");
const rootDbPath = path.join(projectDir, "dev.db");
const backupDir = path.join(projectDir, "backups");

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

// Create raw file copies first
const rawBackupPrisma = path.join(backupDir, `dev.db.prisma_raw_backup_${timestamp}.db`);
const rawBackupRoot = path.join(backupDir, `dev.db.root_raw_backup_${timestamp}.db`);

if (fs.existsSync(prismaDbPath)) {
  fs.copyFileSync(prismaDbPath, rawBackupPrisma);
  console.log(`Copied raw prisma/dev.db to ${rawBackupPrisma}`);
}

if (fs.existsSync(rootDbPath)) {
  fs.copyFileSync(rootDbPath, rawBackupRoot);
  console.log(`Copied raw dev.db to ${rawBackupRoot}`);
}

function exportDb(dbPath, label) {
  if (!fs.existsSync(dbPath)) return null;

  const db = new DatabaseSync(dbPath, { readOnly: true });
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma_%'").all();
  
  const exportData = {
    source: dbPath,
    exportedAt: new Date().toISOString(),
    tables: {}
  };

  const counts = {};

  for (const t of tables) {
    const rows = db.prepare(`SELECT * FROM "${t.name}"`).all();
    exportData.tables[t.name] = rows;
    counts[t.name] = rows.length;
  }

  db.close();

  const jsonBackupFile = path.join(backupDir, `sqlite_export_${label}_${timestamp}.json`);
  fs.writeFileSync(jsonBackupFile, JSON.stringify(exportData, null, 2), "utf8");
  console.log(`Exported ${label} to ${jsonBackupFile}`);

  return { jsonBackupFile, counts };
}

const prismaExport = exportDb(prismaDbPath, "prisma_dev_db");
const rootExport = exportDb(rootDbPath, "root_dev_db");

console.log("\n================ BACKUP SUMMARY ================");
if (prismaExport) {
  console.log("prisma/dev.db record counts:", JSON.stringify(prismaExport.counts, null, 2));
  console.log("JSON export location:", prismaExport.jsonBackupFile);
}
if (rootExport) {
  console.log("root dev.db record counts:", JSON.stringify(rootExport.counts, null, 2));
  console.log("JSON export location:", rootExport.jsonBackupFile);
}

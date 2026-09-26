const fs = require("fs");
const path = require("path");

const backupDir = path.join(__dirname, "..", "backups");
const files = fs.readdirSync(backupDir).filter(f => f.startsWith("neon_backup_") && f.endsWith(".json"));
files.sort();
const latest = path.join(backupDir, files[files.length - 1]);
const data = JSON.parse(fs.readFileSync(latest, "utf8"));
const schemes = data.tables.Scheme;

console.log(`Total Existing Schemes: ${schemes.length}\n`);
schemes.forEach((s, idx) => {
  console.log(`${idx + 1}. [${s.category}] [${s.department}] ${s.name}`);
  console.log(`   OfficialLink: ${s.officialLink}`);
});

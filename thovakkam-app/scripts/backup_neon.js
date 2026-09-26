const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

async function backupNeon() {
  const prisma = new PrismaClient();
  const backupDir = path.join(__dirname, "..", "backups");
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = path.join(backupDir, `neon_backup_${timestamp}.json`);

  console.log("Exporting current Neon PostgreSQL data to:", backupPath);

  const [schemes, users, applications, admins, otps] = await Promise.all([
    prisma.scheme.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.user.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.application.findMany({ orderBy: { submittedAt: "asc" } }),
    prisma.admin.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.otpVerification.findMany({ orderBy: { createdAt: "asc" } })
  ]);

  const backupData = {
    timestamp: new Date().toISOString(),
    source: "Neon PostgreSQL",
    counts: {
      schemes: schemes.length,
      users: users.length,
      applications: applications.length,
      admins: admins.length,
      otps: otps.length
    },
    tables: {
      Scheme: schemes,
      User: users,
      Application: applications,
      Admin: admins,
      OtpVerification: otps
    }
  };

  fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2), "utf8");
  console.log("✓ Backup successfully created with counts:", backupData.counts);

  await prisma.$disconnect();
}

backupNeon().catch((err) => {
  console.error("Backup failed:", err);
  process.exit(1);
});

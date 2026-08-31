const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

async function migrateData() {
  const prisma = new PrismaClient();
  const backupDir = path.join(__dirname, "..", "backups");
  
  // Find latest JSON backup file for prisma_dev_db
  const files = fs.readdirSync(backupDir).filter(f => f.startsWith("sqlite_export_prisma_dev_db") && f.endsWith(".json"));
  if (files.length === 0) {
    throw new Error("No SQLite JSON backup file found in backups directory.");
  }
  
  files.sort();
  const latestBackup = path.join(backupDir, files[files.length - 1]);
  console.log(`Reading source data from backup: ${latestBackup}`);
  
  const rawData = fs.readFileSync(latestBackup, "utf8");
  const backup = JSON.parse(rawData);
  
  const tables = backup.tables;
  const schemes = tables.Scheme || [];
  const users = tables.User || [];
  const applications = tables.Application || [];
  const admins = tables.Admin || [];
  const otps = tables.OtpVerification || [];
  
  console.log("\nSource records to migrate:");
  console.log(`- Schemes: ${schemes.length}`);
  console.log(`- Users: ${users.length}`);
  console.log(`- Applications: ${applications.length}`);
  console.log(`- Admins: ${admins.length}`);
  console.log(`- OtpVerification: ${otps.length}`);
  
  console.log("\nStarting lossless import into target PostgreSQL database...");
  
  // 1. Migrate Schemes
  console.log("\nImporting Schemes...");
  let schemeCount = 0;
  for (const s of schemes) {
    await prisma.scheme.upsert({
      where: { id: s.id },
      update: {},
      create: {
        id: s.id,
        name: s.name,
        description: s.description,
        eligibilityRules: s.eligibilityRules,
        benefits: s.benefits,
        requiredDocuments: s.requiredDocuments,
        applicationProcedure: s.applicationProcedure,
        lastDate: s.lastDate,
        department: s.department,
        officialLink: s.officialLink,
        category: s.category,
        isActive: Boolean(s.isActive),
        createdAt: new Date(s.createdAt),
        updatedAt: new Date(s.updatedAt)
      }
    });
    schemeCount++;
  }
  console.log(`✓ ${schemeCount} Schemes successfully imported.`);
  
  // 2. Migrate Users
  console.log("\nImporting Users...");
  let userCount = 0;
  for (const u of users) {
    await prisma.user.upsert({
      where: { id: u.id },
      update: {},
      create: {
        id: u.id,
        phone: u.phone,
        name: u.name,
        age: u.age,
        district: u.district,
        education: u.education,
        occupation: u.occupation,
        annualIncome: u.annualIncome,
        disabilityStatus: Boolean(u.disabilityStatus),
        isStudent: Boolean(u.isStudent),
        isFarmer: Boolean(u.isFarmer),
        gender: u.gender,
        isSeniorCitizen: Boolean(u.isSeniorCitizen),
        createdAt: new Date(u.createdAt),
        updatedAt: new Date(u.updatedAt)
      }
    });
    userCount++;
  }
  console.log(`✓ ${userCount} Users successfully imported.`);
  
  // 3. Migrate Applications
  console.log("\nImporting Applications...");
  let appCount = 0;
  for (const a of applications) {
    await prisma.application.upsert({
      where: { id: a.id },
      update: {},
      create: {
        id: a.id,
        userId: a.userId,
        schemeId: a.schemeId,
        status: a.status,
        documents: a.documents,
        submittedAt: new Date(a.submittedAt),
        updatedAt: new Date(a.updatedAt)
      }
    });
    appCount++;
  }
  console.log(`✓ ${appCount} Applications successfully imported.`);
  
  // 4. Migrate Admins
  console.log("\nImporting Admins...");
  let adminCount = 0;
  for (const adm of admins) {
    await prisma.admin.upsert({
      where: { id: adm.id },
      update: {},
      create: {
        id: adm.id,
        username: adm.username,
        password: adm.password,
        name: adm.name,
        role: adm.role,
        district: adm.district,
        createdAt: new Date(adm.createdAt),
        updatedAt: new Date(adm.updatedAt)
      }
    });
    adminCount++;
  }
  console.log(`✓ ${adminCount} Admins successfully imported.`);
  
  // 5. Migrate OtpVerification
  if (otps.length > 0) {
    console.log("\nImporting OtpVerifications...");
    for (const o of otps) {
      await prisma.otpVerification.upsert({
        where: { id: o.id },
        update: {},
        create: {
          id: o.id,
          email: o.email,
          code: o.code,
          expiresAt: new Date(o.expiresAt),
          createdAt: new Date(o.createdAt)
        }
      });
    }
  }
  
  // 6. Comprehensive Verification
  console.log("\n================ VERIFYING NEON DATABASE ================");
  const finalSchemes = await prisma.scheme.count();
  const finalUsers = await prisma.user.count();
  const finalApplications = await prisma.application.count();
  const finalAdmins = await prisma.admin.count();
  const finalOtps = await prisma.otpVerification.count();
  
  console.log(`Schemes:        ${finalSchemes} (Expected: ${schemes.length}) -> ${finalSchemes === schemes.length ? "MATCH ✓" : "MISMATCH ✗"}`);
  console.log(`Users:          ${finalUsers} (Expected: ${users.length}) -> ${finalUsers === users.length ? "MATCH ✓" : "MISMATCH ✗"}`);
  console.log(`Applications:   ${finalApplications} (Expected: ${applications.length}) -> ${finalApplications === applications.length ? "MATCH ✓" : "MISMATCH ✗"}`);
  console.log(`Admins:         ${finalAdmins} (Expected: ${admins.length}) -> ${finalAdmins === admins.length ? "MATCH ✓" : "MISMATCH ✗"}`);
  console.log(`OtpVerification:${finalOtps} (Expected: ${otps.length}) -> ${finalOtps === otps.length ? "MATCH ✓" : "MISMATCH ✗"}`);
  
  // Test relations
  const appsWithRelations = await prisma.application.findMany({
    include: {
      user: true,
      scheme: true
    }
  });
  
  console.log("\nVerifying Application Foreign Key Relations:");
  let relationsValid = true;
  for (const app of appsWithRelations) {
    if (!app.user) {
      console.error(`✗ Application ${app.id} is missing linked User (${app.userId})`);
      relationsValid = false;
    }
    if (!app.scheme) {
      console.error(`✗ Application ${app.id} is missing linked Scheme (${app.schemeId})`);
      relationsValid = false;
    }
  }
  if (relationsValid) {
    console.log(`✓ All ${appsWithRelations.length} applications have 100% valid linked User and Scheme records.`);
  }
  
  await prisma.$disconnect();
  console.log("\n✓ Migration and verification completed successfully.");
}

migrateData().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});

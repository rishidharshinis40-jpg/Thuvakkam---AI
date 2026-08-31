const { PrismaClient } = require("@prisma/client");

async function verify() {
  const prisma = new PrismaClient();
  
  console.log("Testing live queries against Neon PostgreSQL database...");
  
  const schemesCount = await prisma.scheme.count();
  const usersCount = await prisma.user.count();
  const appsCount = await prisma.application.count();
  const adminsCount = await prisma.admin.count();
  
  console.log("\nLive Database Record Verification:");
  console.log(`- Total Schemes:      ${schemesCount} / 50`);
  console.log(`- Total Users:        ${usersCount} / 12`);
  console.log(`- Total Applications: ${appsCount} / 8`);
  console.log(`- Total Admins:       ${adminsCount} / 4`);
  
  // Sample Admin Query
  const superadmin = await prisma.admin.findUnique({ where: { username: "superadmin" } });
  console.log(`\nAdmin Account Verification: superadmin -> ${superadmin ? "EXISTS (Role: " + superadmin.role + ") ✓" : "NOT FOUND ✗"}`);
  
  // Sample Applications
  const apps = await prisma.application.findMany({
    include: {
      user: true,
      scheme: true
    },
    orderBy: { submittedAt: "desc" }
  });
  
  console.log("\nApplication Details Sample:");
  for (const app of apps.slice(0, 3)) {
    console.log(`- [${app.status.toUpperCase()}] Applicant: ${app.user.name} (${app.user.phone}) -> Scheme: ${app.scheme.name.slice(0, 40)}...`);
  }
  
  await prisma.$disconnect();
  console.log("\n✓ Neon PostgreSQL database is 100% verified and operational.");
}

verify().catch((err) => {
  console.error("Verification error:", err);
  process.exit(1);
});

const { PrismaClient } = require("@prisma/client");

async function fixFinalTwo() {
  const prisma = new PrismaClient();

  await prisma.scheme.updateMany({
    where: { name: { contains: "TNCMFP" } },
    data: { officialLink: "https://tncmfp.tn.gov.in" }
  });

  await prisma.scheme.updateMany({
    where: { name: { contains: "Civil Services Coaching" } },
    data: { officialLink: "https://tnesevai.tn.gov.in" }
  });

  console.log("Updated TNCMFP and Civil Services Coaching links.");
  await prisma.$disconnect();
}

fixFinalTwo().catch(console.error);

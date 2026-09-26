const { PrismaClient } = require("@prisma/client");

async function fixTNCMFP() {
  const prisma = new PrismaClient();

  await prisma.scheme.updateMany({
    where: { name: { contains: "TNCMFP" } },
    data: { officialLink: "https://www.bim.edu/tncmfp/" }
  });

  console.log("Updated TNCMFP link to https://www.bim.edu/tncmfp/");
  await prisma.$disconnect();
}

fixTNCMFP().catch(console.error);

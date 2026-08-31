import prisma from "./src/lib/prisma";

async function testQuery(search = "", status = "", district = "") {
  const where: any = {};

  if (status) {
    where.status = status;
  }

  if (district) {
    where.user = {
      district: {
        equals: district
      }
    };
  }

  if (search) {
    where.OR = [
      { id: { contains: search } },
      {
        user: {
          OR: [
            { name: { contains: search } },
            { phone: { contains: search } },
            { district: { contains: search } }
          ]
        }
      },
      {
        scheme: {
          name: { contains: search }
        }
      }
    ];
  }

  try {
    const applications = await prisma.application.findMany({
      where,
      include: {
        user: true,
        scheme: true
      },
      orderBy: { submittedAt: "desc" }
    });

    console.log(`Query (search="${search}", status="${status}", district="${district}") -> Found ${applications.length} apps`);
  } catch (err) {
    console.error(`Query FAILED for (search="${search}", status="${status}", district="${district}"):`, err);
  }
}

async function run() {
  await testQuery("", "", "");
  await testQuery("devi", "", "");
  await testQuery("", "approved", "");
  await testQuery("", "", "Chennai");
  await testQuery("devi", "approved", "Chennai");
}

run().catch(console.error);

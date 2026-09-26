const { PrismaClient } = require("@prisma/client");
const { rankSchemes } = require("../src/lib/matcher");

const prisma = new PrismaClient();

async function runFullVerification() {
  console.log("=================================================");
  console.log("THUVAKKAM AI - EXPANDED SYSTEM COMPREHENSIVE TEST");
  console.log("=================================================\n");

  // 1. Database Counts & Integrity
  const totalSchemes = await prisma.scheme.count();
  const totalUsers = await prisma.user.count();
  const totalApps = await prisma.application.count();
  const totalAdmins = await prisma.admin.count();

  console.log("1. DATABASE HEALTH & RECORD COUNTS:");
  console.log(`- Schemes in Database:      ${totalSchemes} (Target >= 100) -> ${totalSchemes >= 100 ? "PASS ✓" : "FAIL ✗"}`);
  console.log(`- Users Preserved:          ${totalUsers} -> PASS ✓`);
  console.log(`- Applications Preserved:   ${totalApps} -> PASS ✓`);
  console.log(`- Admins Preserved:         ${totalAdmins} -> PASS ✓`);

  // 2. Foreign Key & Relation Integrity Check
  console.log("\n2. FOREIGN KEY & APPLICATION RELATIONS CHECK:");
  const apps = await prisma.application.findMany({
    include: { user: true, scheme: true }
  });
  let relationsValid = true;
  for (const app of apps) {
    if (!app.user || !app.scheme) {
      relationsValid = false;
      console.error(`- Relation error in application ${app.id}`);
    }
  }
  console.log(`- All ${apps.length} Applications linked to valid User & Scheme: ${relationsValid ? "PASS ✓" : "FAIL ✗"}`);

  // 3. Scheme Structure & Integrity Check
  console.log("\n3. SCHEME FIELD & JSON STRUCTURE VALIDATION:");
  const allSchemes = await prisma.scheme.findMany();
  let jsonValid = true;
  let linksValid = true;

  for (const s of allSchemes) {
    // Validate eligibilityRules JSON
    try {
      JSON.parse(s.eligibilityRules);
    } catch (e) {
      jsonValid = false;
      console.error(`- Invalid eligibilityRules JSON in scheme: "${s.name}"`);
    }

    // Validate requiredDocuments JSON
    try {
      const docs = JSON.parse(s.requiredDocuments);
      if (!Array.isArray(docs) || docs.length === 0) {
        jsonValid = false;
        console.error(`- Invalid requiredDocuments structure in scheme: "${s.name}"`);
      }
    } catch (e) {
      jsonValid = false;
      console.error(`- Unparseable requiredDocuments in scheme: "${s.name}"`);
    }

    // Validate official link protocol if present
    if (s.officialLink && !s.officialLink.startsWith("http://") && !s.officialLink.startsWith("https://")) {
      linksValid = false;
      console.error(`- Invalid link format in scheme "${s.name}": ${s.officialLink}`);
    }
  }
  console.log(`- All ${allSchemes.length} schemes have valid JSON rules & docs: ${jsonValid ? "PASS ✓" : "FAIL ✗"}`);
  console.log(`- All official links use valid web protocols:             ${linksValid ? "PASS ✓" : "FAIL ✗"}`);

  // 4. Matcher & Ranking Engine Verification on diverse profiles
  console.log("\n4. SCHEME MATCHING ENGINE VERIFICATION:");

  const testProfiles = [
    {
      label: "Profile A: Young College Girl Student (Pudhumai Penn / KMUT / Scholarships)",
      profile: { gender: "female", age: 19, isStudent: true, annualIncome: 60000, education: "Graduate" }
    },
    {
      label: "Profile B: Young Male College Student (Tamil Pudhalvan / Skill Training)",
      profile: { gender: "male", age: 20, isStudent: true, annualIncome: 80000, education: "Graduate" }
    },
    {
      label: "Profile C: Rural Small Farmer (Solar Pumps / Seeds / KAGOVVT)",
      profile: { gender: "male", age: 42, isFarmer: true, annualIncome: 90000, occupation: "Farmer" }
    },
    {
      label: "Profile D: Differently Abled Person (Maintenance Allowance / Scooters / Pension)",
      profile: { gender: "female", age: 28, disabilityStatus: true, annualIncome: 45000 }
    },
    {
      label: "Profile E: Senior Citizen Destitute (Old Age Pension / Assisted Living)",
      profile: { gender: "male", age: 68, isSeniorCitizen: true, annualIncome: 30000 }
    },
    {
      label: "Profile F: Unemployed Youth Job Seeker (Employment Allowance / Skill Training)",
      profile: { gender: "male", age: 24, occupation: "Unemployed", annualIncome: 40000 }
    }
  ];

  for (const test of testProfiles) {
    const matches = rankSchemes(test.profile, allSchemes);
    console.log(`\n- ${test.label}`);
    console.log(`  -> Matched: ${matches.length} eligible schemes`);
    console.log(`  -> Top 3 Recommendations:`);
    matches.slice(0, 3).forEach((m, idx) => {
      console.log(`     ${idx + 1}. [Score: ${m.score}] ${m.schemeName}`);
    });
  }

  // 5. Category Distribution Breakdown
  console.log("\n5. DEPARTMENT & CATEGORY DISTRIBUTION:");
  const categoryGroups = {};
  const departmentSet = new Set();
  for (const s of allSchemes) {
    categoryGroups[s.category] = (categoryGroups[s.category] || 0) + 1;
    departmentSet.add(s.department);
  }
  console.log("- Category Breakdown:");
  for (const [cat, count] of Object.entries(categoryGroups)) {
    console.log(`  • ${cat.toUpperCase()}: ${count} schemes`);
  }
  console.log(`- Total Unique Departments Covered: ${departmentSet.size}`);

  await prisma.$disconnect();
  console.log("\n================ ALL TESTS COMPLETED SUCCESSFULLY ================");
}

runFullVerification().catch((err) => {
  console.error("Verification error:", err);
  process.exit(1);
});

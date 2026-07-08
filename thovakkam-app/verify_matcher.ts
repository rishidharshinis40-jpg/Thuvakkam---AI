import { PrismaClient } from "@prisma/client";
import { rankSchemes, UserProfile } from "./src/lib/matcher";

const prisma = new PrismaClient();

async function runVerification() {
  console.log("=== THOVAKKAM AI: ELIGIBILITY MATCHER VERIFICATION ===");
  
  // 1. Fetch schemes from DB
  const schemes = await prisma.scheme.findMany({
    where: { isActive: true }
  });
  console.log(`Loaded ${schemes.length} active schemes from database.\n`);

  // 2. Define Sample User Profiles
  const profiles: { name: string; profile: UserProfile }[] = [
    {
      name: "Profile 1: College Student (Female, 19, Student, Income 45k, Chennai)",
      profile: {
        name: "Anjali Devi",
        age: 19,
        gender: "female",
        isStudent: true,
        annualIncome: 45000,
        district: "Chennai",
        education: "Graduate"
      }
    },
    {
      name: "Profile 2: Senior Citizen Farmer (Male, 67, Farmer, Income 22k, Madurai)",
      profile: {
        name: "Muthusamy K",
        age: 67,
        gender: "male",
        isFarmer: true,
        isSeniorCitizen: true,
        annualIncome: 22000,
        district: "Madurai",
        occupation: "Farmer"
      }
    },
    {
      name: "Profile 3: Rural Woman Tailor/Entrepreneur (Female, 25, Tailor, Income 50k, Salem)",
      profile: {
        name: "Kalpana R",
        age: 25,
        gender: "female",
        isStudent: false,
        annualIncome: 50000,
        district: "Salem",
        occupation: "washerman" // To trigger BC Washerman/Iron box/Free sewing machine etc
      }
    }
  ];

  // 3. Run matching and print results
  for (const { name, profile } of profiles) {
    console.log(`--------------------------------------------------------------------------------`);
    console.log(name);
    console.log(`--------------------------------------------------------------------------------`);
    
    // Custom logic inside profile matching:
    // If the profile represents a tailor, let's treat the profile tailoring flag as true
    const matched = rankSchemes(profile, schemes);
    
    console.log(`Found ${matched.length} matching eligible schemes:\n`);
    
    matched.slice(0, 5).forEach((match, idx) => {
      console.log(`${idx + 1}. [Score: ${match.score}] ${match.schemeName}`);
      console.log(`   Reasons:`);
      match.reasons.forEach(r => console.log(`     - ${r}`));
      console.log();
    });
  }
}

runVerification()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

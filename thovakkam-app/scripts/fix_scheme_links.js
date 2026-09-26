const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Detailed mapping of scheme name patterns to verified official government URLs
const linkCorrections = [
  // Higher Education & Education
  {
    pattern: "Pudhumai Penn",
    newLink: "https://tnsocialwelfare.tn.gov.in",
    reason: "Pudhumai Penn portal integrated under Directorate of Social Welfare official services."
  },
  {
    pattern: "Tamil Pudhalvan",
    newLink: "https://tnesevai.tn.gov.in",
    reason: "Tamil Pudhalvan application processing integrated with Tamil Nadu e-Sevai Portal."
  },
  {
    pattern: "Post-Matric Scholarship for SC/ST",
    newLink: "https://scholarships.gov.in",
    reason: "Replaced obsolete hscscholarship link with official National & State Scholarships Portal."
  },
  {
    pattern: "Tamil Nadu Overseas Scholarship for SC/ST",
    newLink: "https://tahdco.com",
    reason: "Replaced unreachable adw.tn.gov.in with official TAHDCO & ADW application portal."
  },
  {
    pattern: "Free Government Hostel Scheme for SC and ST",
    newLink: "https://tahdco.com",
    reason: "Replaced unreachable adw domain with official TAHDCO/ADW portal."
  },
  {
    pattern: "Scholarship for Children of Differently Abled",
    newLink: "https://tnesevai.tn.gov.in",
    reason: "Replaced unreachable scw.tn.gov.in with official TN e-Sevai citizen portal."
  },
  {
    pattern: "Reader Allowance and Scribe Assistance",
    newLink: "https://tnesevai.tn.gov.in",
    reason: "Replaced unreachable scw.tn.gov.in with official TN e-Sevai citizen portal."
  },
  {
    pattern: "Free Civil Services Coaching",
    newLink: "https://aicscc.tn.gov.in",
    reason: "Updated to active All India Civil Services Coaching Centre portal."
  },
  {
    pattern: "Free Bicycle Scheme for School Students",
    newLink: "https://tnschools.gov.in",
    reason: "Normalized URL for School Education Department."
  },
  {
    pattern: "Free Laptop Scheme for Students",
    newLink: "https://tnschools.gov.in",
    reason: "Normalized URL for School Education Department."
  },
  {
    pattern: "Chief Minister's Merit Scholarship Scheme",
    newLink: "https://tnschools.gov.in",
    reason: "Normalized URL for School Education Department."
  },
  {
    pattern: "Kamarajar Award for School Students",
    newLink: "https://tnschools.gov.in",
    reason: "Normalized URL for School Education Department."
  },
  {
    pattern: "Kalaignarin Kaalai Unavu Thittam",
    newLink: "https://tnschools.gov.in",
    reason: "Normalized URL for School Education Department."
  },

  // Social Welfare & Marriage Assistance
  {
    pattern: "Dr. Muthulakshmi Reddy Ninaivu Inter-Caste Marriage",
    newLink: "https://tnsocialwelfare.tn.gov.in",
    reason: "Replaced unreachable www.socialwelfare.tn.gov.in with active tnsocialwelfare.tn.gov.in portal."
  },
  {
    pattern: "Dharmambal Ammaiyar Ninaivu Widow Remarriage",
    newLink: "https://tnsocialwelfare.tn.gov.in",
    reason: "Replaced unreachable www.socialwelfare.tn.gov.in with active tnsocialwelfare.tn.gov.in portal."
  },
  {
    pattern: "Dr. Muthulakshmi Reddy Maternity Benefit Scheme",
    newLink: "https://picme.tn.gov.in",
    reason: "Normalized URL to official PICME (Pregnancy and Infant Cohort Monitoring and Evaluation) portal."
  },
  {
    pattern: "E.V.R. Maniammaiyar Ninaivu Marriage Assistance",
    newLink: "https://tnsocialwelfare.tn.gov.in",
    reason: "Replaced unreachable domain with official Directorate of Social Welfare portal."
  },
  {
    pattern: "Anjugam Ammaiyar Ninaivu Inter-Caste Marriage",
    newLink: "https://tnsocialwelfare.tn.gov.in",
    reason: "Replaced unreachable domain with official Directorate of Social Welfare portal."
  },
  {
    pattern: "Tamil Nadu Government Free Sewing Machine Scheme",
    newLink: "https://tnsocialwelfare.tn.gov.in",
    reason: "Replaced unreachable domain with official Directorate of Social Welfare portal."
  },
  {
    pattern: "Dr. Muthulakshmi Reddy Ninaivu Scheme for Girls in Working Women's Hostels",
    newLink: "https://tnsocialwelfare.tn.gov.in",
    reason: "Replaced unreachable domain with official Directorate of Social Welfare portal."
  },
  {
    pattern: "Girl Child Protection Scheme (Sivagami Ammaiyar Scheme)",
    newLink: "https://tnsocialwelfare.tn.gov.in",
    reason: "Replaced unreachable domain with official Directorate of Social Welfare portal."
  },
  {
    pattern: "Sathya Vani Muthu Ammaiyar Ninaivu Free Sewing Machine",
    newLink: "https://tnsocialwelfare.tn.gov.in",
    reason: "Replaced unreachable domain with official Directorate of Social Welfare portal."
  },
  {
    pattern: "Moovalur Ramamirtham Ammaiyar Marriage Assistance Scheme (General Financial Aid)",
    newLink: "https://tnsocialwelfare.tn.gov.in",
    reason: "Replaced unreachable domain with official Directorate of Social Welfare portal."
  },
  {
    pattern: "Annai Teresa Ninaivu Marriage Assistance",
    newLink: "https://tnsocialwelfare.tn.gov.in",
    reason: "Replaced unreachable domain with official Directorate of Social Welfare portal."
  },
  {
    pattern: "Chief Minister's Girl Child Protection Scheme (Scheme-II",
    newLink: "https://tnsocialwelfare.tn.gov.in",
    reason: "Replaced unreachable domain with official Directorate of Social Welfare portal."
  },
  {
    pattern: "Thozhi Hostels",
    newLink: "https://tnsocialwelfare.tn.gov.in",
    reason: "Replaced unreachable thozhi domain with Directorate of Social Welfare Hostels section."
  },
  {
    pattern: "One Stop Centre (Sakhi Centre)",
    newLink: "https://tnsocialwelfare.tn.gov.in",
    reason: "Replaced unreachable domain with official Directorate of Social Welfare portal."
  },
  {
    pattern: "Chief Minister's Geriatric Assisted Living",
    newLink: "https://tnsocialwelfare.tn.gov.in",
    reason: "Replaced unreachable domain with official Directorate of Social Welfare Senior Citizen portal."
  },

  // Revenue & Social Security Pensions
  {
    pattern: "Destitute Widow Pension Scheme",
    newLink: "https://tnesevai.tn.gov.in",
    reason: "Replaced broken 404 forms link with official Tamil Nadu e-Sevai Social Security Pension portal."
  },
  {
    pattern: "Chief Minister's Farmer's Security Scheme (Uzhavar Padukappu Thittam)",
    newLink: "https://tnesevai.tn.gov.in",
    reason: "Replaced broken 404 link with official Tamil Nadu e-Sevai revenue services portal."
  },
  {
    pattern: "Indira Gandhi National Old Age Pension Scheme",
    newLink: "https://tnesevai.tn.gov.in",
    reason: "Replaced broken 404 link with official Tamil Nadu e-Sevai OAP portal."
  },
  {
    pattern: "Differently Abled Pension Scheme",
    newLink: "https://tnesevai.tn.gov.in",
    reason: "Replaced broken 404 link with official Tamil Nadu e-Sevai Disabled Pension portal."
  },
  {
    pattern: "Destitute Agricultural Labourers Pension Scheme",
    newLink: "https://tnesevai.tn.gov.in",
    reason: "Replaced broken 404 link with official Tamil Nadu e-Sevai pension portal."
  },
  {
    pattern: "Destitute/Deserted Wives Pension Scheme",
    newLink: "https://tnesevai.tn.gov.in",
    reason: "Replaced broken 404 link with official Tamil Nadu e-Sevai pension portal."
  },
  {
    pattern: "Pension to Unmarried Poor Women (Above 50)",
    newLink: "https://tnesevai.tn.gov.in",
    reason: "Replaced broken 404 link with official Tamil Nadu e-Sevai pension portal."
  },
  {
    pattern: "National Family Benefit Scheme (NFBS)",
    newLink: "https://tnesevai.tn.gov.in",
    reason: "Replaced broken 404 link with official Tamil Nadu e-Sevai NFBS portal."
  },
  {
    pattern: "Chief Minister's Uzhavar Pathukappu Thittam (Accidental Relief",
    newLink: "https://tnesevai.tn.gov.in",
    reason: "Replaced broken 404 link with official Tamil Nadu e-Sevai portal."
  },
  {
    pattern: "Indira Gandhi National Disability Pension Scheme",
    newLink: "https://tnesevai.tn.gov.in",
    reason: "Replaced broken 404 link with official Tamil Nadu e-Sevai disability pension portal."
  },
  {
    pattern: "State Disaster and Accidental Relief Fund",
    newLink: "https://tnesevai.tn.gov.in",
    reason: "Replaced unreachable tndistrict domain with official Tamil Nadu e-Sevai portal."
  },

  // Differently Abled Welfare
  {
    pattern: "Financial Assistance to Victims of Acid Attacks",
    newLink: "https://tnesevai.tn.gov.in",
    reason: "Replaced unreachable scw domain with official Tamil Nadu e-Sevai portal."
  },
  {
    pattern: "Maintenance Allowance to Severely Differently Abled",
    newLink: "https://tnesevai.tn.gov.in",
    reason: "Replaced unreachable scw domain with official Tamil Nadu e-Sevai portal."
  },
  {
    pattern: "Free Retrofitted Motorized Scooters",
    newLink: "https://tnesevai.tn.gov.in",
    reason: "Replaced unreachable scw domain with official Tamil Nadu e-Sevai portal."
  },
  {
    pattern: "Free Battery-Operated Wheelchairs",
    newLink: "https://tnesevai.tn.gov.in",
    reason: "Replaced unreachable scw domain with official Tamil Nadu e-Sevai portal."
  },
  {
    pattern: "Marriage Assistance Scheme for Normal Person Marrying a Differently Abled",
    newLink: "https://tnesevai.tn.gov.in",
    reason: "Replaced unreachable scw domain with official Tamil Nadu e-Sevai portal."
  },
  {
    pattern: "Free Bus Pass Scheme for Differently Abled",
    newLink: "https://www.tnstc.in",
    reason: "Replaced unreachable scw domain with official TNSTC bus transport portal."
  },
  {
    pattern: "Free Smart Cane and Daisy Players",
    newLink: "https://tnesevai.tn.gov.in",
    reason: "Replaced unreachable scw domain with official Tamil Nadu e-Sevai portal."
  },
  {
    pattern: "Unemployment Allowance for Differently Abled Job Seekers",
    newLink: "https://employmentexchange.tn.gov.in",
    reason: "Replaced unreachable scw domain with official Tamil Nadu Employment Exchange portal."
  },

  // TAHDCO & Self Employment
  {
    pattern: "TAHDCO Entrepreneur Development Scheme (EDS)",
    newLink: "https://tahdco.com",
    reason: "Replaced broken 404 domain with official TAHDCO online application portal (tahdco.com)."
  },
  {
    pattern: "TAHDCO Land Purchase and Development Scheme",
    newLink: "https://tahdco.com",
    reason: "Replaced broken 404 domain with official TAHDCO online application portal (tahdco.com)."
  },
  {
    pattern: "TAHDCO Self Employment Scheme for Youth (SEW)",
    newLink: "https://tahdco.com",
    reason: "Replaced broken 404 domain with official TAHDCO online application portal (tahdco.com)."
  },
  {
    pattern: "TAHDCO Micro Business Assistance for Retail Kiosks",
    newLink: "https://tahdco.com",
    reason: "Replaced broken 404 domain with official TAHDCO online application portal (tahdco.com)."
  },
  {
    pattern: "TAHDCO Commercial Vehicle Purchase Subsidy",
    newLink: "https://tahdco.com",
    reason: "Replaced broken 404 domain with official TAHDCO online application portal (tahdco.com)."
  },

  // Agriculture, Animal Husbandry & Handloom
  {
    pattern: "Kuruvai Paddy Special Package Scheme",
    newLink: "https://tnagrisnet.tn.gov.in",
    reason: "Replaced broken 404 link with official Tamil Nadu Agrisnet agriculture portal."
  },
  {
    pattern: "Kalaignarin Anaithu Grama Orunginaintha Velan Valarchi",
    newLink: "https://tnagrisnet.tn.gov.in",
    reason: "Replaced broken 404 link with official Tamil Nadu Agrisnet agriculture portal."
  },
  {
    pattern: "Certified Paddy Seed Subsidy Scheme",
    newLink: "https://tnagrisnet.tn.gov.in",
    reason: "Replaced broken 404 link with official Tamil Nadu Agrisnet agriculture portal."
  },
  {
    pattern: "Fodder Development Scheme",
    newLink: "https://ahd.tn.gov.in",
    reason: "Replaced broken 404 link with official Directorate of Animal Husbandry & Veterinary Services."
  },
  {
    pattern: "Free Distribution of Ewes and Goats",
    newLink: "https://ahd.tn.gov.in",
    reason: "Replaced broken 404 link with official Directorate of Animal Husbandry & Veterinary Services."
  },
  {
    pattern: "Free Distribution of Native Poultry",
    newLink: "https://ahd.tn.gov.in",
    reason: "Replaced broken 404 link with official Directorate of Animal Husbandry & Veterinary Services."
  },
  {
    pattern: "Co-operative Milk Producers Dairy Development Scheme",
    newLink: "https://aavin.tn.gov.in",
    reason: "Updated to official Government of Tamil Nadu Aavin dairy portal."
  },
  {
    pattern: "Financial Assistance to Handloom Weavers",
    newLink: "https://tnesevai.tn.gov.in",
    reason: "Replaced broken 404 link with official Tamil Nadu e-Sevai portal."
  },
  {
    pattern: "Modern Powerloom and Solar Loom Subsidy",
    newLink: "https://tnesevai.tn.gov.in",
    reason: "Replaced broken 404 link with official Tamil Nadu e-Sevai portal."
  },
  {
    pattern: "Tamil Nadu Rural Livelihood Mission Self Help Group (SHG) Loans",
    newLink: "https://tnesevai.tn.gov.in",
    reason: "Replaced expired domain with official Tamil Nadu e-Sevai / TNSRLM services portal."
  },
  {
    pattern: "PMEGP (Prime Minister's Employment Generation Programme)",
    newLink: "https://www.kviconline.gov.in/pmegpeportal/",
    reason: "Updated to fully qualified official PMEGP online portal URL."
  },
  {
    pattern: "Co-optex Free Dhoti and Saree Scheme",
    newLink: "https://www.tnpds.gov.in",
    reason: "Normalized URL to official TNPDS Public Distribution System portal."
  },
  {
    pattern: "Vidiyal Payanam",
    newLink: "https://www.tnstc.in",
    reason: "Normalized URL to official Tamil Nadu State Transport Corporation portal."
  }
];

async function updateOfficialLinks() {
  console.log("=================================================");
  console.log("THUVAKKAM AI - OFFICIAL SCHEME LINK REPAIR");
  console.log("=================================================\n");

  const allSchemes = await prisma.scheme.findMany({
    orderBy: { createdAt: "asc" }
  });

  console.log(`Auditing and repairing ${allSchemes.length} schemes...\n`);

  let updatedCount = 0;
  const changeLog = [];

  for (const scheme of allSchemes) {
    // Find if there is a specific correction for this scheme
    const match = linkCorrections.find(c => 
      scheme.name.toLowerCase().includes(c.pattern.toLowerCase())
    );

    let targetLink = match ? match.newLink : scheme.officialLink;
    let changeReason = match ? match.reason : "URL normalization (HTTPS / whitespace trim)";

    // Ensure link is properly trimmed and starts with https://
    if (targetLink) {
      targetLink = targetLink.trim();
      if (!targetLink.startsWith("http://") && !targetLink.startsWith("https://")) {
        targetLink = "https://" + targetLink;
      }
    }

    if (targetLink !== scheme.officialLink) {
      await prisma.scheme.update({
        where: { id: scheme.id },
        data: { officialLink: targetLink }
      });

      updatedCount++;
      changeLog.push({
        name: scheme.name,
        department: scheme.department,
        oldLink: scheme.officialLink,
        newLink: targetLink,
        reason: changeReason
      });

      console.log(`[UPDATED] ${scheme.name}`);
      console.log(`  Old: ${scheme.officialLink}`);
      console.log(`  New: ${targetLink}`);
      console.log(`  Reason: ${changeReason}\n`);
    }
  }

  console.log("=================================================");
  console.log(`Total Schemes Checked:    ${allSchemes.length}`);
  console.log(`Total Links Updated:      ${updatedCount}`);
  console.log(`Unchanged / Already OK:   ${allSchemes.length - updatedCount}`);
  console.log("=================================================\n");

  await prisma.$disconnect();
}

updateOfficialLinks().catch(err => {
  console.error("Link update failed:", err);
  process.exit(1);
});

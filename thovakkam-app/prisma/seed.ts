import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const schemesData = [
  // EDUCATION & SCHOLARSHIPS (1-10)
  {
    name: "Moovalur Ramamirtham Ammaiyar Higher Education Assurance Scheme (Pudhumai Penn)",
    description: "Financial assistance of Rs. 1,000 per month to girls who studied from 6th to 12th standard in government schools and are pursuing higher education.",
    category: "education",
    department: "Social Welfare and Women Empowerment Department",
    benefits: "Rs. 1,000 per month deposited directly into the bank account until completion of UG/Diploma/ITI.",
    officialLink: "https://www.pudhumaipenn.tn.gov.in",
    lastDate: "31-10-2026",
    requiredDocuments: JSON.stringify([
      "School Transfer Certificate (TC)",
      "6th to 12th Study Certificate",
      "College Admission Receipt/ID Card",
      "Aadhaar Card",
      "Bank Passbook Page"
    ]),
    eligibilityRules: JSON.stringify({
      gender: "female",
      isStudent: true,
      minAge: 17,
      maxAge: 25,
      isGovernmentSchoolStudent: true,
      educationLevel: "higher_education"
    }),
    applicationProcedure: "Apply online through the Pudhumai Penn portal or via your college coordinator."
  },
  {
    name: "Tamil Nadu Chief Minister's Fellowship Programme (TNCMFP)",
    description: "A prestigious fellowship for young professionals to assist the government in policy implementation, monitoring, and governance in various departments.",
    category: "education",
    department: "Special Programme Implementation Department",
    benefits: "Monthly stipend of Rs. 65,000 + Rs. 10,000 allowance, mentorship, and professional certificate.",
    officialLink: "https://www.tn.gov.in/tncmfp",
    lastDate: "15-06-2026",
    requiredDocuments: JSON.stringify([
      "Post Graduate Degree Certificate (First Class)",
      "Undergraduate Degree Certificate",
      "Curriculum Vitae (CV)",
      "Community Certificate",
      "Aadhaar Card"
    ]),
    eligibilityRules: JSON.stringify({
      minAge: 22,
      maxAge: 30,
      minEducation: "postgraduate"
    }),
    applicationProcedure: "Apply online during the notification period. Followed by a written exam and interview."
  },
  {
    name: "E.V.R. Periyar Memorial State Scholarship",
    description: "Scholarship for BC, MBC and DNC girls pursuing postgraduate education to promote female literacy and higher education.",
    category: "education",
    department: "Backward Classes, Most Backward Classes and Minorities Welfare Department",
    benefits: "Full tuition fee waiver and academic allowance of Rs. 3,000 per year.",
    officialLink: "https://bcmbcmw.tn.gov.in",
    lastDate: "30-11-2026",
    requiredDocuments: JSON.stringify([
      "Income Certificate",
      "Community Certificate",
      "Previous Semester Marksheets",
      "Aadhaar Card",
      "College Bonafide Certificate"
    ]),
    eligibilityRules: JSON.stringify({
      gender: "female",
      isStudent: true,
      maxIncome: 250000,
      categories: ["BC", "MBC", "DNC"],
      educationLevel: "postgraduate"
    }),
    applicationProcedure: "Submit application forms through the respective college scholarship section."
  },
  {
    name: "First Generation Graduate Tuition Fee Concession",
    description: "Tuition fee waiver for students who are the first in their family to pursue a professional degree course.",
    category: "education",
    department: "Higher Education Department",
    benefits: "Complete waiver of tuition fees for professional courses (Engineering, Medical, Agriculture).",
    officialLink: "https://www.tneaonline.org",
    lastDate: "31-08-2026",
    requiredDocuments: JSON.stringify([
      "First Graduate Certificate (from Tahsildar)",
      "Family No-Graduate Declaration",
      "Ration Card",
      "10th and 12th Marksheets",
      "Aadhaar Card"
    ]),
    eligibilityRules: JSON.stringify({
      isStudent: true,
      isFirstGraduate: true,
      educationLevel: "professional_degree"
    }),
    applicationProcedure: "Apply online during TNEA engineering counselling or college admission."
  },
  {
    name: "Post-Matric Scholarship for SC/ST/SCC Students",
    description: "Financial assistance to students belonging to Scheduled Castes, Scheduled Tribes, and Scheduled Castes Converted to Christianity for post-matric studies.",
    category: "education",
    department: "Adi Dravidar and Tribal Welfare Department",
    benefits: "Full reimbursement of compulsory non-refundable fees and monthly maintenance allowance up to Rs. 1,200.",
    officialLink: "https://www.tn.gov.in/hscscholarship",
    lastDate: "31-12-2026",
    requiredDocuments: JSON.stringify([
      "Community Certificate",
      "Income Certificate",
      "Bonafide Certificate from Institute",
      "Previous Year Marksheets",
      "Aadhaar Card"
    ]),
    eligibilityRules: JSON.stringify({
      isStudent: true,
      categories: ["SC", "ST", "SCC"],
      maxIncome: 250000
    }),
    applicationProcedure: "Apply online through the TN Scholarship portal or submit physical form to the college."
  },
  {
    name: "Free Bicycle Scheme for School Students",
    description: "Distribution of free bicycles to government and government-aided school students in 11th standard to reduce dropouts.",
    category: "education",
    department: "School Education Department",
    benefits: "Free branded bicycle suitable for transport to school.",
    officialLink: "https://www.tnschools.gov.in",
    lastDate: "15-09-2026",
    requiredDocuments: JSON.stringify([
      "School Identity Card",
      "Ration Card",
      "Aadhaar Card"
    ]),
    eligibilityRules: JSON.stringify({
      isStudent: true,
      schoolType: "government_or_aided",
      grade: 11
    }),
    applicationProcedure: "Distributed directly through the school headmaster. No manual application required."
  },
  {
    name: "Free Laptop Scheme for Students",
    description: "Distribution of free laptops to students studying in government and government-aided schools and colleges.",
    category: "education",
    department: "Special Programme Implementation Department / School Education",
    benefits: "Free laptop with pre-loaded educational software and operating system.",
    officialLink: "https://www.tnschools.gov.in",
    lastDate: "30-10-2026",
    requiredDocuments: JSON.stringify([
      "School/College Bonafide Certificate",
      "Marksheet of previous year",
      "Aadhaar Card",
      "Ration Card"
    ]),
    eligibilityRules: JSON.stringify({
      isStudent: true,
      schoolType: "government_or_aided",
      grade: 12
    }),
    applicationProcedure: "Distributed directly through schools and colleges. Lists are prepared by institutions."
  },
  {
    name: "Tamil Nadu Chief Minister's Merit Scholarship Scheme",
    description: "A financial incentive scheme for students who pass out of government schools with top scores to continue undergraduate studies.",
    category: "education",
    department: "School Education Department",
    benefits: "Stipend of Rs. 10,000 per academic year for the duration of the undergraduate course.",
    officialLink: "https://www.tnschools.gov.in",
    lastDate: "31-08-2026",
    requiredDocuments: JSON.stringify([
      "12th Marksheet",
      "Aadhaar Card",
      "Bank Account details",
      "Bonafide certificate of UG college"
    ]),
    eligibilityRules: JSON.stringify({
      isStudent: true,
      isGovernmentSchoolStudent: true,
      minScorePercent: 85
    }),
    applicationProcedure: "Students are automatically shortlisted by the department based on Board Exam results."
  },
  {
    name: "Minority Welfare Post-Matric Scholarship",
    description: "Scholarship for students belonging to notified minority communities (Muslim, Christian, Sikh, Buddhist, Parsi, Jain) for post-matric studies.",
    category: "education",
    department: "Backward Classes, Most Backward Classes and Minorities Welfare Department",
    benefits: "Tuition fees and maintenance allowance of up to Rs. 10,000 per year.",
    officialLink: "https://scholarships.gov.in",
    lastDate: "30-11-2026",
    requiredDocuments: JSON.stringify([
      "Self-declaration of Minority status",
      "Previous Year Marksheet (min 50%)",
      "Income Certificate",
      "Fee Receipt of current year",
      "Aadhaar Card"
    ]),
    eligibilityRules: JSON.stringify({
      isStudent: true,
      isMinority: true,
      maxIncome: 200000,
      minScorePercent: 50
    }),
    applicationProcedure: "Apply online on the National Scholarship Portal (NSP)."
  },
  {
    name: "Kamarajar Award for School Students",
    description: "Cash incentive scheme for children from socially backward families to promote academic excellence at secondary school level.",
    category: "education",
    department: "School Education Department",
    benefits: "Rs. 10,000 cash prize and merit certificate.",
    officialLink: "https://www.tnschools.gov.in",
    lastDate: "31-07-2026",
    requiredDocuments: JSON.stringify([
      "10th Marksheet",
      "Bonafide Certificate",
      "Aadhaar Card"
    ]),
    eligibilityRules: JSON.stringify({
      isStudent: true,
      grade: 10,
      isGovernmentSchoolStudent: true
    }),
    applicationProcedure: "The school education department nominates top performing students from each district."
  },

  // MARRIAGE & WOMEN WELFARE (11-20)
  {
    name: "Dr. Muthulakshmi Reddy Ninaivu Inter-Caste Marriage Assistance Scheme",
    description: "Financial assistance to encourage inter-caste marriages and abolish caste discrimination.",
    category: "welfare",
    department: "Social Welfare and Women Empowerment Department",
    benefits: "Cash assistance of Rs. 25,000 (non-graduates) or Rs. 50,000 (graduates) along with an 8-gram gold coin for making Thirumangalyam.",
    officialLink: "https://www.socialwelfare.tn.gov.in",
    lastDate: "31-12-2026",
    requiredDocuments: JSON.stringify([
      "Marriage Registration Certificate",
      "Community Certificates of Bride and Groom",
      "Education Certificates",
      "Joint Bank Passbook Page",
      "Aadhaar Card"
    ]),
    eligibilityRules: JSON.stringify({
      isInterCasteMarriage: true,
      minAge: 18,
      maxIncome: 9999999
    }),
    applicationProcedure: "Apply online or submit physical application to the District Social Welfare Officer within 2 years of marriage."
  },
  {
    name: "Dharmambal Ammaiyar Ninaivu Widow Remarriage Assistance Scheme",
    description: "Financial assistance to rehabilitate widows and promote widow remarriage.",
    category: "welfare",
    department: "Social Welfare and Women Empowerment Department",
    benefits: "Rs. 25,000 (non-graduates) or Rs. 50,000 (graduates) with an 8-gram gold coin for Thirumangalyam.",
    officialLink: "https://www.socialwelfare.tn.gov.in",
    lastDate: "31-12-2026",
    requiredDocuments: JSON.stringify([
      "Death Certificate of First Husband",
      "Remarriage Registration Certificate",
      "Age Proof of Bride and Groom",
      "Education Certificate",
      "Aadhaar Card"
    ]),
    eligibilityRules: JSON.stringify({
      isWidowRemarriage: true,
      minAge: 20,
      maxAge: 40
    }),
    applicationProcedure: "Submit application to the District Social Welfare Office within 6 months of remarriage."
  },
  {
    name: "Dr. Muthulakshmi Reddy Maternity Benefit Scheme",
    description: "Cash assistance to pregnant women to compensate for wage loss and ensure nutritious food.",
    category: "welfare",
    department: "Health and Family Welfare Department",
    benefits: "Rs. 18,000 in five installments (including nutrition kits) directly to the mother's bank account.",
    officialLink: "https://www.picme.tn.gov.in",
    lastDate: "30-09-2026",
    requiredDocuments: JSON.stringify([
      "PICME Registration Number",
      "Aadhaar Card",
      "Ration Card",
      "Bank Account details",
      "Maternity Card"
    ]),
    eligibilityRules: JSON.stringify({
      gender: "female",
      isPregnant: true,
      minAge: 19,
      maxIncome: 9999999
    }),
    applicationProcedure: "Register on the PICME portal at the nearest Primary Health Centre (PHC) before 12 weeks of pregnancy."
  },
  {
    name: "E.V.R. Maniammaiyar Ninaivu Marriage Assistance Scheme for Daughters of Poor Widows",
    description: "Financial assistance to help poor widows conduct the marriage of their daughters.",
    category: "welfare",
    department: "Social Welfare and Women Empowerment Department",
    benefits: "Rs. 25,000 (non-graduates) or Rs. 50,000 (graduates) with an 8-gram gold coin.",
    officialLink: "https://www.socialwelfare.tn.gov.in",
    lastDate: "31-12-2026",
    requiredDocuments: JSON.stringify([
      "Widow Certificate of Mother",
      "Death Certificate of Father",
      "Income Certificate of Mother",
      "Bride's Age Proof",
      "Education Certificate of Bride"
    ]),
    eligibilityRules: JSON.stringify({
      gender: "female",
      isMotherWidow: true,
      maxIncome: 72000,
      minAge: 18
    }),
    applicationProcedure: "Apply 40 days before marriage to the District Social Welfare Officer."
  },
  {
    name: "Anjugam Ammaiyar Ninaivu Inter-Caste Marriage Assistance Scheme (Adi Dravidar focus)",
    description: "Marriage assistance for couples where one of the spouses belongs to Scheduled Caste/Tribes and the other belongs to BC/MBC.",
    category: "welfare",
    department: "Social Welfare and Women Empowerment Department",
    benefits: "Rs. 25,000 (non-graduates) or Rs. 50,000 (graduates) + 8g Gold Coin.",
    officialLink: "https://www.socialwelfare.tn.gov.in",
    lastDate: "31-12-2026",
    requiredDocuments: JSON.stringify([
      "Marriage Certificate",
      "Community Certificates",
      "Ration Card",
      "Aadhaar Card"
    ]),
    eligibilityRules: JSON.stringify({
      isInterCasteMarriage: true,
      hasScOrStSpouse: true,
      minAge: 18
    }),
    applicationProcedure: "Submit application online on the Social Welfare portal within 2 years of marriage."
  },
  {
    name: "Tamil Nadu Government Free Sewing Machine Scheme",
    description: "Distribution of free sewing machines to poor widows, deserted wives, differently-abled women, and socially backward women to support self-employment.",
    category: "welfare",
    department: "Social Welfare and Women Empowerment Department",
    benefits: "Free sewing machine (pedal-type or hand-type depending on ability).",
    officialLink: "https://www.socialwelfare.tn.gov.in",
    lastDate: "30-11-2026",
    requiredDocuments: JSON.stringify([
      "Income Certificate",
      "Tailoring Training Certificate (minimum 6 months)",
      "Widow/Deserted/Differently-abled Certificate (if applicable)",
      "Aadhaar Card",
      "Age proof (20 to 40 years)"
    ]),
    eligibilityRules: JSON.stringify({
      gender: "female",
      minAge: 20,
      maxAge: 40,
      maxIncome: 72000,
      hasTailoringSkill: true
    }),
    applicationProcedure: "Apply through the block development office (BDO) or social welfare office."
  },
  {
    name: "Destitute Widow Pension Scheme",
    description: "Monthly pension for poor destitute widows to ensure their livelihood and social security.",
    category: "welfare",
    department: "Revenue Department",
    benefits: "Monthly pension of Rs. 1,000 + Free Rice (4kg) + Free Sarees/Dhotis twice a year.",
    officialLink: "https://www.tn.gov.in/forms/deptname/24",
    lastDate: null,
    requiredDocuments: JSON.stringify([
      "Widow Certificate",
      "Death Certificate of Husband",
      "Destitute Certificate",
      "Aadhaar Card",
      "Ration Card"
    ]),
    eligibilityRules: JSON.stringify({
      gender: "female",
      isWidow: true,
      isDestitute: true,
      maxIncome: 24000,
      minAge: 18
    }),
    applicationProcedure: "Apply to the Special Tahsildar (Social Security Schemes) at the local Taluk Office."
  },
  {
    name: "Dr. Muthulakshmi Reddy Ninaivu Scheme for Girls in Working Women's Hostels",
    description: "Accommodation subsidy for low-income working women staying in government-run hostels.",
    category: "welfare",
    department: "Social Welfare and Women Empowerment Department",
    benefits: "Subsidized rent and boarding charge concession of Rs. 500 per month.",
    officialLink: "https://www.socialwelfare.tn.gov.in",
    lastDate: null,
    requiredDocuments: JSON.stringify([
      "Salary Certificate",
      "Employment Proof",
      "Aadhaar Card",
      "Hostel Admission Slip"
    ]),
    eligibilityRules: JSON.stringify({
      gender: "female",
      maxIncome: 300000,
      isWorking: true
    }),
    applicationProcedure: "Apply directly to the hostel warden or District Social Welfare Officer."
  },
  {
    name: "Girl Child Protection Scheme (Sivagami Ammaiyar Scheme)",
    description: "Financial incentive for poor families with only one or two girl children and no male child to encourage family planning.",
    category: "welfare",
    department: "Social Welfare and Women Empowerment Department",
    benefits: "Fixed deposit of Rs. 50,000 (for single girl child) or Rs. 25,000 each (for two girl children) which matures when the child turns 18.",
    officialLink: "https://www.socialwelfare.tn.gov.in",
    lastDate: "31-12-2026",
    requiredDocuments: JSON.stringify([
      "Sterilization Certificate of parents",
      "Birth Certificates of girl children",
      "Income Certificate",
      "Family Photo",
      "Aadhaar Card of Parents"
    ]),
    eligibilityRules: JSON.stringify({
      maxIncome: 72000,
      hasOnlyGirlChildren: true,
      maxGirlChildrenCount: 2,
      isSterilizedParent: true
    }),
    applicationProcedure: "Submit application to the Child Development Project Officer (CDPO) before the child completes 3 years."
  },
  {
    name: "Sathya Vani Muthu Ammaiyar Ninaivu Free Sewing Machine Scheme (Weaker sections)",
    description: "Free sewing machines to destitute widows, deserted wives, and poor women of backward classes.",
    category: "welfare",
    department: "Social Welfare and Women Empowerment Department",
    benefits: "Free tailoring unit (sewing machine) to promote self employment.",
    officialLink: "https://www.socialwelfare.tn.gov.in",
    lastDate: "30-09-2026",
    requiredDocuments: JSON.stringify([
      "Income Certificate",
      "Tailoring Certificate",
      "Destitute Certificate",
      "Aadhaar Card"
    ]),
    eligibilityRules: JSON.stringify({
      gender: "female",
      maxIncome: 72000,
      hasTailoringSkill: true
    }),
    applicationProcedure: "Submit physical form to the Block Development Officer (BDO) with supporting proofs."
  },

  // AGRICULTURE & FARMERS (21-30)
  {
    name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi) — TN Farmer Welfare",
    description: "Central sector scheme implemented in Tamil Nadu providing income support to all landholding farmers' families.",
    category: "agriculture",
    department: "Agriculture and Farmers Welfare Department",
    benefits: "Rs. 6,000 per year in three equal installments of Rs. 2,000 directly into bank accounts.",
    officialLink: "https://pmkisan.gov.in",
    lastDate: null,
    requiredDocuments: JSON.stringify([
      "Land Chitta/Adangal Documents",
      "Aadhaar Card",
      "Bank Passbook Page",
      "Ration Card"
    ]),
    eligibilityRules: JSON.stringify({
      isFarmer: true,
      hasAgricultureLand: true
    }),
    applicationProcedure: "Register online via PM-KISAN portal or visit the local Agricultural Extension Centre."
  },
  {
    name: "Chief Minister's Farmer's Security Scheme (Uzhavar Padukappu Thittam)",
    description: "Comprehensive social security scheme for farmers and agricultural laborers in Tamil Nadu.",
    category: "agriculture",
    department: "Revenue Department",
    benefits: "Financial aid for marriage (Rs. 10,000), delivery (Rs. 9,000), children's education (up to Rs. 20,000), pension (Rs. 1,000/month), and accident death relief (Rs. 1,00,000).",
    officialLink: "https://www.tn.gov.in/forms/deptname/24",
    lastDate: null,
    requiredDocuments: JSON.stringify([
      "Uzhavar Padukappu Thittam Identity Card",
      "Land ownership document (for small farmers)",
      "Aadhaar Card",
      "Ration Card",
      "Bank details"
    ]),
    eligibilityRules: JSON.stringify({
      isFarmer: true,
      hasUzhavarCard: true
    }),
    applicationProcedure: "Apply through the local Taluk Office to the Special Tahsildar (UPT)."
  },
  {
    name: "Free Agricultural Power Connection Scheme",
    description: "Providing free electricity connections to agricultural pump sets to reduce irrigation costs for farmers.",
    category: "agriculture",
    department: "TANGEDCO (Tamil Nadu Generation and Distribution Corporation)",
    benefits: "100% free electricity supply for agricultural pump sets.",
    officialLink: "https://www.tangedco.org",
    lastDate: "31-12-2026",
    requiredDocuments: JSON.stringify([
      "Land Chitta/Patta",
      "Adangal Certificate from VAO",
      "Pump-set installation certificate",
      "Aadhaar Card"
    ]),
    eligibilityRules: JSON.stringify({
      isFarmer: true,
      hasAgricultureLand: true,
      hasWellOrBorewell: true
    }),
    applicationProcedure: "Apply online at TANGEDCO portal or register at the local TNEB office."
  },
  {
    name: "Kuruvai Paddy Special Package Scheme",
    description: "Fertilizer subsidies and farm mechanization support specifically for farmers in the Cauvery Delta region during Kuruvai season.",
    category: "agriculture",
    department: "Agriculture and Farmers Welfare Department",
    benefits: "Free fertilizers, seed subsidies, and 50% subsidy for hiring agricultural machinery.",
    officialLink: "https://www.tn.gov.in/agri",
    lastDate: "30-06-2026",
    requiredDocuments: JSON.stringify([
      "VAO Paddy Cultivation Certificate",
      "Land Chitta",
      "Aadhaar Card",
      "Ration Card"
    ]),
    eligibilityRules: JSON.stringify({
      isFarmer: true,
      districts: ["Thanjavur", "Tiruvarur", "Nagapattinam", "Mayiladuthurai", "Cuddalore", "Trichy"],
      isPaddyFarmer: true
    }),
    applicationProcedure: "Apply through the Primary Agricultural Cooperative Credit Society (PACCS) or Agriculture Department."
  },
  {
    name: "Agricultural Mechanization Scheme (Subsidy for Tractors/Implements)",
    description: "Financial subsidy to farmers for purchasing agricultural machinery like tractors, power tillers, rotavators.",
    category: "agriculture",
    department: "Agricultural Engineering Department",
    benefits: "40% to 50% subsidy on purchase price of agricultural implements (up to Rs. 2,00,000 for tractors).",
    officialLink: "https://aed.tn.gov.in",
    lastDate: "31-08-2026",
    requiredDocuments: JSON.stringify([
      "Patta/Chitta copy",
      "Proforma invoice of machine",
      "Small/Marginal Farmer Certificate",
      "Aadhaar Card",
      "Bank Account statement"
    ]),
    eligibilityRules: JSON.stringify({
      isFarmer: true,
      hasAgricultureLand: true
    }),
    applicationProcedure: "Apply online via the Agrisnet portal or at the local AED executive engineer office."
  },
  {
    name: "Micro Irrigation Scheme (Pradhan Mantri Krishi Sinchayee Yojana - PMKSY)",
    description: "Subsidy for drip and sprinkler irrigation systems to conserve water and increase crop yield.",
    category: "agriculture",
    department: "Agriculture and Horticulture Departments",
    benefits: "100% subsidy for small and marginal farmers, and 75% subsidy for other farmers.",
    officialLink: "https://tnhorticulture.tn.gov.in",
    lastDate: "30-11-2026",
    requiredDocuments: JSON.stringify([
      "Patta/Chitta/Adangal",
      "VAO Certificate",
      "Soil/Water test reports",
      "Aadhaar Card",
      "FMB sketch of land"
    ]),
    eligibilityRules: JSON.stringify({
      isFarmer: true,
      hasAgricultureLand: true
    }),
    applicationProcedure: "Apply online at TN Horticulture portal or contact local Assistant Director of Horticulture."
  },
  {
    name: "Chief Minister's Solar Powered Green House Scheme for Farmers",
    description: "Housing scheme with solar energy system for poor farmers in rural areas of Tamil Nadu.",
    category: "agriculture",
    department: "Rural Development and Panchayat Raj Department",
    benefits: "Constructing concrete house of 300 sq.ft at a cost of Rs. 3,00,000 fully subsidized with solar lights.",
    officialLink: "https://tnrd.tn.gov.in",
    lastDate: "31-10-2026",
    requiredDocuments: JSON.stringify([
      "Land Patta in applicant's name",
      "Income Certificate",
      "BPL (Below Poverty Line) ID Card",
      "Aadhaar Card",
      "Bank Account Details"
    ]),
    eligibilityRules: JSON.stringify({
      isFarmer: true,
      maxIncome: 72000,
      isHomeless: true
    }),
    applicationProcedure: "Apply to the local Block Development Officer (BDO) or Gram Panchayat President."
  },
  {
    name: "Subsidized Crop Insurance Scheme (PMFBY) — Tamil Nadu Implementation",
    description: "Financial protection to farmers against crop loss due to natural calamities, pests, or diseases.",
    category: "agriculture",
    department: "Agriculture and Farmers Welfare Department",
    benefits: "Low premium crop insurance with up to 90% premium subsidy. Payouts based on yield loss assessment.",
    officialLink: "https://pmfby.gov.in",
    lastDate: "15-11-2026",
    requiredDocuments: JSON.stringify([
      "Adangal showing crop sown",
      "Land document Patta/Chitta",
      "Bank Passbook copy",
      "Aadhaar Card"
    ]),
    eligibilityRules: JSON.stringify({
      isFarmer: true,
      hasCropCultivated: true
    }),
    applicationProcedure: "Pay the nominal premium at any Commercial Bank, PACCS, or Common Service Centre (CSC)."
  },
  {
    name: "Subsidy for Horticultural Crops",
    description: "Assistance to farmers cultivating fruits, vegetables, flowers, spices, and plantation crops.",
    category: "agriculture",
    department: "Horticulture and Plantation Crops Department",
    benefits: "40% to 50% subsidy on high-yielding seeds, saplings, green-house construction, and post-harvest management.",
    officialLink: "https://tnhorticulture.tn.gov.in",
    lastDate: "31-08-2026",
    requiredDocuments: JSON.stringify([
      "Patta/Chitta",
      "VAO certificate of crop cultivation",
      "Aadhaar Card",
      "Bank passbook details"
    ]),
    eligibilityRules: JSON.stringify({
      isFarmer: true,
      hasAgricultureLand: true
    }),
    applicationProcedure: "Apply online via the Integrated Horticulture Development Scheme (IHDS) portal."
  },
  {
    name: "Fodder Development Scheme (Subsidized Chaff Cutters & Seeds)",
    description: "Supporting dairy farmers by subsidizing high-yield fodder seeds and machinery like chaff cutters to improve livestock nutrition.",
    category: "agriculture",
    department: "Animal Husbandry, Dairying, Fisheries and Fishermen Welfare Department",
    benefits: "Free fodder seed kits and 50% to 75% subsidy on motorized chaff cutters.",
    officialLink: "https://www.tn.gov.in/dept/animal_husbandry",
    lastDate: "30-09-2026",
    requiredDocuments: JSON.stringify([
      "Veterinary Doctor Certificate of owning cows",
      "Ration Card",
      "Aadhaar Card",
      "Bank passbook"
    ]),
    eligibilityRules: JSON.stringify({
      isFarmer: true,
      hasMilchCattle: true
    }),
    applicationProcedure: "Apply to the local Veterinary Assistant Surgeon or block animal husbandry coordinator."
  },

  // ENTREPRENEURSHIP & LIVELIHOOD (31-40)
  {
    name: "UYEGP (Unemployed Youth Employment Generation Programme)",
    description: "Financial subsidy for micro-enterprises initiated by unemployed youth in Tamil Nadu.",
    category: "business",
    department: "Micro, Small and Medium Enterprises (MSME) Department",
    benefits: "Project loan up to Rs. 15 Lakhs for manufacturing / Rs. 5 Lakhs for service business, with a 25% subsidy (up to Rs. 1.25 Lakhs).",
    officialLink: "https://www.msmeonline.tn.gov.in/uyegp",
    lastDate: "31-12-2026",
    requiredDocuments: JSON.stringify([
      "Transfer Certificate (minimum 8th Std pass)",
      "Project Report",
      "Income Certificate",
      "Aadhaar Card",
      "Proof of Business Location (Rent deed/receipt)"
    ]),
    eligibilityRules: JSON.stringify({
      minAge: 18,
      maxAge: 45,
      maxIncome: 500000,
      minEducation: "8th_std",
      isUnemployed: true
    }),
    applicationProcedure: "Apply online through the UYEGP portal and attend the District Industries Centre (DIC) interview."
  },
  {
    name: "NEEDS (New Entrepreneur cum Enterprise Development Scheme)",
    description: "A flagship scheme of Tamil Nadu to promote educated youth as first-generation entrepreneurs.",
    category: "business",
    department: "Micro, Small and Medium Enterprises (MSME) Department",
    benefits: "Project loan from Rs. 10 Lakhs up to Rs. 5 Crores, with a 25% subsidy (up to Rs. 75 Lakhs) and a 3% interest subvention.",
    officialLink: "https://www.msmeonline.tn.gov.in/needs",
    lastDate: "31-12-2026",
    requiredDocuments: JSON.stringify([
      "Degree/Diploma Certificate",
      "Detailed Project Report (DPR)",
      "Partnership deed/Incorporation docs",
      "Aadhaar Card",
      "Community Certificate"
    ]),
    eligibilityRules: JSON.stringify({
      minAge: 21,
      maxAge: 45,
      minEducation: "degree_or_diploma",
      isFirstGenerationEntrepreneur: true
    }),
    applicationProcedure: "Apply online on the NEEDS portal, followed by presentation to the selection committee."
  },
  {
    name: "PMEGP (Prime Minister's Employment Generation Programme) — TN implementation",
    description: "Credit-linked subsidy scheme for setting up new micro-enterprises in manufacturing or service sectors.",
    category: "business",
    department: "Khadi and Village Industries Commission (KVIC) / DIC Tamil Nadu",
    benefits: "Loans up to Rs. 50 Lakhs (manufacturing) or Rs. 20 Lakhs (service) with 25% (urban) or 35% (rural) subsidy.",
    officialLink: "https://www.kviconline.gov.in/pmegpeportal",
    lastDate: null,
    requiredDocuments: JSON.stringify([
      "Project Report",
      "Education/EDP Training Certificate",
      "Population Certificate (for rural areas)",
      "Aadhaar Card",
      "Pan Card"
    ]),
    eligibilityRules: JSON.stringify({
      minAge: 18,
      minEducation: "8th_std_for_high_value"
    }),
    applicationProcedure: "Apply online via the PMEGP e-portal and select DIC or KVIB as the nodal agency."
  },
  {
    name: "TAHDCO Entrepreneur Development Scheme (EDS)",
    description: "Financial assistance for SC/ST individuals wanting to set up manufacturing, service, or retail businesses.",
    category: "business",
    department: "Tamil Nadu Adi Dravidar Housing and Development Corporation (TAHDCO)",
    benefits: "30% project subsidy or Rs. 2.25 Lakhs (whichever is lower) for bank-linked business loans.",
    officialLink: "https://tahdco.tn.gov.in",
    lastDate: "30-11-2026",
    requiredDocuments: JSON.stringify([
      "Community Certificate (SC/ST)",
      "Income Certificate",
      "Project Quotation / Business plan",
      "Educational certificates",
      "Aadhaar Card"
    ]),
    eligibilityRules: JSON.stringify({
      categories: ["SC", "ST"],
      minAge: 18,
      maxAge: 65,
      maxIncome: 300000
    }),
    applicationProcedure: "Register and apply on the TAHDCO application portal."
  },
  {
    name: "TAHDCO Land Purchase and Development Scheme",
    description: "Financial assistance for SC/ST women to purchase agricultural land and develop it.",
    category: "business",
    department: "Tamil Nadu Adi Dravidar Housing and Development Corporation (TAHDCO)",
    benefits: "50% subsidy of the land value (up to Rs. 5,00,000) for purchasing and developing agricultural land.",
    officialLink: "https://tahdco.tn.gov.in",
    lastDate: "30-11-2026",
    requiredDocuments: JSON.stringify([
      "SC/ST Community Certificate",
      "Land purchase agreement/quotation",
      "Income Certificate",
      "Seller's Land Patta/Chitta copy",
      "Aadhaar Card"
    ]),
    eligibilityRules: JSON.stringify({
      categories: ["SC", "ST"],
      gender: "female",
      minAge: 18,
      maxAge: 65,
      maxIncome: 300000
    }),
    applicationProcedure: "Apply online on the TAHDCO web application portal with the land details."
  },
  {
    name: "TAHDCO Self Employment Scheme for Youth (SEW)",
    description: "Loan and subsidy assistance for SC/ST youth to set up small clinics, pharmacies, transport agencies, or shops.",
    category: "business",
    department: "Tamil Nadu Adi Dravidar Housing and Development Corporation (TAHDCO)",
    benefits: "30% subsidy on project cost up to Rs. 2.25 Lakhs for business setup.",
    officialLink: "https://tahdco.tn.gov.in",
    lastDate: "30-11-2026",
    requiredDocuments: JSON.stringify([
      "SC/ST Community Certificate",
      "Aadhaar Card",
      "Project Report",
      "Business License / Professional degree (if clinic)"
    ]),
    eligibilityRules: JSON.stringify({
      categories: ["SC", "ST"],
      minAge: 18,
      maxAge: 45,
      maxIncome: 300000
    }),
    applicationProcedure: "Apply through the TAHDCO district manager online portal."
  },
  {
    name: "Tamil Nadu Backward Classes Welfare Free Iron Box Scheme",
    description: "Distribution of free brass iron boxes to traditional washermen belonging to BC, MBC, and DNC communities.",
    category: "welfare",
    department: "Backward Classes, Most Backward Classes and Minorities Welfare Department",
    benefits: "One heavy brass charcoal iron box (or electric if specified) to support livelihood.",
    officialLink: "https://bcmbcmw.tn.gov.in",
    lastDate: "30-09-2026",
    requiredDocuments: JSON.stringify([
      "Traditional Occupation Certificate (Livelihood: Washerman)",
      "Community Certificate",
      "Income Certificate",
      "Ration Card",
      "Aadhaar Card"
    ]),
    eligibilityRules: JSON.stringify({
      categories: ["BC", "MBC", "DNC"],
      occupation: "washerman",
      maxIncome: 72000
    }),
    applicationProcedure: "Apply to the District Backward Classes and Minorities Welfare Officer (DBCWO)."
  },
  {
    name: "Tamil Nadu Rural Livelihood Mission Self Help Group (SHG) Loans",
    description: "Interest-subsidized credit/loans for women's Self Help Groups to take up collective livelihood activities.",
    category: "business",
    department: "Tamil Nadu Corporation for Development of Women",
    benefits: "Direct bank credit linkages from Rs. 1 Lakh up to Rs. 10 Lakhs at subsidized interest rates (4-7%).",
    officialLink: "https://www.tamilnadu-shg.org",
    lastDate: null,
    requiredDocuments: JSON.stringify([
      "SHG registration certificate",
      "SHG Resolution copy",
      "Aadhaar Cards of members",
      "SHG Bank book copy"
    ]),
    eligibilityRules: JSON.stringify({
      gender: "female",
      isMemberOfShg: true,
      minAge: 18
    }),
    applicationProcedure: "Apply through the local Block Mission Management Unit (BMMU) or local bank branch."
  },
  {
    name: "Co-operative Milk Producers Dairy Development Scheme (Aavin Link)",
    description: "Financial assistance and animal husbandry support to milk producers who supply to Aavin co-operatives.",
    category: "agriculture",
    department: "Animal Husbandry, Dairying, Fisheries and Fishermen Welfare Department",
    benefits: "Subsidized loans for buying milch cows, free veterinary care, and guaranteed purchase price from Aavin.",
    officialLink: "https://aavinmilk.com",
    lastDate: null,
    requiredDocuments: JSON.stringify([
      "Aavin Milk Society Membership Card",
      "Aadhaar Card",
      "Bank Account passbook",
      "Ration Card"
    ]),
    eligibilityRules: JSON.stringify({
      isFarmer: true,
      hasMilchCattle: true,
      isAavinMember: true
    }),
    applicationProcedure: "Register with the local Primary Milk Cooperative Society (APMCS)."
  },
  {
    name: "Financial Assistance to Handloom Weavers (Mudra Scheme Link)",
    description: "Credit facilities and subsidy for handloom weavers to buy raw material (yarn, dyes) and modernized looms.",
    category: "business",
    department: "Handlooms, Handicrafts, Textiles and Khadi Department",
    benefits: "Concessional loans up to Rs. 2 Lakhs, 20% margin money subsidy, and 6% interest subvention for 3 years.",
    officialLink: "https://www.tn.gov.in/dept/handlooms",
    lastDate: "31-08-2026",
    requiredDocuments: JSON.stringify([
      "Weavers Identity Card",
      "Aadhaar Card",
      "Bank details",
      "Loom ownership declaration"
    ]),
    eligibilityRules: JSON.stringify({
      occupation: "weaver",
      minAge: 18
    }),
    applicationProcedure: "Apply to the Circle Assistant Director of Handlooms and Textiles."
  },

  // SOCIAL SECURITY PENSION SCHEMES (41-46)
  {
    name: "Indira Gandhi National Old Age Pension Scheme (IGNOAPS) — TN variant",
    description: "Central-state combined pension scheme for elderly people living below the poverty line.",
    category: "welfare",
    department: "Revenue Department",
    benefits: "Monthly pension of Rs. 1,000 + 4kg free rice + Free clothing (Saree/Dhoti) twice a year.",
    officialLink: "https://www.tn.gov.in/forms/deptname/24",
    lastDate: null,
    requiredDocuments: JSON.stringify([
      "Age proof certificate (Medical officer/School/Voter ID)",
      "BPL (Below Poverty Line) certificate",
      "Aadhaar Card",
      "Ration Card",
      "Destitute Certificate"
    ]),
    eligibilityRules: JSON.stringify({
      minAge: 60,
      isDestitute: true,
      maxIncome: 24000
    }),
    applicationProcedure: "Submit application to the local Village Administrative Officer (VAO) or apply online."
  },
  {
    name: "Differently Abled Pension Scheme",
    description: "Monthly financial support to differently-abled persons to assure basic livelihood.",
    category: "welfare",
    department: "Revenue Department / Differently Abled Welfare Department",
    benefits: "Monthly pension of Rs. 1,500 deposited directly into the bank account.",
    officialLink: "https://www.tn.gov.in/forms/deptname/24",
    lastDate: null,
    requiredDocuments: JSON.stringify([
      "National Disability Identity Card (UDID)",
      "Disability Certificate showing 40% or more disability",
      "Aadhaar Card",
      "Ration Card",
      "Bank Passbook Page"
    ]),
    eligibilityRules: JSON.stringify({
      disabilityStatus: true,
      minAge: 18,
      minDisabilityPercentage: 40
    }),
    applicationProcedure: "Apply to the Special Tahsildar (Social Security Scheme) at the Taluk Office or via Common Service Centres."
  },
  {
    name: "Destitute Agricultural Labourers Pension Scheme",
    description: "Monthly pension for old/destitute agricultural laborers who do not have other means of income.",
    category: "welfare",
    department: "Revenue Department",
    benefits: "Rs. 1,000 per month pension + 4kg free rice + Sarees/Dhotis.",
    officialLink: "https://www.tn.gov.in/forms/deptname/24",
    lastDate: null,
    requiredDocuments: JSON.stringify([
      "Agricultural Labourer Identity Proof (from Tahsildar)",
      "Age Proof",
      "Ration Card",
      "Aadhaar Card"
    ]),
    eligibilityRules: JSON.stringify({
      minAge: 60,
      occupation: "agricultural_labourer",
      isDestitute: true,
      maxIncome: 24000
    }),
    applicationProcedure: "Apply directly to the local Revenue Inspector or Taluk Tahsildar."
  },
  {
    name: "Destitute/Deserted Wives Pension Scheme",
    description: "Monthly pension for poor deserted wives who have been legally or factually separated from their husbands.",
    category: "welfare",
    department: "Revenue Department",
    benefits: "Monthly pension of Rs. 1,000 + free ration benefits.",
    officialLink: "https://www.tn.gov.in/forms/deptname/24",
    lastDate: null,
    requiredDocuments: JSON.stringify([
      "Deserted Wife Certificate (from Tahsildar/Court)",
      "Age Proof (minimum 30 years)",
      "Aadhaar Card",
      "Ration Card",
      "Destitute Certificate"
    ]),
    eligibilityRules: JSON.stringify({
      gender: "female",
      isDeserted: true,
      isDestitute: true,
      minAge: 30,
      maxIncome: 24000
    }),
    applicationProcedure: "Apply to the local Social Security Scheme Tahsildar at the Taluk Office."
  },
  {
    name: "Pension to Unmarried Poor Women (Above 50)",
    description: "Pension for poor, destitute, unmarried women who have crossed 50 years of age.",
    category: "welfare",
    department: "Revenue Department",
    benefits: "Monthly pension of Rs. 1,000.",
    officialLink: "https://www.tn.gov.in/forms/deptname/24",
    lastDate: null,
    requiredDocuments: JSON.stringify([
      "Age Proof (minimum 50 years)",
      "Unmarried Status Certificate from VAO/RI",
      "Aadhaar Card",
      "Ration Card",
      "Bank Account details"
    ]),
    eligibilityRules: JSON.stringify({
      gender: "female",
      isUnmarried: true,
      isDestitute: true,
      minAge: 50,
      maxIncome: 24000
    }),
    applicationProcedure: "Apply to the Special Tahsildar (SSS) at the Taluk Office."
  },
  {
    name: "National Family Benefit Scheme (NFBS) — TN variant",
    description: "One-time financial assistance to BPL families on the natural or accidental death of the primary breadwinner.",
    category: "welfare",
    department: "Revenue Department",
    benefits: "One-time lump sum grant of Rs. 20,000.",
    officialLink: "https://www.tn.gov.in/forms/deptname/24",
    lastDate: "31-12-2026",
    requiredDocuments: JSON.stringify([
      "Death Certificate of Breadwinner",
      "Legal Heir Certificate",
      "BPL Card/Status proof",
      "Income Certificate",
      "Aadhaar Card of Applicant"
    ]),
    eligibilityRules: JSON.stringify({
      isPrimaryBreadwinnerDeceased: true,
      maxIncome: 72000,
      minAgeOfDeceased: 18,
      maxAgeOfDeceased: 60
    }),
    applicationProcedure: "Submit application to the Tahsildar within 6 months of the breadwinner's death."
  },

  // HOUSING & HEALTH (47-50)
  {
    name: "Tamil Nadu Chief Minister's Comprehensive Health Insurance Scheme (TNCCHIS)",
    description: "Cashless health insurance scheme for low-income families in Tamil Nadu.",
    category: "health",
    department: "Health and Family Welfare Department",
    benefits: "Cashless medical treatment up to Rs. 5,00,000 per family per year in empanelled government and private hospitals.",
    officialLink: "https://www.cmchistn.com",
    lastDate: null,
    requiredDocuments: JSON.stringify([
      "Income Certificate (under Rs. 1,20,000)",
      "Smart Ration Card",
      "Aadhaar Card of all family members",
      "Identity Proof"
    ]),
    eligibilityRules: JSON.stringify({
      maxIncome: 120000
    }),
    applicationProcedure: "Visit the District Collectorate Insurance Cell to get the health card printed."
  },
  {
    name: "Kalaignar Kanavu Illam (CM Housing Scheme)",
    description: "Government assistance to construct concrete houses for people living in huts/thatched houses in rural areas.",
    category: "welfare",
    department: "Rural Development and Panchayat Raj Department",
    benefits: "Financial grant of Rs. 3,50,000 for building a brick-and-mortar house in place of a hut.",
    officialLink: "https://tnrd.tn.gov.in",
    lastDate: "30-11-2026",
    requiredDocuments: JSON.stringify([
      "Patta of the current plot",
      "VAO verification that applicant lives in a hut",
      "Ration Card",
      "Aadhaar Card",
      "BPL list reference"
    ]),
    eligibilityRules: JSON.stringify({
      isHomeless: true,
      isRuralResident: true,
      maxIncome: 72000
    }),
    applicationProcedure: "Panchayat secretaries survey and select beneficiaries. Application can also be submitted at the Panchayat office."
  },
  {
    name: "Tamil Nadu Urban Habitat Development Board (TNUHDB) Housing Scheme",
    description: "Allotment of tenement houses in multi-story apartments to urban slum dwellers and low-income families.",
    category: "welfare",
    department: "Tamil Nadu Urban Habitat Development Board",
    benefits: "Permanent concrete apartment housing at a highly subsidized contribution fee (approx. 10% of cost).",
    officialLink: "https://www.tnuhdb.tn.gov.in",
    lastDate: "31-12-2026",
    requiredDocuments: JSON.stringify([
      "Urban Slum residency proof / survey card",
      "Voter ID showing slum address",
      "Income Certificate",
      "Aadhaar Card",
      "Ration Card"
    ]),
    eligibilityRules: JSON.stringify({
      isUrbanResident: true,
      isSlumDweller: true,
      maxIncome: 300000
    }),
    applicationProcedure: "Submit application during specific tenement allotment announcements at the Board offices."
  },
  {
    name: "Innuyir Kaappoom-Nammai Kaakkum 48 Scheme",
    description: "Emergency medical assistance scheme for road accident victims, covering the first 48 hours of treatment.",
    category: "health",
    department: "Health and Family Welfare Department",
    benefits: "Free emergency treatment up to Rs. 1,00,000 per person for the first 48 hours in designated hospitals (applicable to anyone, even tourists).",
    officialLink: "https://www.cmchistn.com",
    lastDate: null,
    requiredDocuments: JSON.stringify([
      "Accident report / Emergency entry ID (hospital generates this automatically)"
    ]),
    eligibilityRules: JSON.stringify({
      isAccidentVictim: true,
      minAge: 0
    }),
    applicationProcedure: "Activated automatically by any empanelled hospital upon admission of a road accident victim. No prior application needed."
  }
];

async function main() {
  console.log("Starting database seed...");

  // Clean old schemes
  console.log("Cleaning existing Scheme records...");
  await prisma.scheme.deleteMany({});
  
  // Seed new schemes
  console.log(`Seeding ${schemesData.length} schemes...`);
  for (const s of schemesData) {
    await prisma.scheme.create({
      data: s,
    });
  }

  // Seed default admin accounts
  console.log("Cleaning and seeding default Admin accounts...");
  await prisma.admin.deleteMany({});
  
  // Password hashing omitted/simplified for seed, using 'admin123' as plain string or simple bcrypt if we add it. 
  // Let's seed with plain password or easily identifiable string. Since we will write a backend,
  // we can use standard Node bcrypt or simple hash later.
  await prisma.admin.createMany({
    data: [
      {
        username: "superadmin",
        password: "superadminpassword", // In production this will be hashed
        name: "State Super Admin",
        role: "super_admin",
      },
      {
        username: "chennaiofficer",
        password: "officerpassword",
        name: "Chennai District Officer",
        role: "district_officer",
        district: "Chennai",
      },
      {
        username: "maduraiofficer",
        password: "officerpassword",
        name: "Madurai District Officer",
        role: "district_officer",
        district: "Madurai",
      },
      {
        username: "reviewer1",
        password: "reviewerpassword",
        name: "State Scheme Reviewer",
        role: "reviewer",
      }
    ]
  });

  // Seed a sample user & application for validation
  console.log("Cleaning and seeding sample User & Application records...");
  await prisma.user.deleteMany({});
  await prisma.application.deleteMany({});

  const sampleUser = await prisma.user.create({
    data: {
      phone: "9876543210",
      name: "Anjali Devi",
      age: 19,
      district: "Chennai",
      education: "HSC",
      occupation: "Student",
      annualIncome: 45000,
      isStudent: true,
      gender: "female",
      isSeniorCitizen: false,
      disabilityStatus: false,
    }
  });

  const pudhumaiPennScheme = await prisma.scheme.findFirst({
    where: { name: { contains: "Pudhumai Penn" } }
  });

  if (pudhumaiPennScheme) {
    await prisma.application.create({
      data: {
        userId: sampleUser.id,
        schemeId: pudhumaiPennScheme.id,
        status: "pending",
        documents: JSON.stringify([
          "/uploads/student_id.jpg",
          "/uploads/school_tc.jpg"
        ])
      }
    });
  }

  console.log("Database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

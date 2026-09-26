const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const newTamilNaduSchemes = [
  // ==========================================
  // HIGHER EDUCATION & SCHOOL EDUCATION
  // ==========================================
  {
    name: "Tamil Pudhalvan Scheme (தமிழ்ப் புதல்வன் திட்டம்)",
    description: "Monthly financial incentive of Rs. 1,000 to male students from government schools pursuing higher education (UG degree, diploma, ITI) to boost male higher education enrollment.",
    category: "education",
    department: "Higher Education Department",
    benefits: "Rs. 1,000 per month deposited directly into student's bank account until completion of course.",
    officialLink: "https://www.tamilpudhalvan.tn.gov.in",
    lastDate: "31-10-2026",
    requiredDocuments: JSON.stringify([
      "School Transfer Certificate (TC)",
      "6th to 12th Government School Study Certificate",
      "College Admission Receipt / Bonafide",
      "Aadhaar Card",
      "Bank Passbook Page"
    ]),
    eligibilityRules: JSON.stringify({
      gender: "male",
      isStudent: true,
      minAge: 17,
      maxAge: 25,
      isGovernmentSchoolStudent: true,
      educationLevel: "higher_education"
    }),
    applicationProcedure: "Apply through the college nodal officer on the official Tamil Pudhalvan portal (tamilpudhalvan.tn.gov.in)."
  },
  {
    name: "Perarignar Anna Memorial Award for College Students",
    description: "State merit awards for BC, MBC and DNC students securing high marks in 12th standard and pursuing degree courses or polytechnic diplomas.",
    category: "education",
    department: "Backward Classes, Most Backward Classes and Minorities Welfare Department",
    benefits: "Annual cash incentive of Rs. 5,000 for degree courses and Rs. 3,000 for polytechnic diploma courses throughout the duration of study.",
    officialLink: "https://bcmbcmw.tn.gov.in",
    lastDate: "30-11-2026",
    requiredDocuments: JSON.stringify([
      "12th Standard Marksheet",
      "Community Certificate (BC/MBC/DNC)",
      "Income Certificate",
      "College Bonafide Certificate",
      "Aadhaar Card",
      "Bank Account Details"
    ]),
    eligibilityRules: JSON.stringify({
      isStudent: true,
      categories: ["BC", "MBC", "DNC"],
      maxIncome: 250000
    }),
    applicationProcedure: "Submit application form through the Head of the Educational Institution to the District Backward Classes and Minorities Welfare Officer."
  },
  {
    name: "Thanthai Periyar Memorial Award for School Toppers",
    description: "Merit cash awards to one boy and one girl student from BC, MBC and DNC communities in each district who secure the highest marks in 10th standard public examination.",
    category: "education",
    department: "Backward Classes, Most Backward Classes and Minorities Welfare Department",
    benefits: "One-time cash award of Rs. 10,000 and Certificate of Merit.",
    officialLink: "https://bcmbcmw.tn.gov.in",
    lastDate: "31-08-2026",
    requiredDocuments: JSON.stringify([
      "10th Standard Public Exam Marksheet",
      "Community Certificate",
      "School Headmaster Recommendation Certificate",
      "Aadhaar Card",
      "Bank Passbook"
    ]),
    eligibilityRules: JSON.stringify({
      isStudent: true,
      categories: ["BC", "MBC", "DNC"]
    }),
    applicationProcedure: "Selected directly by the Department of School Education and District BC/MBC Welfare Officer based on board exam results."
  },
  {
    name: "Kalloori Kanavu - Naan Mudhalvan Higher Education Mentorship",
    description: "Comprehensive state career guidance, counselling, and entrance preparation program for school students transitioning into higher education and technical institutions.",
    category: "education",
    department: "Special Programme Implementation / Higher Education Department",
    benefits: "Free career mapping, entrance test training, college admission counselling, and mentorship across all 38 districts.",
    officialLink: "https://naanmudhalvan.tn.gov.in",
    lastDate: "30-07-2026",
    requiredDocuments: JSON.stringify([
      "10th and 12th Marksheets",
      "School ID Card / TC",
      "Aadhaar Card"
    ]),
    eligibilityRules: JSON.stringify({
      isStudent: true,
      minAge: 16,
      maxAge: 22
    }),
    applicationProcedure: "Register online through the Naan Mudhalvan portal or attend district-level Kalloori Kanavu mega events."
  },
  {
    name: "Tamil Nadu Overseas Scholarship for SC/ST Students",
    description: "Financial assistance for meritorious Scheduled Caste and Scheduled Tribe students from Tamil Nadu to pursue postgraduate and doctoral studies in reputed universities abroad.",
    category: "education",
    department: "Adi Dravidar and Tribal Welfare Department",
    benefits: "Scholarship up to Rs. 36 Lakhs covering tuition fees, living allowances, visa charges, and economy return airfare.",
    officialLink: "https://adw.tn.gov.in",
    lastDate: "31-05-2026",
    requiredDocuments: JSON.stringify([
      "Degree Certificate with First Class",
      "Foreign University Offer Letter (Top 500 QS Ranking)",
      "Community Certificate (SC/ST)",
      "Income Certificate",
      "Valid Indian Passport and Visa Copy",
      "Aadhaar Card"
    ]),
    eligibilityRules: JSON.stringify({
      isStudent: true,
      categories: ["SC", "ST"],
      maxIncome: 800000,
      minAge: 20,
      maxAge: 35
    }),
    applicationProcedure: "Apply online via the Adi Dravidar and Tribal Welfare Department web portal during the annual notification window."
  },
  {
    name: "Free Government Hostel Scheme for SC and ST Students",
    description: "Free boarding and lodging in welfare hostels across Tamil Nadu with free food, uniforms, textbooks, and special evening tuition support for SC/ST students.",
    category: "education",
    department: "Adi Dravidar and Tribal Welfare Department",
    benefits: "100% free accommodation, nutritious food, three pairs of uniforms, free textbooks, and career guidance.",
    officialLink: "https://adw.tn.gov.in",
    lastDate: "15-07-2026",
    requiredDocuments: JSON.stringify([
      "Community Certificate (SC/ST)",
      "Income Certificate",
      "Study / Bonafide Certificate from School or College",
      "Aadhaar Card",
      "Passport Size Photographs"
    ]),
    eligibilityRules: JSON.stringify({
      isStudent: true,
      categories: ["SC", "ST", "SCC"],
      maxIncome: 250000
    }),
    applicationProcedure: "Submit application to the Hostel Warden or District Adi Dravidar and Tribal Welfare Officer at the beginning of the academic year."
  },
  {
    name: "Free Government Hostel Scheme for BC, MBC and Minorities Students",
    description: "Free residential accommodation, nutritious food, study materials, and uniforms in designated welfare hostels for BC, MBC, DNC, and Minority students.",
    category: "education",
    department: "Backward Classes, Most Backward Classes and Minorities Welfare Department",
    benefits: "Free hostel stay, balanced diet, 3 sets of uniforms, and access to library and computer facilities.",
    officialLink: "https://bcmbcmw.tn.gov.in",
    lastDate: "15-07-2026",
    requiredDocuments: JSON.stringify([
      "Community Certificate (BC/MBC/DNC/Minority)",
      "Income Certificate",
      "Bonafide Certificate from School/College",
      "Aadhaar Card",
      "Ration Card"
    ]),
    eligibilityRules: JSON.stringify({
      isStudent: true,
      categories: ["BC", "MBC", "DNC", "Minority"],
      maxIncome: 200000
    }),
    applicationProcedure: "Apply to the respective Hostel Warden or District Backward Classes Welfare Office."
  },
  {
    name: "Scholarship for Children of Differently Abled Persons",
    description: "Educational assistance scheme for children of differently abled parents to motivate them to pursue uninterrupted school and college education.",
    category: "education",
    department: "Welfare of Differently Abled Persons Department",
    benefits: "Annual scholarship ranging from Rs. 1,000 (1st to 5th std) up to Rs. 6,000 (Professional/PG degree) per academic year.",
    officialLink: "https://scw.tn.gov.in",
    lastDate: "30-11-2026",
    requiredDocuments: JSON.stringify([
      "Parent's Unique Disability ID (UDID) Card / Disability Certificate",
      "Student's School/College Bonafide Certificate",
      "Previous Year Marksheet",
      "Income Certificate",
      "Aadhaar Card",
      "Bank Passbook Page"
    ]),
    eligibilityRules: JSON.stringify({
      isStudent: true,
      maxIncome: 200000
    }),
    applicationProcedure: "Submit prescribed form to the District Differently Abled Welfare Officer (DDAWO) through the educational institution."
  },
  {
    name: "Reader Allowance and Scribe Assistance for Differently Abled Students",
    description: "Financial assistance providing reader allowance for visually impaired students and scribe support for orthopedically and visually challenged students during examinations.",
    category: "education",
    department: "Welfare of Differently Abled Persons Department",
    benefits: "Reader allowance of Rs. 3,000 per year for UG and Rs. 5,000 per year for PG/Professional students plus scribe reimbursement.",
    officialLink: "https://scw.tn.gov.in",
    lastDate: "31-10-2026",
    requiredDocuments: JSON.stringify([
      "Disability ID Card (UDID) with 40%+ visual or physical disability",
      "College Bonafide Certificate",
      "Reader / Scribe Declaration Certificate",
      "Aadhaar Card",
      "Bank Account Passbook"
    ]),
    eligibilityRules: JSON.stringify({
      disabilityStatus: true,
      isStudent: true
    }),
    applicationProcedure: "Apply through the Principal/Dean of the college to the District Differently Abled Welfare Officer."
  },
  {
    name: "7.5% Preferential Quota and Full Fee Waiver for Government School Students",
    description: "100% tuition, hostel, and counselling fee waiver for students from government schools who secure admission in professional degree courses under the 7.5% horizontal quota.",
    category: "education",
    department: "Higher Education Department",
    benefits: "Complete waiver of tuition fee, hostel fee, and development fees in Engineering, Medicine, Agriculture, Veterinary, and Law colleges.",
    officialLink: "https://www.tneaonline.org",
    lastDate: "31-08-2026",
    requiredDocuments: JSON.stringify([
      "6th to 12th Government School Study Certificate (signed by HM & BEO/DEO)",
      "Allotment Order under 7.5% Quota",
      "10th and 12th Marksheets",
      "Community Certificate",
      "Aadhaar Card"
    ]),
    eligibilityRules: JSON.stringify({
      isStudent: true,
      isGovernmentSchoolStudent: true,
      educationLevel: "professional_degree"
    }),
    applicationProcedure: "Automatic fee reimbursement upon seat allotment under 7.5% quota in single window counselling (TNEA / DME / TNAU / TANUVAS / TNDALU)."
  },
  {
    name: "Chief Minister's Breakfast Scheme (Kalaignarin Kaalai Unavu Thittam)",
    description: "Free hot and nutritious breakfast on all school working days to primary school children (Classes 1 to 5) across all government schools in Tamil Nadu.",
    category: "education",
    department: "Social Welfare and Women Empowerment / School Education Department",
    benefits: "Nutritious freshly cooked morning meal (Pongal, Kichadi, Upma, Sambar) every school day, improving nutrition and attendance.",
    officialLink: "https://tnschools.gov.in",
    lastDate: null,
    requiredDocuments: JSON.stringify([
      "School Enrollment / EMIS ID"
    ]),
    eligibilityRules: JSON.stringify({
      isStudent: true,
      minAge: 5,
      maxAge: 11
    }),
    applicationProcedure: "Implemented automatically for all enrolled students in Class 1 to 5 in government primary schools."
  },
  {
    name: "Free Civil Services Coaching Scheme (AICSCC Chennai)",
    description: "Free intensive residential coaching, library, and monthly stipend for UPSC / TNPSC aspirants from SC, ST, BC, MBC, and Minority communities.",
    category: "education",
    department: "All India Civil Services Coaching Centre / ADW Department",
    benefits: "Free boarding, lodging, faculty coaching, test series, and monthly stipend of Rs. 3,000 for preliminary stage preparation.",
    officialLink: "https://civilservicecoaching.tn.gov.in",
    lastDate: "30-09-2026",
    requiredDocuments: JSON.stringify([
      "Graduation Degree Certificate",
      "Community Certificate",
      "Income Certificate",
      "Aadhaar Card",
      "Passport Size Photograph"
    ]),
    eligibilityRules: JSON.stringify({
      isStudent: true,
      minAge: 21,
      maxAge: 35
    }),
    applicationProcedure: "Register online and clear the entrance test conducted by the All India Civil Services Coaching Centre (AICSCC)."
  },

  // ==========================================
  // WOMEN & SOCIAL WELFARE
  // ==========================================
  {
    name: "Kalaignar Magalir Urimai Thittam (KMUT)",
    description: "Basic income rights scheme providing monthly financial assistance of Rs. 1,000 to eligible women heads of families across Tamil Nadu.",
    category: "welfare",
    department: "Special Programme Implementation / Revenue Department",
    benefits: "Rs. 1,000 per month deposited directly into the bank account on the 15th of every month.",
    officialLink: "https://kmut.tn.gov.in",
    lastDate: "31-12-2026",
    requiredDocuments: JSON.stringify([
      "Aadhaar Card",
      "Smart Ration Card (Family Card)",
      "Bank Passbook Page",
      "Electricity Consumer Number / Bill"
    ]),
    eligibilityRules: JSON.stringify({
      gender: "female",
      minAge: 21,
      maxIncome: 250000
    }),
    applicationProcedure: "Apply at designated special camp in your ration shop area or via e-Sevai centre."
  },
  {
    name: "Vidiyal Payanam - Free Bus Travel Scheme for Women",
    description: "Free travel facility in all state transport corporation ordinary town and city buses for women, transgender persons, and differently-abled individuals.",
    category: "welfare",
    department: "Transport Department",
    benefits: "100% fare exemption on all TNSTC and MTC ordinary fare (white board) city and town buses across the state.",
    officialLink: "https://www.tnstc.in",
    lastDate: null,
    requiredDocuments: JSON.stringify([
      "Government Photo ID (Aadhaar / Voter ID) for verification if requested"
    ]),
    eligibilityRules: JSON.stringify({
      gender: "female"
    }),
    applicationProcedure: "Direct boarding on any government ordinary town bus. Zero rupee ticket will be issued by the bus conductor."
  },
  {
    name: "Moovalur Ramamirtham Ammaiyar Marriage Assistance Scheme (General Financial Aid)",
    description: "Marriage assistance scheme providing financial support and sovereign gold coin for daughters of poor families.",
    category: "welfare",
    department: "Social Welfare and Women Empowerment Department",
    benefits: "Financial grant of Rs. 25,000 (10th pass) or Rs. 50,000 (Degree/Diploma) along with 8 grams (1 Sovereign) 22-carat gold coin for Thirumangalyam.",
    officialLink: "https://www.socialwelfare.tn.gov.in",
    lastDate: "31-12-2026",
    requiredDocuments: JSON.stringify([
      "Bride's Educational Certificate (10th / 12th / Degree)",
      "Income Certificate (Annual Income below Rs. 72,000)",
      "Community Certificate",
      "Age Proof of Bride (18+) and Groom (21+)",
      "Marriage Invitation Card",
      "Aadhaar Card and Ration Card",
      "Bank Passbook"
    ]),
    eligibilityRules: JSON.stringify({
      gender: "female",
      minAge: 18,
      maxIncome: 72000
    }),
    applicationProcedure: "Apply through nearest e-Sevai centre or submit documents to the District Social Welfare Officer at least 40 days before marriage."
  },
  {
    name: "Annai Teresa Ninaivu Marriage Assistance Scheme for Orphan Girls",
    description: "Financial assistance and gold coin for the marriage of orphan girls who have lost both parents.",
    category: "welfare",
    department: "Social Welfare and Women Empowerment Department",
    benefits: "Rs. 25,000 for non-graduates / Rs. 50,000 for graduates/diploma holders plus 8 grams of 22-carat gold coin. No income ceiling.",
    officialLink: "https://www.socialwelfare.tn.gov.in",
    lastDate: "31-12-2026",
    requiredDocuments: JSON.stringify([
      "Death Certificates of both Father and Mother (Orphan Certificate from Tahsildar)",
      "Bride's Educational Certificate",
      "Age Proof of Bride (min 18) and Groom (min 21)",
      "Marriage Invitation Card",
      "Aadhaar Card",
      "Bank Account Passbook"
    ]),
    eligibilityRules: JSON.stringify({
      gender: "female",
      minAge: 18
    }),
    applicationProcedure: "Submit application along with orphan certificate at the District Social Welfare Office or e-Sevai centre."
  },
  {
    name: "Chief Minister's Girl Child Protection Scheme (Scheme-II: Two Girl Children)",
    description: "Financial deposit scheme for families with two girl children and no male child to encourage female child education and eliminate female infanticide.",
    category: "welfare",
    department: "Social Welfare and Women Empowerment Department",
    benefits: "Fixed deposit of Rs. 25,000 in the name of each girl child with Power Finance Corporation, annual education incentive of Rs. 1,800 from 6th std, and maturity payout on completing 18 years.",
    officialLink: "https://www.socialwelfare.tn.gov.in",
    lastDate: "31-12-2026",
    requiredDocuments: JSON.stringify([
      "Birth Certificates of both girl children",
      "Sterilization Certificate of Parent",
      "Income Certificate (below Rs. 72,000)",
      "No Male Child Certificate from Tahsildar",
      "Aadhaar Card and Ration Card",
      "Family Photograph"
    ]),
    eligibilityRules: JSON.stringify({
      gender: "female",
      maxAge: 3,
      maxIncome: 72000
    }),
    applicationProcedure: "Apply at the District Social Welfare Office or Block Child Development Project Office (CDPO) before the second child turns 3 years old."
  },
  {
    name: "Thozhi Hostels - Working Women Hostels Scheme",
    description: "Safe, secure, modern, and affordable accommodation facilities for working women in urban centres across Tamil Nadu.",
    category: "welfare",
    department: "Tamil Nadu Working Women Hostels Corporation Limited (TNWWHCL)",
    benefits: "Subsidized air-conditioned and non-AC rooms, 24/7 biometric security, Wi-Fi, dining, and laundry services in Chennai, Coimbatore, Trichy, Salem, Madurai, etc.",
    officialLink: "https://thozhi.tn.gov.in",
    lastDate: null,
    requiredDocuments: JSON.stringify([
      "Employment Proof / Offer Letter / Salary Slip",
      "Aadhaar Card",
      "Address Proof",
      "Passport Size Photos"
    ]),
    eligibilityRules: JSON.stringify({
      gender: "female",
      minAge: 18
    }),
    applicationProcedure: "Book rooms online through the Thozhi portal (thozhi.tn.gov.in) and complete verification at the hostel."
  },
  {
    name: "Financial Assistance to Victims of Acid Attacks",
    description: "Monthly maintenance pension, medical reimbursement, and social rehabilitation for acid attack survivors in Tamil Nadu.",
    category: "welfare",
    department: "Welfare of Differently Abled Persons Department",
    benefits: "Monthly financial pension of Rs. 2,000 for life, specialized reconstructive medical surgery reimbursement, and priority in government welfare housing.",
    officialLink: "https://scw.tn.gov.in",
    lastDate: null,
    requiredDocuments: JSON.stringify([
      "Medical Board Certificate detailing burn/disability percentage",
      "Copy of First Information Report (FIR) / Court Order",
      "Aadhaar Card",
      "Bank Account Details",
      "Passport Size Photo"
    ]),
    eligibilityRules: JSON.stringify({
      disabilityStatus: true
    }),
    applicationProcedure: "Submit application to the District Differently Abled Welfare Officer (DDAWO) or District Collectorate."
  },
  {
    name: "One Stop Centre (Sakhi Centre) Scheme for Women in Distress",
    description: "Integrated single-window support providing medical, legal, police, psychological counselling, and emergency shelter assistance to women affected by violence.",
    category: "welfare",
    department: "Social Welfare and Women Empowerment Department",
    benefits: "24/7 free emergency rescue, medical examination, FIR filing support, legal aid counselling, and temporary shelter up to 5 days.",
    officialLink: "https://www.socialwelfare.tn.gov.in",
    lastDate: null,
    requiredDocuments: JSON.stringify([
      "Any ID proof if available (Emergency assistance provided immediately without documentation barrier)"
    ]),
    eligibilityRules: JSON.stringify({
      gender: "female"
    }),
    applicationProcedure: "Dial Women Helpline 181 (toll-free 24/7) or visit the nearest Sakhi One Stop Centre situated in government district headquarters hospitals."
  },

  // ==========================================
  // DIFFERENTLY ABLED WELFARE
  // ==========================================
  {
    name: "Maintenance Allowance to Severely Differently Abled Persons",
    description: "Monthly financial maintenance allowance to individuals with intellectual disability, cerebral palsy, autism, or muscular dystrophy with 40% and above disability.",
    category: "welfare",
    department: "Welfare of Differently Abled Persons Department",
    benefits: "Rs. 2,000 per month deposited directly into the beneficiary's bank account.",
    officialLink: "https://scw.tn.gov.in",
    lastDate: null,
    requiredDocuments: JSON.stringify([
      "Unique Disability ID (UDID) Card / Disability Certificate (40%+ disability)",
      "Medical Board Evaluation Certificate",
      "Aadhaar Card",
      "Ration Card",
      "Bank Passbook Page"
    ]),
    eligibilityRules: JSON.stringify({
      disabilityStatus: true
    }),
    applicationProcedure: "Apply through the District Differently Abled Welfare Officer (DDAWO) at the District Collectorate or via e-Sevai."
  },
  {
    name: "Free Retrofitted Motorized Scooters for Differently Abled Persons",
    description: "Distribution of motorized 3-wheeler scooters with side wheels to college students and self-employed differently abled persons with locomotor disability.",
    category: "welfare",
    department: "Welfare of Differently Abled Persons Department",
    benefits: "100% free retrofitted motorized scooter tailored for safe independent driving.",
    officialLink: "https://scw.tn.gov.in",
    lastDate: "30-09-2026",
    requiredDocuments: JSON.stringify([
      "Disability Certificate / UDID (both legs affected / locomotor disability)",
      "Driving Learner's Licence (LLR) or Driving Licence",
      "College Bonafide Certificate / Self-Employment Proof",
      "Income Certificate",
      "Aadhaar Card"
    ]),
    eligibilityRules: JSON.stringify({
      disabilityStatus: true,
      minAge: 18,
      maxAge: 45
    }),
    applicationProcedure: "Apply to the District Differently Abled Welfare Officer (DDAWO) during the annual announcement."
  },
  {
    name: "Free Battery-Operated Wheelchairs for Spinal Cord Injured Persons",
    description: "Provision of high-performance motorized battery-operated wheelchairs for individuals with spinal cord injury, quadriparesis, or muscular dystrophy.",
    category: "welfare",
    department: "Welfare of Differently Abled Persons Department",
    benefits: "Free specialized motorized battery wheelchair with joystick control enabling independent mobility.",
    officialLink: "https://scw.tn.gov.in",
    lastDate: "30-10-2026",
    requiredDocuments: JSON.stringify([
      "UDID Card / Disability Certificate with 75%+ disability",
      "Specialist Orthopedic / Neurologist recommendation",
      "Aadhaar Card",
      "Ration Card",
      "Income Certificate"
    ]),
    eligibilityRules: JSON.stringify({
      disabilityStatus: true
    }),
    applicationProcedure: "Submit application to the District Differently Abled Welfare Officer for evaluation by the regional screening committee."
  },
  {
    name: "Marriage Assistance Scheme for Normal Person Marrying a Differently Abled Person",
    description: "Financial encouragement grant and gold coin for individuals marrying visually, hearing, or physically challenged partners.",
    category: "welfare",
    department: "Welfare of Differently Abled Persons Department",
    benefits: "Rs. 25,000 for non-graduates / Rs. 50,000 for graduates plus 8 grams 22-carat gold coin for Thirumangalyam.",
    officialLink: "https://scw.tn.gov.in",
    lastDate: "31-12-2026",
    requiredDocuments: JSON.stringify([
      "Disability Certificate (UDID) of the differently abled spouse (min 40% disability)",
      "Marriage Certificate / Invitation",
      "Educational Certificates of Bride and Groom",
      "Age Proof",
      "Aadhaar Cards of both spouses",
      "Bank Account Details"
    ]),
    eligibilityRules: JSON.stringify({
      minAge: 18
    }),
    applicationProcedure: "Apply to the District Differently Abled Welfare Officer within 1 year of marriage."
  },
  {
    name: "Free Bus Pass Scheme for Differently Abled Persons",
    description: "100% free travel pass on all State Transport Corporation buses within the home district and 75% fare concession for long-distance travel.",
    category: "welfare",
    department: "Transport Department / Welfare of Differently Abled Persons",
    benefits: "Free bus travel pass with free companion travel for severely disabled persons requiring an escort.",
    officialLink: "https://scw.tn.gov.in",
    lastDate: null,
    requiredDocuments: JSON.stringify([
      "UDID Card / Disability Certificate (40%+ disability)",
      "Aadhaar Card",
      "Ration Card",
      "Stamp size photographs (2 copies)"
    ]),
    eligibilityRules: JSON.stringify({
      disabilityStatus: true
    }),
    applicationProcedure: "Submit application form at the District Differently Abled Welfare Office or local TNSTC depot."
  },
  {
    name: "Free Smart Cane and Daisy Players for Visually Impaired Persons",
    description: "Free assistive technological devices including ultrasonic smart canes for spatial navigation and Daisy audio players for education.",
    category: "welfare",
    department: "Welfare of Differently Abled Persons Department",
    benefits: "Electronic smart cane with sensor alerts and portable digital talking book player with preloaded accessible content.",
    officialLink: "https://scw.tn.gov.in",
    lastDate: "31-10-2026",
    requiredDocuments: JSON.stringify([
      "Disability Certificate / UDID confirming visual impairment",
      "Study Certificate or Employment Certificate",
      "Aadhaar Card",
      "Income Certificate"
    ]),
    eligibilityRules: JSON.stringify({
      disabilityStatus: true
    }),
    applicationProcedure: "Apply at the District Differently Abled Welfare Office during the distribution camps."
  },

  // ==========================================
  // AGRICULTURE, HORTICULTURE & ANIMAL HUSBANDRY
  // ==========================================
  {
    name: "Kalaignarin Anaithu Grama Orunginaintha Velan Valarchi Thittam (KAGOVVT)",
    description: "Flagship integrated village agricultural development programme revitalizing fallow lands, water bodies, micro-irrigation, and horticulture across Village Panchayats.",
    category: "agriculture",
    department: "Agriculture and Farmers Welfare Department",
    benefits: "Free coconut seedling kits, vegetable seed kits, farm pond creation subsidies, dryland horticulture grants, and power weeder subsidies.",
    officialLink: "https://www.tn.gov.in/agri",
    lastDate: "31-12-2026",
    requiredDocuments: JSON.stringify([
      "Patta / Chitta (Land records)",
      "Adangal copy",
      "Aadhaar Card",
      "Bank Passbook Page",
      "Ration Card"
    ]),
    eligibilityRules: JSON.stringify({
      isFarmer: true
    }),
    applicationProcedure: "Apply through the Uzhavan App or contact the local Assistant Agricultural Officer (AAO) in your Panchayat."
  },
  {
    name: "Tamil Nadu Solar Powered Agricultural Pump Sets Subsidy Scheme (PM-KUSUM)",
    description: "Subsidized solar photovoltaic water pumping systems (5 HP, 7.5 HP, 10 HP) to ensure day-time reliable irrigation for off-grid farmers.",
    category: "agriculture",
    department: "Agricultural Engineering Department / TANGEDCO",
    benefits: "70% capital subsidy (30% Central + 40% State Government subsidy) for standalone solar water pumping systems.",
    officialLink: "https://aed.tn.gov.in",
    lastDate: "30-11-2026",
    requiredDocuments: JSON.stringify([
      "Patta / Chitta document showing land ownership",
      "Adangal certificate",
      "Certificate of open well / borewell with water yield",
      "No Objection Certificate (NOC) from TANGEDCO",
      "Aadhaar Card",
      "Bank Passbook"
    ]),
    eligibilityRules: JSON.stringify({
      isFarmer: true
    }),
    applicationProcedure: "Register online on the Agricultural Engineering Department portal (aed.tn.gov.in) or via the Uzhavan Mobile App."
  },
  {
    name: "Subsidized Power Tiller and Paddy Transplanter Scheme",
    description: "Financial subsidy for the purchase of agricultural machinery including power tillers, power weeders, and mechanized paddy transplanters.",
    category: "agriculture",
    department: "Agricultural Engineering Department",
    benefits: "40% to 50% subsidy up to Rs. 85,000 for Power Tillers and Rs. 2.25 Lakhs for Paddy Transplanters (additional 10% for SC/ST/Small/Marginal women farmers).",
    officialLink: "https://aed.tn.gov.in",
    lastDate: "31-10-2026",
    requiredDocuments: JSON.stringify([
      "Patta and Chitta documents",
      "Small / Marginal Farmer Certificate",
      "Aadhaar Card",
      "Quotation from authorized dealer",
      "Bank Passbook Page"
    ]),
    eligibilityRules: JSON.stringify({
      isFarmer: true
    }),
    applicationProcedure: "Submit application on the AED portal or through the Assistant Executive Engineer (Agricultural Engineering) of your division."
  },
  {
    name: "Polyhouse and Shade Net Cultivation Subsidy (National Horticulture Mission)",
    description: "Financial subsidy for protected cultivation structures including Naturally Ventilated Polyhouses and Shade Net Houses for high-value vegetables and flowers.",
    category: "agriculture",
    department: "Horticulture and Plantation Crops Department",
    benefits: "50% capital subsidy on standard unit cost for constructing polyhouses, anti-bird nets, and shade net nurseries up to 4,000 sq. metres.",
    officialLink: "https://tnhorticulture.tn.gov.in",
    lastDate: "31-12-2026",
    requiredDocuments: JSON.stringify([
      "Land ownership documents (Patta / Chitta)",
      "Adangal with proposed crop plan",
      "Soil and Water Test Reports",
      "Approved structure drawing and estimate from empanelled vendor",
      "Aadhaar Card",
      "Bank Account Details"
    ]),
    eligibilityRules: JSON.stringify({
      isFarmer: true
    }),
    applicationProcedure: "Apply online at tnhorticulture.tn.gov.in or contact the Assistant Director of Horticulture (ADH) at the Block level."
  },
  {
    name: "Free Distribution of Ewes and Goats to Poor Rural Women",
    description: "Distribution of free sheep/goats to landless poor rural women, widows, and deserted wives to provide sustainable livelihood and poverty alleviation.",
    category: "agriculture",
    department: "Animal Husbandry, Dairying, Fisheries and Fishermen Welfare Department",
    benefits: "100% free distribution of 4 ewes/goats per beneficiary along with initial feed allowance and insurance coverage.",
    officialLink: "https://www.tn.gov.in/dept/animal_husbandry",
    lastDate: "30-11-2026",
    requiredDocuments: JSON.stringify([
      "Income Certificate (Annual family income below Rs. 72,000)",
      "Community Certificate",
      "Ration Card",
      "Aadhaar Card",
      "Landless Certificate from Village Administrative Officer (VAO)"
    ]),
    eligibilityRules: JSON.stringify({
      gender: "female",
      minAge: 18,
      maxAge: 60,
      maxIncome: 72000
    }),
    applicationProcedure: "Beneficiaries selected by the Grama Sabha headed by the local Veterinary Assistant Surgeon and VAO."
  },
  {
    name: "Free Distribution of Native Poultry (Nattu Kozhi) Units",
    description: "Scheme providing native poultry birds and night shelters to rural women for backyard poultry rearing and self-employment.",
    category: "agriculture",
    department: "Animal Husbandry, Dairying, Fisheries and Fishermen Welfare Department",
    benefits: "Free supply of 25 to 50 4-week-old desi chicks, Rs. 1,500 subsidy for night shelter construction, and essential feed subsidy.",
    officialLink: "https://www.tn.gov.in/dept/animal_husbandry",
    lastDate: "31-10-2026",
    requiredDocuments: JSON.stringify([
      "Income Certificate (below Rs. 72,000)",
      "Aadhaar Card",
      "Ration Card",
      "Bank Passbook Page"
    ]),
    eligibilityRules: JSON.stringify({
      gender: "female",
      minAge: 18,
      maxIncome: 72000
    }),
    applicationProcedure: "Apply at the local Government Veterinary Dispensary / Hospital."
  },
  {
    name: "Marine Fishing Ban Period Relief Assistance Scheme",
    description: "Annual financial relief assistance to marine fishermen families during the 61-day fishing ban period on the East and West coasts of Tamil Nadu.",
    category: "agriculture",
    department: "Fisheries and Fishermen Welfare Department",
    benefits: "Direct financial assistance of Rs. 8,000 per marine fisherman family deposited into their bank account.",
    officialLink: "https://fisheries.tn.gov.in",
    lastDate: "15-04-2026",
    requiredDocuments: JSON.stringify([
      "Fishermen Biometric ID Card",
      "Fishermen Co-operative Society Membership Passbook",
      "Aadhaar Card",
      "Bank Account Details (linked with Aadhaar)"
    ]),
    eligibilityRules: JSON.stringify({
      occupation: "Fisherman"
    }),
    applicationProcedure: "Disbursed directly through the District Fisheries Department to registered members of Marine Fishermen Co-operative Societies."
  },
  {
    name: "Fishermen Lean Period Saving-cum-Relief Scheme",
    description: "Social security scheme providing financial assistance to marine fishers during lean fishing seasons with matching state and central government contributions.",
    category: "agriculture",
    department: "Fisheries and Fishermen Welfare Department",
    benefits: "Disbursement of Rs. 4,500 in three equal monthly installments (Rs. 1,500/month) during the adverse fishing months.",
    officialLink: "https://fisheries.tn.gov.in",
    lastDate: "31-08-2026",
    requiredDocuments: JSON.stringify([
      "Fishermen Co-operative Society Membership Record",
      "Fishermen Biometric ID Card",
      "Aadhaar Card",
      "Bank Passbook"
    ]),
    eligibilityRules: JSON.stringify({
      occupation: "Fisherman"
    }),
    applicationProcedure: "Enroll through the local Marine Fishermen/Fisherwomen Co-operative Society."
  },
  {
    name: "Certified Paddy Seed Subsidy Scheme (Kuruvai & Samba Seasons)",
    description: "Distribution of certified high-yielding and bio-fortified paddy seeds with 50% subsidy to ensure high agricultural productivity in Delta and non-Delta districts.",
    category: "agriculture",
    department: "Agriculture and Farmers Welfare Department",
    benefits: "50% price concession on certified seeds (up to Rs. 20/kg) and micronutrient fertilizer packages.",
    officialLink: "https://www.tn.gov.in/agri",
    lastDate: "31-10-2026",
    requiredDocuments: JSON.stringify([
      "Patta / Chitta document",
      "Aadhaar Card",
      "Uzhavan App Registration / Farmer ID"
    ]),
    eligibilityRules: JSON.stringify({
      isFarmer: true
    }),
    applicationProcedure: "Purchase directly at subsidized rates from local Agricultural Extension Centres (AEC) using Aadhaar authentication."
  },

  // ==========================================
  // EMPLOYMENT, SKILLS & MSME
  // ==========================================
  {
    name: "Naan Mudhalvan Youth Skill Development Scheme",
    description: "State youth empowerment initiative providing industry-aligned training in advanced technologies, communication, and engineering for enhanced employability.",
    category: "business",
    department: "Tamil Nadu Skill Development Corporation (TNSDC)",
    benefits: "100% free certified training courses in AI, Cloud Computing, Full-Stack, Robotics, Logistics, and EV systems with job placement drives.",
    officialLink: "https://naanmudhalvan.tn.gov.in",
    lastDate: "31-12-2026",
    requiredDocuments: JSON.stringify([
      "College ID / Degree Certificate",
      "Aadhaar Card",
      "Resume / CV"
    ]),
    eligibilityRules: JSON.stringify({
      isStudent: true,
      minAge: 18,
      maxAge: 28
    }),
    applicationProcedure: "Enroll online on the official Naan Mudhalvan portal (naanmudhalvan.tn.gov.in)."
  },
  {
    name: "Annal Ambedkar Business Champions Scheme (AABCS)",
    description: "Flagship entrepreneurship scheme for Scheduled Caste and Scheduled Tribe entrepreneurs providing capital subsidy and interest subvention for new ventures.",
    category: "business",
    department: "Micro, Small and Medium Enterprises (MSME) Department",
    benefits: "35% capital subsidy up to Rs. 1.50 Crore on project cost, plus 6% interest subvention for 10 years for manufacturing and service enterprises.",
    officialLink: "https://www.msmeonline.tn.gov.in",
    lastDate: "31-12-2026",
    requiredDocuments: JSON.stringify([
      "Detailed Project Report (DPR)",
      "Community Certificate (SC/ST)",
      "Educational / Technical Qualification Certificate",
      "Aadhaar Card and PAN Card",
      "Bank Loan In-principle Sanction Letter"
    ]),
    eligibilityRules: JSON.stringify({
      categories: ["SC", "ST"],
      minAge: 18,
      maxAge: 55
    }),
    applicationProcedure: "Apply online at the MSME Online portal (msmeonline.tn.gov.in) and attend District Taskforce Committee (DTFC) interview."
  },
  {
    name: "Unemployment Assistance Scheme for Educated Job Seekers",
    description: "Monthly financial allowance for unemployed youth registered in District Employment Exchanges across Tamil Nadu.",
    category: "welfare",
    department: "Directorate of Employment and Training",
    benefits: "Monthly stipend of Rs. 200 (10th fail), Rs. 300 (10th pass), Rs. 400 (HSC pass), and Rs. 600 (Degree/PG) for up to 3 years.",
    officialLink: "https://employmentexchange.tn.gov.in",
    lastDate: null,
    requiredDocuments: JSON.stringify([
      "Employment Exchange Registration Card (continuous registration for 5+ years)",
      "Educational Qualification Marksheets",
      "Income Certificate (family income below Rs. 72,000)",
      "Aadhaar Card",
      "Bank Account Passbook"
    ]),
    eligibilityRules: JSON.stringify({
      occupation: "Unemployed",
      minAge: 18,
      maxAge: 45,
      maxIncome: 72000
    }),
    applicationProcedure: "Submit application form online through the Employment Exchange portal or at the District Employment Office."
  },
  {
    name: "Unemployment Allowance for Differently Abled Job Seekers",
    description: "Enhanced monthly unemployment allowance for differently abled job seekers registered in employment exchanges.",
    category: "welfare",
    department: "Directorate of Employment and Training / Differently Abled Welfare",
    benefits: "Monthly stipend of Rs. 600 (10th fail), Rs. 750 (10th pass), Rs. 900 (HSC pass), and Rs. 1,000 (Degree/PG) for up to 10 years.",
    officialLink: "https://scw.tn.gov.in",
    lastDate: null,
    requiredDocuments: JSON.stringify([
      "Employment Registration Card (registered for min 1 year)",
      "Disability Certificate / UDID Card",
      "Educational Certificates",
      "Aadhaar Card",
      "Bank Passbook Page"
    ]),
    eligibilityRules: JSON.stringify({
      disabilityStatus: true,
      occupation: "Unemployed",
      minAge: 18
    }),
    applicationProcedure: "Apply at the District Employment Office / Special Employment Office for Differently Abled."
  },
  {
    name: "Modern Powerloom and Solar Loom Subsidy Scheme",
    description: "Subsidy for modernization of powerlooms and installation of rooftop solar power systems for powerloom weaver cooperative societies and individual weavers.",
    category: "business",
    department: "Handlooms, Handicrafts, Textiles and Khadi Department",
    benefits: "50% capital subsidy (up to Rs. 2 Lakhs per loom) for replacing plain looms with modern shuttleless rapier looms and solar kits.",
    officialLink: "https://www.tn.gov.in/dept/handlooms",
    lastDate: "30-11-2026",
    requiredDocuments: JSON.stringify([
      "Weaver Identity Card / Society Membership Record",
      "Factory / Workshop Licence or Electricity Service Connection Details",
      "Quotation for modern machinery",
      "Aadhaar Card",
      "Bank Details"
    ]),
    eligibilityRules: JSON.stringify({
      occupation: "Weaver"
    }),
    applicationProcedure: "Submit application to the Assistant Director of Handlooms and Textiles in the concerned textile cluster."
  },
  {
    name: "Co-optex Free Dhoti and Saree Scheme (Pongal Festival Distribution)",
    description: "Annual free distribution of quality dhotis and sarees to economically vulnerable families holding rice ration cards during Pongal festival.",
    category: "welfare",
    department: "Handlooms, Handicrafts, Textiles and Khadi / Civil Supplies",
    benefits: "1 free dhoti and 1 free saree distributed per eligible family card, supporting both rural families and handloom weavers.",
    officialLink: "https://www.tnpds.gov.in",
    lastDate: null,
    requiredDocuments: JSON.stringify([
      "Valid Smart Ration Card (Rice Card)",
      "Aadhaar Card"
    ]),
    eligibilityRules: JSON.stringify({
      maxIncome: 72000
    }),
    applicationProcedure: "Collected directly at your registered Public Distribution System (PDS) fair price ration shop during Pongal gift distribution."
  },
  {
    name: "Tamil Nadu Unorganized Workers Welfare Board Social Security (TNUWWB)",
    description: "Comprehensive social security and accident relief assistance for registered workers across 17 unorganized sector welfare boards (tailors, drivers, domestic workers, etc.).",
    category: "welfare",
    department: "Labour Welfare and Skill Development Department",
    benefits: "Accident death relief of Rs. 5 Lakhs, natural death assistance of Rs. 20,000, marriage assistance of Rs. 5,000, and educational grants for children up to Rs. 8,000/year.",
    officialLink: "https://tnuwwb.tn.gov.in",
    lastDate: null,
    requiredDocuments: JSON.stringify([
      "TNUWWB Worker Registration Card / e-Shram Card",
      "Proof of Occupation (certified by Union/VAO)",
      "Aadhaar Card",
      "Ration Card",
      "Bank Passbook Page"
    ]),
    eligibilityRules: JSON.stringify({
      minAge: 18,
      maxAge: 60
    }),
    applicationProcedure: "Apply online at tnuwwb.tn.gov.in or through registered labour union representatives."
  },
  {
    name: "Tamil Nadu Construction Workers Welfare Board Housing & Pension Scheme",
    description: "Financial assistance, housing subsidy, and old-age pension for registered manual construction workers in Tamil Nadu.",
    category: "welfare",
    department: "Tamil Nadu Construction Workers Welfare Board (TNCWWB)",
    benefits: "Housing construction subsidy of Rs. 4,00,000, monthly old-age pension of Rs. 1,000 upon reaching 60, maternity benefit of Rs. 18,000, and disability compensation.",
    officialLink: "https://tnuwwb.tn.gov.in",
    lastDate: null,
    requiredDocuments: JSON.stringify([
      "Construction Board Registration Card (active membership)",
      "Employer / Union Employer Certificate of 90 days construction work",
      "Aadhaar Card",
      "Bank Account Details",
      "Land Ownership Documents (for housing subsidy)"
    ]),
    eligibilityRules: JSON.stringify({
      occupation: "Construction Worker",
      minAge: 18,
      maxAge: 60
    }),
    applicationProcedure: "Apply online via the TNUWWB portal or at the District Labour Welfare Office."
  },
  {
    name: "TAHDCO Micro Business Assistance for Retail Kiosks and Food Stalls",
    description: "Capital subsidy and bank loan linkage for SC/ST individuals to establish tea stalls, small bakeries, grocery stores, and fast-food retail kiosks.",
    category: "business",
    department: "Tamil Nadu Adi Dravidar Housing and Development Corporation (TAHDCO)",
    benefits: "30% capital subsidy (up to Rs. 2.25 Lakhs) on total project cost with tied bank credit.",
    officialLink: "https://tahdco.tn.gov.in",
    lastDate: "31-12-2026",
    requiredDocuments: JSON.stringify([
      "Community Certificate (SC/ST)",
      "Income Certificate (family income below Rs. 3 Lakhs)",
      "Project Estimate / Quotation",
      "Aadhaar Card and Ration Card",
      "Bank Passbook"
    ]),
    eligibilityRules: JSON.stringify({
      categories: ["SC", "ST"],
      minAge: 18,
      maxAge: 45,
      maxIncome: 300000
    }),
    applicationProcedure: "Submit application on the TAHDCO online application portal (tahdco.tn.gov.in)."
  },
  {
    name: "TAHDCO Commercial Vehicle Purchase Subsidy Scheme",
    description: "Subsidy for SC/ST youth to purchase commercial transport vehicles (auto rickshaws, taxis, tourist vans, light commercial goods vehicles) for self-employment.",
    category: "business",
    department: "Tamil Nadu Adi Dravidar Housing and Development Corporation (TAHDCO)",
    benefits: "30% government subsidy (up to Rs. 2.50 Lakhs) on vehicle ex-showroom price.",
    officialLink: "https://tahdco.tn.gov.in",
    lastDate: "31-12-2026",
    requiredDocuments: JSON.stringify([
      "Commercial Driving Licence with Badge",
      "Community Certificate (SC/ST)",
      "Income Certificate",
      "Vehicle Proforma Invoice from authorized showroom",
      "Aadhaar Card"
    ]),
    eligibilityRules: JSON.stringify({
      categories: ["SC", "ST"],
      minAge: 18,
      maxAge: 45,
      maxIncome: 300000
    }),
    applicationProcedure: "Apply online on the TAHDCO portal and attend selection interview by District Collectorate Committee."
  },
  {
    name: "TAMCO Micro-Credit Loan Scheme for Minority Women SHGs",
    description: "Concessional micro-finance credit to women Self Help Groups belonging to minority communities (Muslims, Christians, Sikhs, Buddhists, Parsis, Jains).",
    category: "business",
    department: "Tamil Nadu Minorities Economic Development Corporation (TAMCO)",
    benefits: "Micro loans up to Rs. 1,00,000 per woman at a low concessional interest rate of 7% per annum for small businesses and trading.",
    officialLink: "https://bcmbcmw.tn.gov.in",
    lastDate: "31-12-2026",
    requiredDocuments: JSON.stringify([
      "Minority Community Certificate / Religious Declaration",
      "SHG Resolution & Grading Certificate",
      "Income Certificate",
      "Aadhaar Card",
      "Bank Account Details"
    ]),
    eligibilityRules: JSON.stringify({
      gender: "female",
      categories: ["Minority"],
      minAge: 18,
      maxIncome: 300000
    }),
    applicationProcedure: "Apply through District Central Cooperative Banks (DCCB) or District Backward Classes and Minorities Welfare Officer."
  },
  {
    name: "TABCEDCO Term Loan Scheme for BC, MBC and DNC Entrepreneurs",
    description: "Soft term loan scheme providing low-interest capital for establishing small businesses, service units, and transport operations.",
    category: "business",
    department: "Tamil Nadu Backward Classes Economic Development Corporation (TABCEDCO)",
    benefits: "Term loans up to Rs. 15,00,000 with 6% to 8% interest rate and flexible 5-year repayment schedule.",
    officialLink: "https://tabcedco.tn.gov.in",
    lastDate: "31-12-2026",
    requiredDocuments: JSON.stringify([
      "Community Certificate (BC/MBC/DNC)",
      "Income Certificate",
      "Business Project Report / Estimation",
      "Aadhaar Card and PAN Card",
      "Collateral / Security Documents if loan exceeds limit"
    ]),
    eligibilityRules: JSON.stringify({
      categories: ["BC", "MBC", "DNC"],
      minAge: 18,
      maxAge: 60,
      maxIncome: 300000
    }),
    applicationProcedure: "Submit application form to the District Central Cooperative Bank or Joint Registrar of Cooperative Societies."
  },

  // ==========================================
  // HEALTH, MEDICAL & SOCIAL SECURITY
  // ==========================================
  {
    name: "Makkalai Thedi Maruthuvam (Doorstep Healthcare Scheme)",
    description: "Pioneering healthcare delivery scheme providing screening, diagnostics, and free doorstep delivery of hypertension and diabetes medicines to households.",
    category: "health",
    department: "Health and Family Welfare Department",
    benefits: "Free doorstep delivery of monthly NCD medicines, home-based physiotherapy, and palliative care nursing for non-ambulatory elderly patients.",
    officialLink: "https://nhm.tn.gov.in",
    lastDate: null,
    requiredDocuments: JSON.stringify([
      "Aadhaar Card / Smart Ration Card",
      "Medical Prescription / Hospital Diagnosis Slip"
    ]),
    eligibilityRules: JSON.stringify({
      minAge: 45
    }),
    applicationProcedure: "Identified during door-to-door community health worker (Women Health Volunteers - WHVs) screening in your street."
  },
  {
    name: "Chief Minister's Free Cochlear Implant Scheme for Children",
    description: "100% cashless cochlear implantation surgery and auditory-verbal therapy for children with profound congenital sensorineural hearing loss.",
    category: "health",
    department: "Health and Family Welfare Department",
    benefits: "Free cochlear implant surgery worth Rs. 8 Lakhs and 1-year auditory habilitation therapy in empanelled hospitals.",
    officialLink: "https://www.cmchistn.com",
    lastDate: null,
    requiredDocuments: JSON.stringify([
      "BERA and Audiometry Hearing Test Reports",
      "Birth Certificate of child (under 6 years)",
      "CMCHIS Health Insurance Smart Card / Ration Card",
      "Income Certificate (family income up to Rs. 5 Lakhs)",
      "Aadhaar Card"
    ]),
    eligibilityRules: JSON.stringify({
      disabilityStatus: true,
      maxAge: 6,
      maxIncome: 500000
    }),
    applicationProcedure: "Consult the ENT Department at any Government Medical College Hospital for pre-surgical evaluation under CMCHIS."
  },
  {
    name: "Indira Gandhi National Disability Pension Scheme (IGNDPS - TN)",
    description: "Monthly disability pension scheme for persons aged 18 to 59 years with severe or multiple disabilities belonging to below-poverty-line families.",
    category: "welfare",
    department: "Revenue and Disaster Management / Differently Abled Welfare",
    benefits: "Monthly pension of Rs. 1,500 deposited directly into the beneficiary's bank account.",
    officialLink: "https://www.tn.gov.in/forms/deptname/24",
    lastDate: null,
    requiredDocuments: JSON.stringify([
      "Medical Board Disability Certificate with 80%+ severe disability or multiple disabilities",
      "BPL Certificate / Smart Ration Card",
      "Aadhaar Card",
      "Bank Account Details",
      "Age Proof (18 to 59 years)"
    ]),
    eligibilityRules: JSON.stringify({
      disabilityStatus: true,
      minAge: 18,
      maxAge: 59,
      maxIncome: 72000
    }),
    applicationProcedure: "Apply online at nearest e-Sevai centre or submit physical form to the Special Tahsildar (Social Security Schemes)."
  },
  {
    name: "State Disaster and Accidental Relief Fund (CMRF)",
    description: "Immediate ex-gratia compensation and emergency assistance for families who have lost breadwinners or property due to natural calamities and accidents.",
    category: "welfare",
    department: "Revenue and Disaster Management Department",
    benefits: "Ex-gratia grant of Rs. 4,00,000 for loss of life in natural disasters (floods, lightning, storm) and free hut repair assistance.",
    officialLink: "https://tndistrict.tn.gov.in",
    lastDate: null,
    requiredDocuments: JSON.stringify([
      "Death Certificate and Post-Mortem Report (if applicable)",
      "FIR / Police Report",
      "VAO Loss Assessment Certificate",
      "Legal Heir Certificate",
      "Aadhaar Card and Bank Passbook"
    ]),
    eligibilityRules: JSON.stringify({
      maxIncome: 120000
    }),
    applicationProcedure: "Submit application to the Tahsildar or District Revenue Officer (DRO) immediately following the calamity."
  },
  {
    name: "Chief Minister's Geriatric Assisted Living and Free Old Age Home Scheme",
    description: "Free residential accommodation, geriatric medical care, food, and clothing for destitute and abandoned senior citizens in government-aided old age homes.",
    category: "welfare",
    department: "Social Welfare and Women Empowerment Department",
    benefits: "100% free food, shelter, clothing, medical assistance, and recreational facilities for destitute elders.",
    officialLink: "https://www.socialwelfare.tn.gov.in",
    lastDate: null,
    requiredDocuments: JSON.stringify([
      "Age Proof (60+ years)",
      "Destitute Certificate from VAO / Tahsildar",
      "Aadhaar Card",
      "Medical Fitness / Health Screening Report"
    ]),
    eligibilityRules: JSON.stringify({
      isSeniorCitizen: true,
      minAge: 60,
      maxIncome: 72000
    }),
    applicationProcedure: "Apply to the District Social Welfare Officer (DSWO) or contact registered government-aided Senior Citizen Homes."
  }
];

async function importSchemes() {
  console.log("=================================================");
  console.log("THUVAKKAM AI - SAFE SCHEME EXPANSION PROCESS");
  console.log("=================================================\n");

  const initialCount = await prisma.scheme.count();
  console.log(`Current scheme count in database: ${initialCount}`);

  // Fetch all existing schemes to perform rigorous duplicate checking
  const existingSchemes = await prisma.scheme.findMany({
    select: { id: true, name: true, officialLink: true, department: true }
  });

  const existingNamesLower = new Set(existingSchemes.map(s => s.name.trim().toLowerCase()));
  const existingLinksLower = new Set(existingSchemes.filter(s => s.officialLink).map(s => s.officialLink.trim().toLowerCase()));

  console.log(`Loaded ${existingSchemes.length} existing scheme records for duplicate comparison.\n`);

  let addedCount = 0;
  let skippedCount = 0;
  const skippedList = [];

  for (const scheme of newTamilNaduSchemes) {
    const nameLower = scheme.name.trim().toLowerCase();
    
    // Check duplicates by exact name or substring matching on key keywords
    const isNameDuplicate = existingNamesLower.has(nameLower) || existingSchemes.some(s => {
      const sName = s.name.toLowerCase();
      // If primary scheme name overlap
      if (sName === nameLower) return true;
      if (scheme.name.includes("Pudhumai Penn") && sName.includes("pudhumai penn")) return true;
      if (scheme.name.includes("TNCMFP") && sName.includes("tncmfp")) return true;
      if (scheme.name.includes("E.V.R. Periyar") && sName.includes("e.v.r. periyar")) return true;
      if (scheme.name.includes("UYEGP") && sName.includes("uyegp")) return true;
      if (scheme.name.includes("NEEDS") && sName.includes("needs")) return true;
      if (scheme.name.includes("PMEGP") && sName.includes("pmegp")) return true;
      if (scheme.name.includes("TNCCHIS") && sName.includes("tncchis")) return true;
      return false;
    });

    if (isNameDuplicate) {
      console.log(`[SKIP] Duplicate detected: "${scheme.name}"`);
      skippedCount++;
      skippedList.push(scheme.name);
      continue;
    }

    // Insert new scheme safely
    await prisma.scheme.create({
      data: {
        name: scheme.name,
        description: scheme.description,
        eligibilityRules: scheme.eligibilityRules,
        benefits: scheme.benefits,
        requiredDocuments: scheme.requiredDocuments,
        applicationProcedure: scheme.applicationProcedure,
        lastDate: scheme.lastDate,
        department: scheme.department,
        officialLink: scheme.officialLink,
        category: scheme.category,
        isActive: true
      }
    });

    console.log(`[INSERTED] (${scheme.category}) ${scheme.name}`);
    addedCount++;
    existingNamesLower.add(nameLower);
  }

  const finalCount = await prisma.scheme.count();
  const usersCount = await prisma.user.count();
  const appsCount = await prisma.application.count();
  const adminsCount = await prisma.admin.count();

  console.log("\n================ EXPANSION SUMMARY ================");
  console.log(`Existing Scheme Count Before: ${initialCount}`);
  console.log(`New Verified Schemes Added:   ${addedCount}`);
  console.log(`Duplicates Skipped:           ${skippedCount}`);
  console.log(`Final Scheme Count:           ${finalCount}`);
  console.log("-------------------------------------------------");
  console.log(`Users preserved:              ${usersCount}`);
  console.log(`Applications preserved:       ${appsCount}`);
  console.log(`Admins preserved:             ${adminsCount}`);
  console.log("=================================================\n");

  await prisma.$disconnect();
}

importSchemes().catch((err) => {
  console.error("Error during scheme import:", err);
  process.exit(1);
});

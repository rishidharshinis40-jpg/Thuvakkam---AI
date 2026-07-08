export interface UserProfile {
  name?: string;
  phone?: string;
  age?: number;
  gender?: string; // male, female, other
  district?: string;
  education?: string; // School, HSC, Graduate, Postgraduate, 8th_std, etc.
  occupation?: string; // Student, Farmer, Washerman, Agricultural Labourer, Weaver, Unemployed, etc.
  annualIncome?: number;
  disabilityStatus?: boolean;
  isStudent?: boolean;
  isFarmer?: boolean;
  isSeniorCitizen?: boolean;
}

export interface MatchResult {
  schemeId: string;
  schemeName: string;
  isEligible: boolean;
  score: number; // 0 to 100
  reasons: string[];
}

export function matchScheme(profile: UserProfile, scheme: { id: string; name: string; eligibilityRules: string }): MatchResult {
  let isEligible = true;
  let score = 100;
  const reasons: string[] = [];
  
  let rules: any = {};
  try {
    rules = JSON.parse(scheme.eligibilityRules);
  } catch (e) {
    console.error(`Failed to parse eligibility rules for scheme ${scheme.name}:`, e);
    return {
      schemeId: scheme.id,
      schemeName: scheme.name,
      isEligible: false,
      score: 0,
      reasons: ["மின்னணு தகுதி விதிகளை பகுப்பாய்வு செய்ய முடியவில்லை. (Cannot parse eligibility rules.)"]
    };
  }

  // 1. Gender check
  if (rules.gender && rules.gender !== "any") {
    if (profile.gender) {
      if (profile.gender.toLowerCase() !== rules.gender.toLowerCase()) {
        isEligible = false;
        reasons.push(`இந்தத் திட்டம் பெண்களுக்கு மட்டுமேயானது. (This scheme is for ${rules.gender} only.)`);
      } else {
        reasons.push("விண்ணப்பதாரர் பாலினம் திட்டத்தின் நிபந்தனைகளுடன் பொருந்துகிறது. (Gender matches requirement.)");
      }
    } else {
      // Gender is required but missing in profile
      score -= 20;
      reasons.push("விண்ணப்பதாரரின் பாலினம் குறிப்பிடப்படவில்லை. (Gender is not specified.)");
    }
  }

  // 2. Age check
  if (rules.minAge !== undefined) {
    if (profile.age !== undefined) {
      if (profile.age < rules.minAge) {
        isEligible = false;
        reasons.push(`விண்ணப்பதாரரின் வயது (${profile.age}) திட்டத்தின் குறைந்தபட்ச வயதைவிடக் குறைவு (${rules.minAge}). (Age is below minimum requirement.)`);
      } else {
        reasons.push(`வயது தகுதி வரம்பிற்குள் உள்ளது. (Age satisfies minimum requirement of ${rules.minAge} years.)`);
      }
    } else {
      score -= 15;
      reasons.push("வயது விவரம் குறிப்பிடப்படவில்லை. (Age is not specified.)");
    }
  }

  if (rules.maxAge !== undefined) {
    if (profile.age !== undefined) {
      if (profile.age > rules.maxAge) {
        isEligible = false;
        reasons.push(`விண்ணப்பதாரரின் வயது (${profile.age}) திட்டத்தின் அதிகபட்ச வயதைவிட அதிகம் (${rules.maxAge}). (Age exceeds maximum limit.)`);
      } else {
        reasons.push(`வயது தகுதி வரம்பிற்குள் உள்ளது. (Age satisfies maximum limit of ${rules.maxAge} years.)`);
      }
    } else {
      if (rules.minAge === undefined) {
        score -= 15;
        reasons.push("வயது விவரம் குறிப்பிடப்படவில்லை. (Age is not specified.)");
      }
    }
  }

  // 3. Annual Income check
  if (rules.maxIncome !== undefined) {
    if (profile.annualIncome !== undefined) {
      if (profile.annualIncome > rules.maxIncome) {
        isEligible = false;
        reasons.push(`விண்ணப்பதாரரின் ஆண்டு வருமானம் (ரூ. ${profile.annualIncome}) திட்டத்தின் வரம்பைவிட அதிகம் (ரூ. ${rules.maxIncome}). (Annual income exceeds the ceiling.)`);
      } else {
        reasons.push(`வருமானம் வரம்பிற்குள் உள்ளது (ரூ. ${profile.annualIncome} <= ரூ. ${rules.maxIncome}). (Annual income is within the eligible range.)`);
      }
    } else {
      score -= 25;
      reasons.push("ஆண்டு வருமான விவரம் குறிப்பிடப்படவில்லை. (Annual income is not specified.)");
    }
  }

  // 4. Student check
  if (rules.isStudent) {
    if (profile.isStudent !== undefined) {
      if (!profile.isStudent) {
        isEligible = false;
        reasons.push("இந்தத் திட்டம் மாணவர்களுக்கு மட்டுமேயானது. (This scheme is for students only.)");
      } else {
        reasons.push("விண்ணப்பதாரர் ஒரு மாணவர் ஆவார். (Applicant is a student.)");
      }
    } else {
      score -= 20;
      reasons.push("மாணவர் நிலை விவரம் குறிப்பிடப்படவில்லை. (Student status is not specified.)");
    }
  }

  // 5. Farmer check
  if (rules.isFarmer) {
    if (profile.isFarmer !== undefined) {
      if (!profile.isFarmer) {
        isEligible = false;
        reasons.push("இந்தத் திட்டம் விவசாயிகளுக்கு மட்டுமேயானது. (This scheme is for farmers only.)");
      } else {
        reasons.push("விண்ணப்பதாரர் ஒரு விவசாயி ஆவார். (Applicant is a farmer.)");
      }
    } else {
      score -= 20;
      reasons.push("விவசாயி நிலை விவரம் குறிப்பிடப்படவில்லை. (Farmer status is not specified.)");
    }
  }

  // 6. Disability check
  if (rules.disabilityStatus) {
    if (profile.disabilityStatus !== undefined) {
      if (!profile.disabilityStatus) {
        isEligible = false;
        reasons.push("மாற்றுத்திறனாளிகளுக்கான சிறப்புத் திட்டம் இது. (This scheme is for differently-abled individuals only.)");
      } else {
        reasons.push("மாற்றுத்திறனாளி தகுதி பொருந்துகிறது. (Applicant is differently-abled.)");
      }
    } else {
      score -= 20;
      reasons.push("மாற்றுத்திறனாளி விவரம் குறிப்பிடப்படவில்லை. (Disability status is not specified.)");
    }
  }

  // 7. Senior Citizen check
  if (rules.isSeniorCitizen) {
    if (profile.isSeniorCitizen !== undefined) {
      if (!profile.isSeniorCitizen && (profile.age === undefined || profile.age < 60)) {
        isEligible = false;
        reasons.push("மூத்த குடிமக்களுக்கான சிறப்புத் திட்டம் இது. (This scheme is for senior citizens only.)");
      } else {
        reasons.push("மூத்த குடிமகன் தகுதி பொருந்துகிறது. (Applicant is a senior citizen.)");
      }
    } else {
      // Check if age can infer it
      if (profile.age !== undefined) {
        if (profile.age < 60) {
          isEligible = false;
          reasons.push("மூத்த குடிமக்களுக்கான சிறப்புத் திட்டம் இது. (This scheme is for senior citizens only.)");
        } else {
          reasons.push("வயது வரம்பின் அடிப்படையில் மூத்த குடிமகன் தகுதி பொருந்துகிறது. (Eligible based on age >= 60.)");
        }
      } else {
        score -= 15;
        reasons.push("மூத்த குடிமகன் தகுதி விவரம் குறிப்பிடப்படவில்லை. (Senior citizen status is not specified.)");
      }
    }
  }

  // 8. Occupation check
  if (rules.occupation) {
    if (profile.occupation) {
      if (profile.occupation.toLowerCase() !== rules.occupation.toLowerCase()) {
        isEligible = false;
        reasons.push(`இந்தத் திட்டம் குறிப்பிட்ட தொழில் செய்பவர்களுக்கானது: ${rules.occupation}. (This scheme requires occupation: ${rules.occupation}.)`);
      } else {
        reasons.push(`விண்ணப்பதாரரின் தொழில் (${profile.occupation}) பொருந்துகிறது. (Occupation matches.)`);
      }
    } else {
      score -= 15;
      reasons.push("தொழில் விவரம் குறிப்பிடப்படவில்லை. (Occupation is not specified.)");
    }
  }

  // 9. District check
  if (rules.districts && Array.isArray(rules.districts)) {
    if (profile.district) {
      const matchDistrict = rules.districts.some((d: string) => d.toLowerCase() === profile.district!.toLowerCase());
      if (!matchDistrict) {
        isEligible = false;
        reasons.push(`இந்தத் திட்டம் குறிப்பிட்ட மாவட்டங்களுக்கு மட்டுமே: ${rules.districts.join(", ")}. (District not eligible.)`);
      } else {
        reasons.push("வசிக்கும் மாவட்டம் திட்டத்தின் தகுதிக்குள் அடங்கும். (District is eligible.)");
      }
    } else {
      score -= 10;
      reasons.push("மாவட்டம் குறிப்பிடப்படவில்லை. (District is not specified.)");
    }
  }

  // Final score logic
  if (!isEligible) {
    score = 0;
  } else {
    // Make sure score doesn't drop below 10 for eligible matches
    score = Math.max(10, score);
  }

  return {
    schemeId: scheme.id,
    schemeName: scheme.name,
    isEligible,
    score,
    reasons
  };
}

export function rankSchemes(profile: UserProfile, schemes: Array<{ id: string; name: string; eligibilityRules: string }>): MatchResult[] {
  return schemes
    .map((scheme) => matchScheme(profile, scheme))
    .filter((res) => res.isEligible)
    .sort((a, b) => b.score - a.score);
}

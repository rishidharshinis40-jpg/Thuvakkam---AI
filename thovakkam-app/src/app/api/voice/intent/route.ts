import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

// Define the conversation state interface
interface ConversationState {
  currentQuestionId: string; // name, age, gender, district, isStudent, education, isFarmer, annualIncome, disabilityStatus, complete
  profile: {
    name?: string;
    age?: number;
    gender?: string;
    district?: string;
    isStudent?: boolean;
    education?: string;
    isFarmer?: boolean;
    annualIncome?: number;
    disabilityStatus?: boolean;
    isSeniorCitizen?: boolean;
    occupation?: string;
  };
  previousQuestions: string[];
}

const QUESTIONS = {
  welcome: "வணக்கம்! நான் துவக்கம் AI. தமிழக அரசின் திட்டங்கள் மற்றும் உதவித்தொகைகளை கண்டறிய உங்களுக்கு உதவுகிறேன். உங்கள் பெயரை சொல்லுங்கள்.",
  name: "உங்களது வயது என்ன?",
  age: "உங்களது பாலினம் என்ன? ஆண் அல்லது பெண் என்று கூறுங்கள்.",
  gender: "நீங்கள் எந்த மாவட்டத்தைச் சேர்ந்தவர்?",
  district: "நீங்கள் ஒரு மாணவரா? ஆம் அல்லது இல்லை என்று கூறுங்கள்.",
  isStudent: "நீங்கள் என்ன படித்துக் கொண்டிருக்கிறீர்கள்? பள்ளி அல்லது கல்லூரி?",
  isFarmer: "நீங்கள் விவசாயம் செய்கிறீர்களா? ஆம் அல்லது இல்லை என்று கூறுங்கள்.",
  education: "உங்கள் குடும்பத்தின் ஆண்டு வருமானம் எவ்வளவு?", // transition
  annualIncome: "நீங்கள் மாற்றுத்திறனாளியா? ஆம் அல்லது இல்லை என்று கூறுங்கள்.",
  disabilityStatus: "நன்றி! உங்கள் சுயவிவரம் சேகரிக்கப்பட்டது. உங்களுக்குப் பொருந்தக்கூடிய திட்டங்களை இப்போது நான் கூறுகிறேன்."
};

// Simple rules-based parser for local fallback
function parseLocalIntent(transcript: string, state: ConversationState) {
  const text = transcript.toLowerCase().trim();
  const profile = { ...state.profile };
  let nextQuestionId = state.currentQuestionId;
  let isComplete = false;
  let navigationCommand = "none";
  let tamilResponse = "";

  // Check for global navigation commands first
  if (text.includes("அடுத்து") || text.includes("next") || text.includes("அடுத்தது")) {
    navigationCommand = "next";
  } else if (text.includes("முந்தையது") || text.includes("previous") || text.includes("பின்னே") || text.includes("முன்பு") || text.includes("go back")) {
    navigationCommand = "previous";
  } else if (text.includes("மீண்டும்") || text.includes("repeat") || text.includes("திரும்ப") || text.includes("திரும்பச் சொல்")) {
    navigationCommand = "repeat";
  } else if (text.includes("மேலும்") || text.includes("detail") || text.includes("விளக்கம்") || text.includes("tell me more")) {
    navigationCommand = "explain";
  } else if (text.includes("விண்ணப்பி") || text.includes("apply") || text.includes("விண்ணப்பிக்க")) {
    navigationCommand = "apply";
  } else if (text.includes("முகப்பு") || text.includes("menu") || text.includes("முதன்மை மெனு") || text.includes("main menu")) {
    navigationCommand = "menu";
  }

  if (navigationCommand !== "none") {
    return {
      profile,
      nextQuestionId,
      isComplete,
      navigationCommand,
      tamilResponse: ""
    };
  }

  // Question specific logic
  switch (state.currentQuestionId) {
    case "welcome":
      // The user gave their name
      // Extract name (simple cleaning)
      let name = transcript.replace(/(என் பெயர்|எனது பெயர்|பெயர்|nan|en peyar|my name is)/gi, "").trim();
      if (name.endsWith(".")) name = name.slice(0, -1);
      profile.name = name || "அன்பர்";
      nextQuestionId = "name";
      tamilResponse = QUESTIONS.name;
      break;

    case "name":
      // Extract age (look for numbers)
      const ageMatch = text.match(/\d+/);
      if (ageMatch) {
        profile.age = parseInt(ageMatch[0]);
        // Also check if senior citizen automatically
        profile.isSeniorCitizen = profile.age >= 60;
        nextQuestionId = "age";
        tamilResponse = QUESTIONS.age;
      } else {
        tamilResponse = "மன்னிக்கவும், உங்கள் வயதை எண்களில் கூறவும். உங்களது வயது என்ன? (Please state your age in numbers.)";
      }
      break;

    case "age":
      if (text.includes("பெண்") || text.includes("female") || text.includes("woman")) {
        profile.gender = "female";
        nextQuestionId = "gender";
        tamilResponse = QUESTIONS.gender;
      } else if (text.includes("ஆண்") || text.includes("male") || text.includes("man")) {
        profile.gender = "male";
        nextQuestionId = "gender";
        tamilResponse = QUESTIONS.gender;
      } else {
        tamilResponse = "தயவுசெய்து ஆண் அல்லது பெண் என்று தெளிவாகக் கூறவும். உங்கள் பாலினம் என்ன? (Please state male or female.)";
      }
      break;

    case "gender":
      // Extract district (simple mapping of common Tamil Nadu districts)
      const districts = ["chennai", "madurai", "coimbatore", "salem", "trichy", "tiruchirappalli", "thanjavur", "tirunelveli", "vellore", "kanyakumari", "erode", "thoothukudi", "dindigul"];
      let foundDistrict = "Chennai"; // Default fallback
      for (const d of districts) {
        if (text.includes(d) || text.includes(d.replace("coimbatore", "கோவை")) || text.includes("சென்னை") || text.includes("மதுரை") || text.includes("சேலம்") || text.includes("திருச்சி") || text.includes("கோவை")) {
          if (text.includes("சென்னை")) foundDistrict = "Chennai";
          else if (text.includes("மதுரை")) foundDistrict = "Madurai";
          else if (text.includes("சேலம்")) foundDistrict = "Salem";
          else if (text.includes("திருச்சி") || text.includes("tiruchirappalli")) foundDistrict = "Trichy";
          else if (text.includes("கோவை") || text.includes("coimbatore")) foundDistrict = "Coimbatore";
          else foundDistrict = d.charAt(0).toUpperCase() + d.slice(1);
          break;
        }
      }
      profile.district = foundDistrict;
      nextQuestionId = "district";
      tamilResponse = QUESTIONS.district;
      break;

    case "district":
      if (text.includes("ஆம்") || text.includes("ஆமாம்") || text.includes("yes") || text.includes("student") || text.includes("மாணவர்")) {
        profile.isStudent = true;
        profile.isFarmer = false; // mutually exclusive for simple branching
        nextQuestionId = "isStudent"; // Ask education level
        tamilResponse = QUESTIONS.isStudent;
      } else if (text.includes("இல்லை") || text.includes("no")) {
        profile.isStudent = false;
        nextQuestionId = "isFarmer"; // Skip education, ask if farmer
        tamilResponse = QUESTIONS.isFarmer;
      } else {
        tamilResponse = "தயவுசெய்து ஆம் அல்லது இல்லை என்று கூறவும். நீங்கள் ஒரு மாணவரா? (Please answer yes or no.)";
      }
      break;

    case "isStudent": // Studying school or college
      if (text.includes("பள்ளி") || text.includes("school")) {
        profile.education = "School";
      } else if (text.includes("கல்லூரி") || text.includes("college") || text.includes("ug") || text.includes("pg")) {
        profile.education = "Graduate";
      } else {
        profile.education = transcript || "School";
      }
      nextQuestionId = "education";
      tamilResponse = QUESTIONS.education;
      break;

    case "isFarmer":
      if (text.includes("ஆம்") || text.includes("ஆமாம்") || text.includes("yes") || text.includes("விவசாயி")) {
        profile.isFarmer = true;
        profile.occupation = "Farmer";
      } else if (text.includes("இல்லை") || text.includes("no")) {
        profile.isFarmer = false;
        profile.occupation = "Unemployed";
      } else {
        profile.occupation = transcript;
      }
      nextQuestionId = "education"; // Use same transition
      tamilResponse = QUESTIONS.education;
      break;

    case "education": // Annual Income question was asked
      const incomeMatch = text.match(/\d+/);
      if (incomeMatch) {
        profile.annualIncome = parseInt(incomeMatch[0]);
        // Also support lakhs
        if (text.includes("இலட்சம்") || text.includes("lakh") || text.includes("வட்டாரம்")) {
          profile.annualIncome = profile.annualIncome * 100000;
        }
        nextQuestionId = "annualIncome";
        tamilResponse = QUESTIONS.annualIncome;
      } else if (text.includes("ஐம்பதாயிரம்") || text.includes("50,000") || text.includes("50000")) {
        profile.annualIncome = 50000;
        nextQuestionId = "annualIncome";
        tamilResponse = QUESTIONS.annualIncome;
      } else {
        tamilResponse = "மன்னிக்கவும், உங்கள் ஆண்டு வருமானத்தை எண்களில் கூறவும். உங்கள் குடும்பத்தின் ஆண்டு வருமானம் எவ்வளவு? (Please state your annual income in numbers.)";
      }
      break;

    case "annualIncome": // Disability Status question was asked
      if (text.includes("ஆம்") || text.includes("ஆமாம்") || text.includes("yes") || text.includes("மாற்றுத்திறனாளி")) {
        profile.disabilityStatus = true;
        nextQuestionId = "disabilityStatus";
        tamilResponse = QUESTIONS.disabilityStatus;
        isComplete = true;
      } else if (text.includes("இல்லை") || text.includes("no")) {
        profile.disabilityStatus = false;
        nextQuestionId = "disabilityStatus";
        tamilResponse = QUESTIONS.disabilityStatus;
        isComplete = true;
      } else {
        tamilResponse = "தயவுசெய்து ஆம் அல்லது இல்லை என்று கூறவும். நீங்கள் மாற்றுத்திறனாளியா? (Please answer yes or no.)";
      }
      break;

    default:
      isComplete = true;
      break;
  }

  return {
    profile,
    nextQuestionId,
    isComplete,
    navigationCommand,
    tamilResponse
  };
}

export async function POST(request: Request) {
  try {
    const { transcript, state } = await request.json() as { transcript: string; state: ConversationState };
    
    if (!transcript || !state) {
      return NextResponse.json({ error: "Missing transcript or state" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      // Run Rules-based local parser in development
      const result = parseLocalIntent(transcript, state);
      return NextResponse.json(result);
    }

    // Call Claude API if API key is provided
    const anthropic = new Anthropic({ apiKey });
    
    const prompt = `
You are the NLU core of "Thovakkam AI", a voice-first government scheme discovery assistant for Tamil Nadu.
The user speaks to you in Tamil (often with English words mixed in).

Current Profile State:
${JSON.stringify(state.profile, null, 2)}

Current Question Asked:
"${state.currentQuestionId}" -> (Context: ${QUESTIONS[state.currentQuestionId as keyof typeof QUESTIONS] || ""})

User Spoken Input Transcript:
"${transcript}"

YOUR TASK:
1. Extract any relevant profile fields from the user input.
   Fields to collect:
   - name (string)
   - age (integer)
   - gender ("female" | "male" | "other")
   - district (string, e.g. "Chennai", "Madurai", "Salem")
   - isStudent (boolean)
   - education (string, e.g. "School", "Graduate")
   - isFarmer (boolean)
   - annualIncome (integer)
   - disabilityStatus (boolean)

2. Detect if the user is giving a global navigation command:
   - "next" (அடுத்தது / அடுத்து) -> Command: "next"
   - "previous" (முந்தையது / பின்பு / go back) -> Command: "previous"
   - "repeat" (மீண்டும் சொல் / திரும்பச் சொல்) -> Command: "repeat"
   - "explain" (விளக்கம் கூறு / மேலும் சொல் / tell me more) -> Command: "explain"
   - "apply" (விண்ணப்பி / apply) -> Command: "apply"
   - "menu" (முகப்பு / முதன்மை மெனு / main menu) -> Command: "menu"
   If no command detected, use "none".

3. Determine the next step:
   Adaptive branching questions to ask:
   - "welcome" -> If name gathered, next question: "name". Prompt: "உங்களது வயது என்ன?"
   - "name" -> If age gathered, next question: "age". Prompt: "உங்களது பாலினம் என்ன? ஆண் அல்லது பெண் என்று கூறுங்கள்."
   - "age" -> If gender gathered, next question: "gender". Prompt: "நீங்கள் எந்த மாவட்டத்தைச் சேர்ந்தவர்?"
   - "gender" -> If district gathered, next question: "district". Prompt: "நீங்கள் ஒரு மாணவரா? ஆம் அல்லது இல்லை என்று கூறுங்கள்."
   - "district" -> If isStudent is true, next: "isStudent". Prompt: "நீங்கள் என்ன படித்துக் கொண்டிருக்கிறீர்கள்? பள்ளி அல்லது கல்லூரி?"
                   If isStudent is false, next: "isFarmer". Prompt: "நீங்கள் விவசாயம் செய்கிறீர்களா? ஆம் அல்லது இல்லை என்று கூறுங்கள்."
   - "isStudent" -> If education gathered, next: "education". Prompt: "உங்கள் குடும்பத்தின் ஆண்டு வருமானம் எவ்வளவு?"
   - "isFarmer" -> If isFarmer gathered, next: "education". Prompt: "உங்கள் குடும்பத்தின் ஆண்டு வருமானம் எவ்வளவு?"
   - "education" -> If annualIncome gathered, next: "annualIncome". Prompt: "நீங்கள் மாற்றுத்திறனாளியா? ஆம் அல்லது இல்லை என்று கூறுங்கள்."
   - "annualIncome" -> If disabilityStatus gathered, next: "disabilityStatus" (final statement). Prompt: "நன்றி! உங்கள் சுயவிவரம் சேகரிக்கப்பட்டது..." (mark isComplete: true)

4. Handle STT/meaning errors gracefully: if the user input does not make sense for the question asked, ask them politely in Tamil to repeat it (keeping nextQuestionId and profile unchanged).

You MUST respond ONLY with a JSON object. No Markdown block, no backticks, no other text.
Format:
{
  "profile": { ...updated profile fields... },
  "nextQuestionId": "name" | "age" | "gender" | "district" | "isStudent" | "education" | "isFarmer" | "annualIncome" | "disabilityStatus" | "complete",
  "isComplete": true | false,
  "navigationCommand": "next" | "previous" | "repeat" | "explain" | "apply" | "menu" | "none",
  "tamilResponse": "Speakable Tamil prompt to read aloud"
}
`;

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 800,
      temperature: 0,
      system: "You are an API endpoint that only returns raw JSON.",
      messages: [{ role: "user", content: prompt }]
    });

    const contentText = message.content[0].type === "text" ? message.content[0].text : "";
    
    // Clean JSON wrappers if LLM returned backticks
    const cleanedJson = contentText.replace(/```json/g, "").replace(/```/g, "").trim();
    const result = JSON.parse(cleanedJson);

    return NextResponse.json(result);

  } catch (error: any) {
    console.error("Error in NLU API route:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

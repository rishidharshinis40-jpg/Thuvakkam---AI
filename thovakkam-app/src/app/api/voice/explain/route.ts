import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import Anthropic from "@anthropic-ai/sdk";

const prisma = new PrismaClient();

// Helper to clean up documents JSON string
function getDocumentsList(docsJson: string): string {
  try {
    const list = JSON.parse(docsJson);
    if (Array.isArray(list)) return list.join(", ");
  } catch (e) {}
  return docsJson;
}

// Rule-based fallback for local execution when no Claude API key is supplied
function getLocalExplanationOrAnswer(
  scheme: any, 
  question: string | null, 
  isFollowUp: boolean
): string {
  const docs = getDocumentsList(scheme.requiredDocuments);
  const deadline = scheme.lastDate ? scheme.lastDate : "விண்ணப்பிக்க குறிப்பிட்ட காலக்கெடு எதுவும் இல்லை";
  
  if (!isFollowUp) {
    // Generate initial 3-4 sentence Tamil explanation grounded in DB data
    return `நீங்கள் "${scheme.name}" திட்டத்திற்குத் தகுதியானவர். இத்திட்டத்தின் கீழ் உங்களுக்கு, ${scheme.benefits} போன்ற பலன்கள் கிடைக்கும். விண்ணப்பிக்கத் தேவைப்படும் ஆவணங்கள்: ${docs}. இந்த திட்டத்திற்கு ${scheme.officialLink ? 'இணையதளத்தின் மூலமாகவோ' : 'அலுவலகத்தின் மூலமாகவோ'} விண்ணப்பிக்கலாம்.`;
  }

  const query = (question || "").toLowerCase();

  // Route follow-up question
  if (query.includes("ஆவணம்") || query.includes("என்ன தேவை") || query.includes("document") || query.includes("சான்றிதழ்")) {
    return `இத்திட்டத்திற்குத் தேவைப்படும் ஆவணங்கள்: ${docs} ஆகும்.`;
  }
  
  if (query.includes("தேதி") || query.includes("எப்போது") || query.includes("deadline") || query.includes("date") || query.includes("கடைசி")) {
    return `விண்ணப்பிக்க வேண்டிய கடைசி தேதி: ${deadline} ஆகும்.`;
  }

  if (query.includes("பலன்") || query.includes("தொகை") || query.includes("உதவி") || query.includes("benefit") || query.includes("amount") || query.includes("கிடைக்கும்")) {
    return `இத்திட்டத்தின் பலன்கள்: ${scheme.benefits} ஆகும்.`;
  }

  if (query.includes("எப்படி") || query.includes("முறை") || query.includes("விண்ணப்ப") || query.includes("apply") || query.includes("செய்வது")) {
    return `விண்ணப்பிக்கும் முறை: ${scheme.applicationProcedure}. ${scheme.officialLink ? 'இதன் இணையதள இணைப்பு: ' + scheme.officialLink : ''}`;
  }

  if (query.includes("துறை") || query.includes("அலுவலகம்") || query.includes("பிரிவு") || query.includes("department") || query.includes("office")) {
    return `இந்தத் திட்டம் "${scheme.department}" துறையால் நடத்தப்படுகிறது.`;
  }

  // Generic grounded fallback
  return `மன்னிக்கவும், இக்கேள்விக்கு என்னிடம் நேரடி பதில் இல்லை. இந்த திட்டம் குறித்து நீங்கள் கேட்ட விவரம்: ${scheme.description}. பலன்கள்: ${scheme.benefits}. விண்ணப்பிக்க கடைசி தேதி ${deadline}.`;
}

export async function POST(request: Request) {
  try {
    const { schemeId, question, isFollowUp } = await request.json() as {
      schemeId: string;
      question: string | null;
      isFollowUp: boolean;
    };

    if (!schemeId) {
      return NextResponse.json({ error: "Missing schemeId" }, { status: 400 });
    }

    // Fetch the scheme details from the DB
    const scheme = await prisma.scheme.findUnique({
      where: { id: schemeId }
    });

    if (!scheme) {
      return NextResponse.json({ error: "Scheme not found" }, { status: 404 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      // Local fallback
      const tamilExplanation = getLocalExplanationOrAnswer(scheme, question, isFollowUp);
      return NextResponse.json({ response: tamilExplanation });
    }

    // Claude API path
    const anthropic = new Anthropic({ apiKey });
    
    let prompt = "";
    
    if (!isFollowUp) {
      prompt = `
You are the voice assistant "Thovakkam AI". 
Generate a natural, conversational Tamil explanation (3 to 4 short sentences) explaining why the user is eligible, the benefits they will get, the documents needed, and how to apply.
Base your response STRICTLY on the following database record. Do NOT invent dates, links, or amounts.

Scheme Name: ${scheme.name}
Description: ${scheme.description}
Benefits: ${scheme.benefits}
Required Documents: ${scheme.requiredDocuments}
Application Procedure: ${scheme.applicationProcedure}
Deadline: ${scheme.lastDate || "None"}
Department: ${scheme.department}
Official Link: ${scheme.officialLink || "None"}

Write only the Tamil text response to be read aloud via Text-to-Speech.
`;
    } else {
      prompt = `
You are the voice assistant "Thovakkam AI". 
Answering a citizen's follow-up question regarding a specific scheme. 
Grounded STRICTLY in the scheme database record provided below. If the answer is not in the record, state that you do not have that specific information in Tamil. Do NOT hallucinate.

Scheme Record:
Scheme Name: ${scheme.name}
Description: ${scheme.description}
Benefits: ${scheme.benefits}
Required Documents: ${scheme.requiredDocuments}
Application Procedure: ${scheme.applicationProcedure}
Deadline: ${scheme.lastDate || "None"}
Department: ${scheme.department}
Official Link: ${scheme.officialLink || "None"}

User's Follow-up Question:
"${question}"

Write only the Tamil response to the user. Keep it to 1 or 2 concise, clear sentences.
`;
    }

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 500,
      temperature: 0,
      messages: [{ role: "user", content: prompt }]
    });

    const responseText = message.content[0].type === "text" ? message.content[0].text : "";
    return NextResponse.json({ response: responseText.trim() });

  } catch (error: any) {
    console.error("Error in explain API route:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

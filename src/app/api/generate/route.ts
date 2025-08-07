import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    response_mime_type: "application/json",
  },
});

export async function POST(req: NextRequest) {
  try {
    const { character_name, traits, age, gender, language } = await req.json();

    if (!character_name || !traits || !gender || !language) {
      return NextResponse.json(
        { error: "Missing required character data." },
        { status: 400 }
      );
    }

    const prompt = `
You are a multilingual AI story writer and character developer.

🧠 Your job is to generate an engaging, imaginative NPC character background and setup, based on user input.

🎯 OUTPUT FORMAT:
Your response must be a single valid JSON object in the following structure, using line breaks (\\n) inside values as needed:

{
  "backstory": "2–3 paragraphs about the character’s origin, motivations, and past life.",
  "story_context": "A 2-paragraph description of the current world/situation the character is in (sci-fi, fantasy, dystopia, etc.).",
  "starting_propt": "A single sentence that begins the player's interaction with the character.",
  "start_options": [
    "First possible player choice or reply",
    "Second creative alternative",
    "Third mysterious or cautious reply"
  ],
  "ending_scenes": [
    "A happy or triumphant ending",
    "A tragic or emotional ending",
    "An ambiguous or philosophical ending"
  ]
}

📌 CHARACTER PROFILE:
- Name: ${character_name}
- Traits: ${traits.join(", ")}
- Age: ${age || "Unknown"}
- Gender: ${gender}

🌍 LANGUAGE:
Generate the entire output in: ${language}

Do not write anything outside the JSON object. Return only the JSON.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    const generatedJson = JSON.parse(text);
    return NextResponse.json(generatedJson);
  } catch (error) {
    console.error("Error in /api/generate route:", error);
    const message =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json(
      { error: "Failed to generate story.", details: message },
      { status: 500 }
    );
  }
}

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// Initialize the Gemini client with the API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// --- FIX: Configure the model to use JSON Mode ---
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    response_mime_type: "application/json",
  },
});
// --- End of Fix ---

export async function POST(req: NextRequest) {
  try {
    const { character_name, traits, age, gender } = await req.json();

    if (!character_name || !traits || !gender) {
      return NextResponse.json(
        { error: "Missing required character data." },
        { status: 400 }
      );
    }

    const prompt = `
        You are a creative storyteller and character designer. Based on the following character details, generate a compelling story foundation.

        Character Details:
        - Name: ${character_name}
        - Traits: ${traits.join(", ")}
        - Age: ${age || "Not specified"}
        - Gender: ${gender}

        Your output MUST be a single, valid JSON object with the following structure. Use \\n for new paragraphs inside string values.

        {
          "backstory": "A brief, engaging backstory (2-3 paragraphs) explaining the character's origin and motivations based on their traits.",
          "story_context": "A description of the current situation or world the character finds themselves in (2 paragraphs). This should set the stage for an adventure.",
          "starting_propt": "A single, compelling sentence that kicks off the story. This should be the first line of the narrative.",
          "start_options": [
            "A creative and plausible first action the user can take.",
            "A different, contrasting second action the user can take.",
            "A more mysterious or cautious third action the user can take."
          ],
          "ending_scenes": [
            "A potential happy or triumphant ending for the character.",
            "A potential tragic or somber ending for the character.",
            "A potential ambiguous or open-ended conclusion for the story."
          ]
        }
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // With JSON mode, the text is guaranteed to be a parsable JSON string.
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

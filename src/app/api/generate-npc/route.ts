import { GoogleGenerativeAI } from "@google/generative-ai";
import { jsonrepair } from "jsonrepair";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("=== API ROUTE CALLED ===");
  console.log("GEMINI_API_KEY exists:", !!process.env.GEMINI_API_KEY);

  try {
    const body = await req.json();
    console.log("📝 Request body received:", JSON.stringify(body, null, 2));

    const {
      character_name,
      age,
      gender,
      traits,
      backstory,
      story_context,
      voice_name,
      language,
      starting_prompt,
    } = body;

    console.log("🔍 Extracted fields:");
    console.log("- character_name:", character_name);
    console.log("- age:", age);
    console.log("- gender:", gender);
    console.log("- traits:", traits);
    console.log("- backstory:", backstory);
    console.log("- story_context:", story_context);
    console.log("- voice_name:", voice_name);
    console.log("- language:", language);
    console.log("- starting_prompt:", starting_prompt);

    // Check for required fields
    if (!character_name || !traits || !Array.isArray(traits)) {
      console.log("❌ Missing required fields");
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields: character_name and traits are required",
        },
        { status: 400 }
      );
    }

    const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = ai.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 3000,
      },
    });

    console.log("🤖 Calling Google AI with prompt...");

    const prompt = `
You are an AI NPC in a 2D retro RPG game.

Character:
- Name: ${character_name}
- Age: ${age || "Unknown"}
- Gender: ${gender || "Unknown"}
- Traits: ${traits.join(", ")}
- Backstory: ${backstory || "No backstory provided"}
- Story Context: ${story_context || "No story context provided"}
- Voice Style: ${voice_name || "Default"}
- Language: ${language || "English"}   

Current Prompt: ${starting_prompt || "Begin the conversation"}

Return the following **exact JSON** format:
{
  "npc_dialogue": [
    "First sentence.",
    "Second sentence.",
    "Third sentence."
  ],
  "player_options": [
    "First player reply.",
    "Second player reply.",
    "Third player reply."
  ]
}

Rules:
- Only return the JSON (no code block, no commentary).
- Each sentence must be one element of the npc_dialogue array.
- Only 3 player options.
- Dialogue should reflect the character's traits, story, and tone.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;

    console.log("🎯 AI Response received:", response.text());

    try {
      const responseText = response.text();
      if (!responseText) {
        console.log("❌ AI returned no response");
        return NextResponse.json({
          success: false,
          error: "AI did not return any response",
        });
      }

      const fixed = jsonrepair(responseText);
      console.log("🔧 JSON repaired:", fixed);

      const parsed = JSON.parse(fixed);
      console.log("✅ JSON parsed successfully:", parsed);

      return NextResponse.json({
        success: true,
        npc_dialogue: parsed.npc_dialogue,
        player_options: parsed.player_options,
      });
    } catch (parseError) {
      console.log("❌ JSON parse error:", parseError);
      const responseText = response.text();
      return NextResponse.json({
        success: false,
        error: "AI returned incomplete or invalid JSON",
        raw: responseText,
      });
    }
  } catch (error) {
    console.error("❌ API Route Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

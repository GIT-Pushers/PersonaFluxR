import { GoogleGenAI } from "@google/genai";
import { jsonrepair } from "jsonrepair";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log(process.env.GEMINI_API_KEY);
  const body = await req.json();
  console.log(body);

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

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: [
      {
        parts: [
          {
            text: `
You are an AI NPC in a 2D retro RPG game.

Character:
- Name: ${character_name}
- Age: ${age}
- Gender: ${gender}
- Traits: ${traits.join(", ")}
- Backstory: ${backstory}
- Story Context: ${story_context}
- Voice Style: ${voice_name}
- Language: ${language}

Current Prompt: ${starting_prompt}

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
            `,
          },
        ],
      },
    ],
    config: {
      maxOutputTokens: 1024,
      temperature: 0.6,
    },
  });

  try {
    if (!response.text) {
      return Response.json({
        success: false,
        error: "AI did not return any response",
      });
    }

    const fixed = jsonrepair(response.text);
    const parsed = JSON.parse(fixed);

    return Response.json({
      success: true,
      npc_dialogue: parsed.npc_dialogue,
      player_options: parsed.player_options,
    });
  } catch {
    return Response.json({
      success: false,
      error: "AI returned incomplete or invalid JSON",
      raw: response.text,
    });
  }
}

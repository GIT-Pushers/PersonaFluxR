import { createClient } from "@/utils/supabase/client";

// The interface now expects 'user_email' instead of 'user_id'.
export interface CharacterInsertData {
  character_name: string;
  traits: string[];
  age?: number;
  gender: string;
  voice_name: string;
  no_of_scenes: number;
  language: string;
  avatar_url?: string | null;
  backstory?: string;
  story_context?: string;
  starting_prompt?: string;
  start_options: string[];
  ending_scenes: string[];
  user_email?: string; // Changed from user_id to user_email
}

/**
 * Inserts a new character record into the Supabase 'characters' table.
 * @param characterData - An object containing the character's details.
 * @returns An object with the inserted data or an error.
 */
export async function createCharacter(characterData: CharacterInsertData) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("characters")
    .insert([characterData])
    .select()
    .single();

  if (error) {
    console.error("Supabase insert error:", error.message);
    return { data: null, error };
  }

  console.log("Character successfully created in Supabase:", data);
  return { data, error: null };
}

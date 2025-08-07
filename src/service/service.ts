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
  starting_propt?: string; // Keep the typo to match database schema
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
export async function getCharactersByEmail(email: string) {
  // Ensure an email is provided to prevent unnecessary queries.
  if (!email) {
    return { data: null, error: new Error("Email address is required.") };
  }

  const supabase = createClient();

  // Use .select() to get all columns and .eq() to filter by the email column.
  // Unlike .single(), this will return an array of all matching characters.
  const { data, error } = await supabase
    .from("characters")
    .select("*")
    .eq("email", email);

  // Handle any potential errors during the fetch operation.
  if (error) {
    console.error("Supabase fetch error:", error.message);
    return { data: null, error };
  }

  console.log(`Found ${data.length} characters for ${email}:`, data);
  return { data, error: null };
}
export async function getCharacterById(id: number) {
  // Ensure an ID is a valid number before querying.
  if (typeof id !== "number" || isNaN(id)) {
    return {
      data: null,
      error: new Error("A valid character ID number is required."),
    };
  }

  const supabase = createClient();

  // Use .select() to get all columns.
  // Use .eq('id', id) to filter for the specific character.
  // Use .single() because we expect only one result for a unique ID.
  const { data, error } = await supabase
    .from("characters")
    .select("*")
    .eq("id", id)
    .single();

  // Handle any potential errors during the fetch operation.
  if (error) {
    console.error("Supabase fetch error:", error.message);
    return { data: null, error };
  }

  console.log(`Successfully fetched character ${id}:`, data);
  return { data, error: null };
}

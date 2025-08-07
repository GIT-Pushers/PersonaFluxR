"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getCharacterById } from "@/service/service"; // Adjust the import path as needed

// Define a type for the character data to ensure type safety
interface Character {
  id: number;
  character_name: string;
  // Add any other character fields you might need
  [key: string]: any;
}

const StartGame = () => {
  const { id } = useParams();
  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // The ID from useParams can be a string or an array of strings.
    // We need to handle this and parse it to a number.
    const characterId = Array.isArray(id) ? id[0] : id;
    const numericId = parseInt(characterId as string, 10);

    if (isNaN(numericId)) {
      setError("Invalid character ID provided in the URL.");
      setIsLoading(false);
      return;
    }

    const fetchCharacter = async () => {
      try {
        const { data, error: fetchError } = await getCharacterById(numericId);

        if (fetchError) {
          throw fetchError; // Throw the error to be caught by the catch block
        }

        if (data) {
          setCharacter(data as Character);
        } else {
          setError("Character not found.");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacter();
  }, [id]); // Re-run the effect if the ID in the URL changes

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Loading game...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-red-500">Error: {error}</p>
      </div>
    );
  }
  console.log(character);
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">
        Starting Game with: {character?.character_name}
      </h1>
      {/* You can now build your game UI using the fetched character data */}
      <pre className="bg-gray-100 p-4 rounded-lg mt-6">
        {JSON.stringify(character, null, 2)}
      </pre>
    </div>
  );
};

export default StartGame;

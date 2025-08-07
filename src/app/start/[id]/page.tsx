"use client";

import React,{ useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getCharacterById } from "@/service/service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertTriangle, ArrowRight } from "lucide-react";

// Define a more comprehensive type for the character data
interface Character {
  id: number;
  character_name: string;
  avatar_url: string | null;
  traits: string[];
  backstory: string;
  story_context: string;
  starting_propt?: string;
  start_options: string[];
  no_of_scenes: number;
}

// Type for a single story scene
interface Scene {
  text: string;
  options: string[];
}

const StartGame = () => {
  const { id } = useParams();
  const router = useRouter();

  // Game State
  const [character, setCharacter] = useState<Character | null>(null);
  const [storyHistory, setStoryHistory] = useState<string[]>([]);
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);
  const [currentScene, setCurrentScene] = useState(1);
  const [isGameFinished, setIsGameFinished] = useState(false);

  // Loading and Error States
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initial character data fetching
  useEffect(() => {
    const characterId = Array.isArray(id) ? id[0] : id;
    const numericId = parseInt(characterId, 10);

    if (isNaN(numericId)) {
      setError("Invalid character ID provided.");
      setIsLoading(false);
      return;
    }

    const fetchCharacter = async () => {
      try {
        const { data, error: fetchError } = await getCharacterById(numericId);
        if (fetchError) throw fetchError;
        if (data) {
          const char = data as Character;
          setCharacter(char);
          // Initialize the game with the character's starting prompt and options
          setStoryHistory([char.starting_propt || "The adventure begins..."]);
          setCurrentOptions(char.start_options || []);
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
  }, [id]);

  // Function to handle the user's choice and get the next scene from the AI
  const handleOptionSelect = async (selectedOption: string) => {
    if (!character || isGenerating) return;

    setIsGenerating(true);
    setError(null);

    // Construct the prompt for the AI
    const prompt = `
      Character Profile:
      - Name: ${character.character_name}
      - Traits: ${character.traits.join(", ")}
      - Backstory: ${character.backstory}

      Story So Far (last 2 events):
      ${storyHistory.slice(-2).join("\n---\n")}

      The user just chose to: "${selectedOption}"

      Based on this, continue the story. 
      1. Write the next paragraph of the story. It should be an engaging continuation of the last event.
      2. After the story paragraph, generate three new, distinct, and compelling choices for the user to make.
      
      Format your response as a JSON object with two keys: "story" and "options" (an array of three strings).
      Example: {"story": "The dragon roars...", "options": ["Attack the dragon", "Try to calm it", "Run away"]}
    `;

    try {
      // This is where you would make the actual API call to your AI model (e.g., Gemini)
      // For demonstration, we'll simulate the API call and response.
      // In a real implementation, replace this with a fetch call to your backend or directly to the AI service.
      const aiResponse = await generateStoryWithAI(prompt);

      setStoryHistory([...storyHistory, selectedOption, aiResponse.story]);
      setCurrentOptions(aiResponse.options);

      if (currentScene >= character.no_of_scenes) {
        setIsGameFinished(true);
      } else {
        setCurrentScene(currentScene + 1);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate next scene."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // --- MOCK AI FUNCTION (Replace with your actual API call) ---
  const generateStoryWithAI = async (
    prompt: string
  ): Promise<{ story: string; options: string[] }> => {
    console.log("Sending prompt to AI:", prompt);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mocked responses for demonstration
    const responses = [
      {
        story:
          "The old gatekeeper nods slowly, his eyes twinkling with a mix of suspicion and amusement. 'A bold choice,' he rasps. 'The path ahead is fraught with peril, but also with great reward. Your first challenge lies just beyond this gate.'",
        options: [
          "Ask about the peril.",
          "Ask about the reward.",
          "Politely thank him and proceed.",
        ],
      },
      {
        story:
          "You step through the gates into a moonlit forest. The air is thick with an unnatural silence. Suddenly, a low growl echoes from the shadows to your left.",
        options: [
          "Draw your weapon and face the sound.",
          "Light a torch to see better.",
          "Quietly back away.",
        ],
      },
      {
        story:
          "From the darkness emerges a creature of shadow and fang. It lunges, and you narrowly dodge its attack. It's clear this beast won't be reasoned with.",
        options: ["Look for a high place to climb.", "Throw a rock to distract it.", "Prepare for a direct fight."],
      },
    ];
    // Return a random response for variety in this demo
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // --- RENDER LOGIC ---

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-xl text-muted-foreground">Loading Your Story...</p>
      </div>
    );
  }

  if (error && !isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold">An Error Occurred</h2>
        <p className="text-muted-foreground mt-2">{error}</p>
        <Button onClick={() => router.push("/dashboard")} className="mt-6">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  if (!character) return null;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Character Info Panel */}
      <aside className="w-full md:w-1/3 lg:w-1/4 bg-muted/50 p-6 border-b md:border-r">
        <div className="sticky top-6">
          <div className="relative aspect-square w-full max-w-xs mx-auto rounded-lg overflow-hidden mb-4">
            <Image
              src={
                character.avatar_url ||
                `https://placehold.co/400x400/27272a/e5e5e5?text=${character.character_name.charAt(
                  0
                )}`
              }
              alt={character.character_name}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <h2 className="text-2xl font-bold text-center">{character.character_name}</h2>
          <div className="flex flex-wrap gap-2 justify-center my-4">
            {character.traits.map((trait) => (
              <Badge key={trait} variant="secondary">{trait}</Badge>
            ))}
          </div>
          <div className="text-center text-sm text-muted-foreground mt-4">
            Scene: {currentScene} / {character.no_of_scenes}
          </div>
        </div>
      </aside>

      {/* Main Story Panel */}
      <main className="w-full md:w-2/3 lg:w-3/4 p-6 md:p-10 flex flex-col">
        <div className="flex-grow space-y-6">
            <h1 className="text-3xl font-bold border-b pb-4 mb-6">The Adventure Unfolds</h1>
            {storyHistory.map((text, index) => (
                <div key={index} className={`p-4 rounded-lg ${index % 2 === 1 ? 'bg-primary/10 text-right' : 'bg-muted/50'}`}>
                    <p className="text-lg leading-relaxed">{text}</p>
                     {index % 2 === 1 && <p className="text-sm text-muted-foreground mt-1">Your Choice</p>}
                </div>
            ))}
        </div>

        <div className="mt-auto pt-10">
          {isGameFinished ? (
             <div className="text-center p-6 bg-muted rounded-lg">
                <h2 className="text-2xl font-bold">The End</h2>
                <p className="mt-2 text-muted-foreground">Your journey with {character.character_name} has concluded.</p>
                <Button onClick={() => router.push('/dashboard')} className="mt-6">
                    Return to Dashboard
                </Button>
             </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">What do you do next?</h3>
              {currentOptions.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="lg"
                  className="w-full justify-start text-left h-auto py-3"
                  onClick={() => handleOptionSelect(option)}
                  disabled={isGenerating}
                >
                  <ArrowRight className="mr-4 h-5 w-5 text-primary" />
                  {option}
                </Button>
              ))}
            </div>
          )}
           {isGenerating && (
                <div className="flex items-center justify-center mt-6">
                    <Loader2 className="h-6 w-6 animate-spin mr-3"/>
                    <p className="text-muted-foreground">The storyteller is thinking...</p>
                </div>
            )}
            {error && isGenerating && (
                 <p className="text-sm text-destructive mt-4 text-center">{error}</p>
            )}
        </div>
      </main>
    </div>
  );
};

export default StartGame;

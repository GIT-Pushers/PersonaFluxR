"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { getCharactersByEmail } from "@/service/service"; // Adjust the import path

// Import Shadcn/UI components
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Play, Eye } from "lucide-react";

// Define a type for the character data to ensure type safety
interface Character {
  id: number; // Changed to number to match the database schema
  character_name: string;
  avatar_url: string | null;
  traits: string[];
  backstory: string;
  story_context: string;
  age?: number;
  gender: string;
  voice_name: string;
  no_of_scenes: number;
  language: string;
  starting_propt?: string;
  start_options: string[];
  ending_scenes: string[];
}

const Dashboard = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndCharacters = async () => {
      const supabase = createClient();
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!user?.email) throw new Error("User not logged in.");

        const { data: characterData, error: characterError } =
          await getCharactersByEmail(user.email);

        if (characterError) throw characterError;

        if (characterData) {
          setCharacters(characterData as Character[]);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndCharacters();
  }, []);

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <Card key={index} className="overflow-hidden animate-pulse">
          <div className="w-full h-48 bg-muted"></div>
          <CardHeader>
            <div className="h-6 w-3/4 bg-muted rounded"></div>
          </CardHeader>
          <CardFooter className="p-4">
            <div className="h-10 w-full bg-muted rounded"></div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Character Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              View, manage, and create your characters.
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => router.push("/create-character")}
            className="w-full sm:w-auto"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Create New Character
          </Button>
        </header>

        <main>
          {isLoading ? (
            <LoadingSkeleton />
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-destructive font-semibold">Error: {error}</p>
            </div>
          ) : characters.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
              <h2 className="text-xl font-semibold">No Characters Found</h2>
              <p className="text-muted-foreground mt-2">
                Get started by creating your first character.
              </p>
              <Button
                onClick={() => router.push("/create-character")}
                className="mt-6"
              >
                Create Character
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {characters.map((char) => (
                <Card key={char.id} className="overflow-hidden flex flex-col">
                  <CardContent className="p-0">
                    <div className="relative w-full h-48">
                      <Image
                        src={
                          char.avatar_url ||
                          `https://placehold.co/400x400/27272a/e5e5e5?text=${char.character_name.charAt(
                            0
                          )}`
                        }
                        alt={char.character_name}
                        fill
                        style={{ objectFit: "cover" }}
                        className="bg-muted"
                      />
                    </div>
                  </CardContent>
                  <CardHeader className="flex-grow">
                    <CardTitle className="truncate">
                      {char.character_name}
                    </CardTitle>
                  </CardHeader>
                  <CardFooter className="p-4 grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedCharacter(char)}
                    >
                      <Eye className="mr-2 h-4 w-4" /> Details
                    </Button>
                    <Button
                      onClick={() => router.push(`/start/${char.id}`)}
                    >
                      <Play className="mr-2 h-4 w-4" /> Play
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Character Details Dialog */}
      <Dialog
        open={!!selectedCharacter}
        onOpenChange={(isOpen) => !isOpen && setSelectedCharacter(null)}
      >
        <DialogContent className="sm:max-w-[425px] md:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedCharacter?.character_name}
            </DialogTitle>
            <DialogDescription>
              Character details and backstory.
            </DialogDescription>
          </DialogHeader>
          {selectedCharacter && (
            <>
              <div className="py-4 space-y-6 max-h-[60vh] overflow-y-auto pr-4">
                <div className="relative w-full h-60 rounded-lg overflow-hidden">
                  <Image
                    src={
                      selectedCharacter.avatar_url ||
                      `https://placehold.co/600x600/27272a/e5e5e5?text=${selectedCharacter.character_name.charAt(
                        0
                      )}`
                    }
                    alt={selectedCharacter.character_name}
                    fill
                    style={{ objectFit: "cover" }}
                    className="bg-muted"
                  />
                </div>

                <div>
                  <h3 className="font-semibold mb-2 text-lg">Core Details</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm p-3 bg-muted/50 rounded-lg">
                    <p>
                      <span className="font-medium text-foreground">
                        Gender:
                      </span>{" "}
                      {selectedCharacter.gender}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">Age:</span>{" "}
                      {selectedCharacter.age || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">
                        Language:
                      </span>{" "}
                      {selectedCharacter.language}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">
                        Voice:
                      </span>{" "}
                      {selectedCharacter.voice_name}
                    </p>
                    <p className="col-span-2">
                      <span className="font-medium text-foreground">
                        Story Length:
                      </span>{" "}
                      {selectedCharacter.no_of_scenes} scenes
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 text-lg">Traits</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCharacter.traits.map((trait) => (
                      <Badge
                        key={trait}
                        variant="secondary"
                        className="text-base"
                      >
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 text-lg">Backstory</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedCharacter.backstory || "No backstory provided."}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 text-lg">Story Context</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedCharacter.story_context ||
                      "No story context provided."}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 text-lg">
                    Starting Prompt
                  </h3>
                  <p className="text-sm text-muted-foreground italic border-l-4 pl-3">
                    "{selectedCharacter.starting_propt || "No prompt provided."}
                    "
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 text-lg">
                    Starting Choices
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {selectedCharacter.start_options?.length > 0 ? (
                      selectedCharacter.start_options.map((opt, i) => (
                        <li key={i}>{opt}</li>
                      ))
                    ) : (
                      <li>No starting options provided.</li>
                    )}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 text-lg">
                    Potential Endings
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {selectedCharacter.ending_scenes?.length > 0 ? (
                      selectedCharacter.ending_scenes.map((scene, i) => (
                        <li key={i}>{scene}</li>
                      ))
                    ) : (
                      <li>No potential endings provided.</li>
                    )}
                  </ul>
                </div>
              </div>
              <DialogFooter>
                <Button
                  className="w-full"
                  onClick={() =>
                    router.push(`/start/${selectedCharacter.id}`)
                  }
                >
                  <Play className="mr-2 h-4 w-4" /> Play Story
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;

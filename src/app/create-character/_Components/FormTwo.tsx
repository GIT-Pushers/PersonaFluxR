import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, X } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { UseFormReturn } from "react-hook-form";
interface CharacterFormData {
  character_name: string;
  traits: string[];
  age?: number | "";
  gender: string;
  voice_name: string;
  no_of_scenes: string;
  language: string;
  avatar?: FileList;
  backstory?: string;
  story_context?: string;
  starting_propt?: string;
  start_options: string[];
  ending_scenes: string[];
}
export const StepTwoForm = ({
  form,
  prevStep,
  imagePreview,
  setImagePreview,
  onGenerate,
  isGenerating,
  isSubmitting, // New prop for submission loading state
}: {
  form: UseFormReturn<CharacterFormData>;
  prevStep: () => void;
  imagePreview: string | null;
  setImagePreview: React.Dispatch<React.SetStateAction<string | null>>;
  onGenerate: () => void;
  isGenerating: boolean;
  isSubmitting: boolean; // New prop type
}) => {
  const avatarFileRef = useRef<HTMLInputElement>(null);
  const avatarRegister = form.register("avatar");

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <Alert>
        <Sparkles className="h-4 w-4" />
        <AlertTitle>Feeling Uninspired?</AlertTitle>
        <AlertDescription className="flex items-center justify-between gap-4">
          Let AI build a creative foundation for your character.
          <Button
            type="button"
            size="sm"
            onClick={onGenerate}
            disabled={isGenerating || isSubmitting}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
              </>
            ) : (
              "Generate with AI"
            )}
          </Button>
        </AlertDescription>
      </Alert>

      <fieldset disabled={isGenerating || isSubmitting} className="space-y-6">
        <FormItem>
          <FormLabel>Character Image (Avatar)</FormLabel>
          <FormControl>
            <Input
              type="file"
              accept="image/*"
              className="file:text-foreground"
              {...avatarRegister}
              ref={(e) => {
                avatarRegister.ref(e);
                avatarFileRef.current = e;
              }}
              onChange={(e) => {
                avatarRegister.onChange(e);
                if (e.target.files?.[0]) {
                  setImagePreview(URL.createObjectURL(e.target.files[0]));
                } else {
                  setImagePreview(null);
                }
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>

        {imagePreview && (
          <div className="relative w-40 h-40 mx-auto rounded-lg overflow-hidden">
            <Image
              src={imagePreview}
              alt="Avatar Preview"
              fill
              style={{ objectFit: "cover" }}
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-7 w-7 rounded-full z-10"
              onClick={() => {
                form.resetField("avatar");
                if (avatarFileRef.current) {
                  avatarFileRef.current.value = "";
                }
                setImagePreview(null);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <FormField
          control={form.control}
          name="backstory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Backstory</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the character's past..."
                  rows={6}
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="story_context"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Story Context</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What is the character's current situation?"
                  rows={4}
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="starting_propt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Starting Prompt</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="The first line of dialogue or action..."
                  rows={3}
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="space-y-4 rounded-lg border p-4">
          <FormLabel className="text-base">Starting Options</FormLabel>
          <FormField
            control={form.control}
            name="start_options.0"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-normal text-muted-foreground">
                  Option 1
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="First choice for the user..."
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="start_options.1"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-normal text-muted-foreground">
                  Option 2
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Second choice for the user..."
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="start_options.2"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-normal text-muted-foreground">
                  Option 3
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Third choice for the user..."
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4 rounded-lg border p-4">
          <FormLabel className="text-base">Ending Scenes (Optional)</FormLabel>
          <FormField
            control={form.control}
            name="ending_scenes.0"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-normal text-muted-foreground">
                  Ending Scene 1
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="A potential concluding scene..."
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ending_scenes.1"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-normal text-muted-foreground">
                  Ending Scene 2
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="An alternative concluding scene..."
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ending_scenes.2"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-normal text-muted-foreground">
                  Ending Scene 3
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Another alternative concluding scene..."
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </fieldset>

      <div className="flex justify-between items-center pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button type="submit" size="lg" disabled={isGenerating || isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
            </>
          ) : (
            "Create Character"
          )}
        </Button>
      </div>
    </div>
  );
};

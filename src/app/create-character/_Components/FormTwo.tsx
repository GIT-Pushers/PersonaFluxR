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
import { X } from "lucide-react";
import Image from "next/image";
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
  start_options?: string;
}
export const StepTwoForm = ({
  form,
  prevStep,
  imagePreview,
  setImagePreview,
}: {
  form: UseFormReturn<CharacterFormData>;
  prevStep: () => void;
  imagePreview: string | null;
  setImagePreview: React.Dispatch<React.SetStateAction<string | null>>;
}) => (
  <div className="space-y-6 animate-in fade-in-50 duration-500">
    <FormField
      control={form.control}
      name="avatar"
      render={({ field: { onChange, value, ...rest } }) => (
        <FormItem>
          <FormLabel>Character Image (Avatar)</FormLabel>
          <FormControl>
            <Input
              type="file"
              accept="image/*"
              className="file:text-foreground"
              {...rest}
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  onChange(e.target.files);
                  setImagePreview(URL.createObjectURL(e.target.files[0]));
                }
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
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
            form.setValue("avatar", undefined);
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
              placeholder="Describe the character's past, motivations, and key life events..."
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
              placeholder="What is the setting? What is the main conflict or situation?"
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
              placeholder="The first line of dialogue or action to start the story..."
              rows={3}
              {...field}
              value={field.value ?? ""}
            />
          </FormControl>
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="start_options"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Start Option (Text)</FormLabel>
          <FormControl>
            <Input
              placeholder="A single starting action for the user"
              {...field}
              value={field.value ?? ""}
            />
          </FormControl>
        </FormItem>
      )}
    />
    <div className="flex justify-between items-center pt-4">
      <Button type="button" variant="outline" onClick={prevStep}>
        Back
      </Button>
      <Button type="submit" size="lg">
        Create Character
      </Button>
    </div>
  </div>
);

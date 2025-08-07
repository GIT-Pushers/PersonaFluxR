"use client";

import React, { useState, useRef } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import {
  Check,
  ChevronsUpDown,
  X,
  User,
  BookOpen,
  Sparkles,
  Loader2,
} from "lucide-react";
import Image from "next/image";

// Shadcn/UI Component Imports
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// --- DATA & TYPES ---

const TRAIT_OPTIONS = [
  { value: "brave", label: "Brave" },
  { value: "witty", label: "Witty" },
  { value: "cautious", label: "Cautious" },
  { value: "charismatic", label: "Charismatic" },
  { value: "stoic", label: "Stoic" },
  { value: "impulsive", label: "Impulsive" },
];
const GENDER_OPTIONS = ["Female", "Male", "Non-binary", "Other", "Unspecified"];
const VOICE_OPTIONS = ["Alloy", "Echo", "Fable", "Onyx", "Nova", "Shimmer"];
const LANGUAGE_OPTIONS = ["English", "Spanish", "French", "German", "Japanese"];
const SCENE_OPTIONS = ["5", "10", "15", "20", "25"];
const STEPS = [
  { id: 1, name: "Basic Details", icon: <User className="h-4 w-4" /> },
  { id: 2, name: "Story & Context", icon: <BookOpen className="h-4 w-4" /> },
];

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

// --- REUSABLE & SUB-COMPONENTS ---

const MultiSelect = React.forwardRef<
  HTMLButtonElement,
  {
    options: { value: string; label: string }[];
    value: string[];
    onChange: (value: string[]) => void;
  }
>(({ options, value, onChange }, ref) => {
  const [open, setOpen] = useState(false);
  const selectedLabels = options
    .filter((o) => value.includes(o.value))
    .map((o) => o.label);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto min-h-10"
        >
          <div className="flex flex-wrap gap-1">
            {selectedLabels.length > 0 ? (
              selectedLabels.map((label) => (
                <Badge key={label} variant="secondary">
                  {label}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">Select traits...</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search traits..." />
          <CommandList>
            <CommandEmpty>No trait found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    const newValues = value.includes(option.value)
                      ? value.filter((v) => v !== option.value)
                      : [...value, option.value];
                    onChange(newValues);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.includes(option.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
});
MultiSelect.displayName = "MultiSelect";

const FormSidebar = ({ currentStep }: { currentStep: number }) => (
  <div className="flex h-full flex-col p-8 lg:p-12 bg-muted/50 border-r">
    <h1 className="text-3xl font-bold tracking-tight text-foreground">
      Create Character
    </h1>
    <p className="mt-2 text-muted-foreground">
      Follow the steps to bring your new character to life.
    </p>
    <nav className="mt-12 flex flex-col gap-6">
      {STEPS.map((step) => {
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;
        return (
          <div key={step.id} className="flex items-start gap-4">
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors duration-300",
                isActive
                  ? "bg-primary border-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground",
                isCompleted &&
                  "bg-primary border-primary text-primary-foreground"
              )}
            >
              {isCompleted ? <Check className="h-5 w-5" /> : step.icon}
            </div>
            <div>
              <h2
                className={cn(
                  "font-semibold transition-colors duration-300",
                  isActive ? "text-primary" : "text-foreground"
                )}
              >
                {step.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                {step.id === 1
                  ? "Define core attributes and identity."
                  : "Build their world and personality."}
              </p>
            </div>
          </div>
        );
      })}
    </nav>
    <div className="mt-auto text-sm text-muted-foreground">
      Powered by AI Storyteller Pro
    </div>
  </div>
);

const StepOneForm = ({
  form,
  nextStep,
}: {
  form: UseFormReturn<CharacterFormData>;
  nextStep: () => void;
}) => (
  <div className="space-y-6 animate-in fade-in-50 duration-500">
    <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
      <FormField
        control={form.control}
        name="character_name"
        rules={{ required: "Character name is required." }}
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Character Name</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Captain Eva Rostova" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="traits"
        rules={{
          validate: (v) => v.length > 0 || "Please select at least one trait.",
        }}
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Traits</FormLabel>
            <FormControl>
              <MultiSelect options={TRAIT_OPTIONS} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="gender"
        rules={{ required: "Gender is required." }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gender</FormLabel>
            <Select onValueChange={field.onChange} value={field.value ?? ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a gender" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {GENDER_OPTIONS.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="age"
        rules={{ min: { value: 1, message: "Age must be positive." } }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Age</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="35"
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="voice_name"
        rules={{ required: "A voice is required." }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Voice Name</FormLabel>
            <Select onValueChange={field.onChange} value={field.value ?? ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {VOICE_OPTIONS.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="no_of_scenes"
        rules={{ required: "Number of scenes is required." }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Scenes</FormLabel>
            <Select onValueChange={field.onChange} value={field.value ?? ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a number" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {SCENE_OPTIONS.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="language"
        rules={{ required: "Language is required." }}
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Language</FormLabel>
            <Select onValueChange={field.onChange} value={field.value ?? ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {LANGUAGE_OPTIONS.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
    <div className="flex justify-end pt-4">
      <Button type="button" size="lg" onClick={nextStep}>
        Next: Story & Context
      </Button>
    </div>
  </div>
);

const StepTwoForm = ({
  form,
  prevStep,
  imagePreview,
  setImagePreview,
  onGenerate,
  isGenerating,
}: {
  form: UseFormReturn<CharacterFormData>;
  prevStep: () => void;
  imagePreview: string | null;
  setImagePreview: React.Dispatch<React.SetStateAction<string | null>>;
  onGenerate: () => void;
  isGenerating: boolean;
}) => {
  // FIX: Create a ref for the file input to programmatically clear it
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
            disabled={isGenerating}
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

      <fieldset disabled={isGenerating} className="space-y-6">
        {/* FIX: Replaced FormField with form.register for the file input */}
        <FormItem>
          <FormLabel>Character Image (Avatar)</FormLabel>
          <FormControl>
            <Input
              type="file"
              accept="image/*"
              className="file:text-foreground"
              {...avatarRegister}
              ref={(e) => {
                // Combine RHF's ref with our own
                avatarRegister.ref(e);
                avatarFileRef.current = e;
              }}
              onChange={(e) => {
                // Call RHF's onChange then update our preview
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
                // FIX: Use resetField and manually clear the input's value
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
        <Button type="button" variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button type="submit" size="lg">
          Create Character
        </Button>
      </div>
    </div>
  );
};

// --- MAIN CHARACTER FORM COMPONENT ---

const stepOneFields: (keyof CharacterFormData)[] = [
  "character_name",
  "traits",
  "gender",
  "age",
  "voice_name",
  "no_of_scenes",
  "language",
];

const CharacterForm = () => {
  const [step, setStep] = useState(1);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<CharacterFormData>({
    mode: "onBlur",
    defaultValues: {
      character_name: "",
      traits: [],
      age: "",
      gender: "",
      voice_name: "",
      no_of_scenes: "",
      language: "",
      backstory: "",
      story_context: "",
      starting_propt: "",
      start_options: ["", "", ""],
      ending_scenes: ["", "", ""],
      avatar: undefined,
    },
  });

  const handleGenerateStory = async () => {
    const isValid = await form.trigger(stepOneFields);
    if (!isValid) {
      alert(
        "Please fill in all required basic details before generating with AI."
      );
      return;
    }

    setIsGenerating(true);
    try {
      const { character_name, traits, age, gender } = form.getValues();
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ character_name, traits, age, gender }),
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      const generatedData = await response.json();

      form.setValue("backstory", generatedData.backstory, {
        shouldValidate: true,
      });
      form.setValue("story_context", generatedData.story_context, {
        shouldValidate: true,
      });
      form.setValue("starting_propt", generatedData.starting_propt, {
        shouldValidate: true,
      });

      const startOptions = [
        ...(generatedData.start_options || []),
        "",
        "",
        "",
      ].slice(0, 3);
      form.setValue("start_options", startOptions, { shouldValidate: true });

      const endingScenes = [
        ...(generatedData.ending_scenes || []),
        "",
        "",
        "",
      ].slice(0, 3);
      form.setValue("ending_scenes", endingScenes, { shouldValidate: true });
    } catch (error) {
      console.error("Failed to generate story:", error);
      alert(
        "Sorry, something went wrong while generating the story. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = (data: CharacterFormData) => {
    const avatarFile = data.avatar?.[0] || null;
    const nonEmptyStartOptions = data.start_options.filter(
      (opt) => opt && opt.trim() !== ""
    );
    const nonEmptyEndingScenes = data.ending_scenes.filter(
      (scene) => scene && scene.trim() !== ""
    );

    const finalData = {
      ...data,
      start_options: nonEmptyStartOptions,
      ending_scenes: nonEmptyEndingScenes,
      avatar: avatarFile,
      avatar_url: avatarFile ? `path/to/uploaded/${avatarFile.name}` : null,
      age: data.age ? Number(data.age) : undefined,
      no_of_scenes: Number(data.no_of_scenes),
    };

    console.log("✅ Character Details Submitted:", finalData);
    alert(
      "Character created! Check the browser console for the final data object."
    );
  };

  const nextStep = async () => {
    const isValid = await form.trigger(stepOneFields);
    if (isValid) setStep(2);
  };

  const prevStep = () => setStep(1);

  return (
    <div className="grid md:grid-cols-12 min-h-screen w-screen bg-background">
      <div className="hidden h-full md:block md:col-span-5 lg:col-span-4">
        <FormSidebar currentStep={step} />
      </div>
      <main className="md:col-span-7 lg:col-span-8 flex flex-col items-center p-4 sm:p-8 md:p-12">
        <div className="w-full max-w-2xl">
          <div className="md:hidden mb-8">
            <FormSidebar currentStep={step} />
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {step === 1 ? (
                <StepOneForm form={form} nextStep={nextStep} />
              ) : (
                <StepTwoForm
                  form={form}
                  prevStep={prevStep}
                  imagePreview={imagePreview}
                  setImagePreview={setImagePreview}
                  onGenerate={handleGenerateStory}
                  isGenerating={isGenerating}
                />
              )}
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
};

export default CharacterForm;

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { X } from "lucide-react";

const TRAITS = ["Brave", "Curious", "Loyal", "Smart", "Kind", "Funny", "Wise"];

export function TraitsMultiSelect({
  value,
  onChange,
}: {
  value?: string[];
  onChange?: (value: string[]) => void;
}) {
  const [selectedTraits, setSelectedTraits] = useState<string[]>(value || []);
  const [open, setOpen] = useState(false);

  const toggleTrait = (trait: string) => {
    if (selectedTraits.includes(trait)) {
      setSelectedTraits(selectedTraits.filter((t) => t !== trait));
    } else {
      setSelectedTraits([...selectedTraits, trait]);
    }
    onChange?.(selectedTraits);
  };

  return (
    <div className="space-y-2">
      <label htmlFor="traits" className="text-sm font-medium text-gray-200">
        Traits
      </label>

      {/* Display selected traits as chips */}
      <div className="flex flex-wrap gap-2">
        {selectedTraits.map((trait) => (
          <div
            key={trait}
            className="flex items-center bg-blue-600 text-white text-sm px-3 py-1 rounded-full"
          >
            {trait}
            <button
              type="button"
              onClick={() => toggleTrait(trait)}
              className="ml-1 text-white hover:text-gray-200"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Hidden input to store comma-separated traits */}
      <input type="hidden" name="traits" value={selectedTraits.join(",")} />

      {/* Trigger for the popover */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start text-left">
            {selectedTraits.length === 0 ? "Select traits" : "Edit traits"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search traits..." />
            <CommandList>
              {TRAITS.map((trait) => (
                <CommandItem
                  key={trait}
                  onSelect={() => toggleTrait(trait)}
                  className={
                    selectedTraits.includes(trait)
                      ? "bg-blue-100 text-blue-700"
                      : ""
                  }
                >
                  {trait}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

import { create } from "zustand";

type CharacterData = {
  name: string;
  age: number;
  traits: string[];
  backstory: string;
  showMore: boolean;
  isDraggable: boolean;

  // Actions
  setName: (name: string) => void;
  setAge: (age: number) => void;
  setTraits: (traits: string[]) => void;
  setBackstory: (backstory: string) => void;
  toggleShowMore: () => void;
  setIsDraggable: (value: boolean) => void;
  reset: () => void;
};

export const useChar = create<CharacterData>((set) => ({
  name: "",
  age: 0,
  traits: [],
  backstory: "",
  showMore: false,
  isDraggable: false,

  setName: (name) => set({ name }),
  setAge: (age) => set({ age }),
  setTraits: (traits) => set({ traits }),
  setBackstory: (backstory) => set({ backstory }),
  toggleShowMore: () => set((state) => ({ showMore: !state.showMore })),
  setIsDraggable: (value) => set({ isDraggable: value }),
  reset: () =>
    set({
      name: "",
      age: 0,
      traits: [],
      backstory: "",
      showMore: false,
      isDraggable: false,
    }),
}));

import { create } from "zustand";

interface CounterTextState {
  count: number;
  text: string;
  increase: () => void;
  decrease: () => void;
  setText: (newText: string) => void;
}

export const useStore = create<CounterTextState>()((set) => ({
  count: 0,
  text: "",
  increase: () => set((state) => ({ count: state.count + 1 })),
  decrease: () => set((state) => ({ count: state.count - 1 })),
  setText: (newText: string) => set({ text: newText }),
}));

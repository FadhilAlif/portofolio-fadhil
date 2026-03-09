// EXAMPLE STORE - You can replace this with your actual store implementation
import { CounterState } from "@/types"
import { create } from "zustand"

// Create the store
export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}))

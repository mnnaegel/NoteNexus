import { create } from 'zustand'

const useNoteStore = create((set) => ({
  url: "",
  updateNote: () => set((state: any) => ({ url: state })),
  resetNote: () => set({ url: "" }),
}))

export default useNoteStore;

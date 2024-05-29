import { create } from "zustand";
import { SettingsType } from "../types";

export const useSettingsStore = create<{
  settings: SettingsType;
  setSettings: (settings: SettingsType) => void;
}>((set) => ({
  settings: { haptics: true, sound: false, theme: "dark" },
  setSettings: (settings: SettingsType) => set({ settings }),
}));

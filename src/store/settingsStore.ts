import { createJSONStorage, persist } from "zustand/middleware";
import { STORAGE_NAME } from "../constants";
import { create } from "zustand";
import { zustandStorage } from "./storage";

export type TNotification = {
  messages: boolean;
  jobs: boolean;
};

export type TSettings = {
  haptics: boolean;
  sound: boolean;
  icon: "preset" | "dark" | "gray" | "danger";
  notifications: TNotification;
};

const initialSettings: TSettings = {
  haptics: true,
  sound: true,
  icon: "preset",
  notifications: {
    jobs: true,
    messages: true,
  },
};

interface TSettingsState {
  settings: TSettings;
  update: (settings: TSettings) => void;
  restore: () => void;
}

export const useSettingsStore = create<TSettingsState>()(
  persist(
    (set, _get) => ({
      settings: initialSettings,
      update: (settings) => set({ ..._get(), settings }),
      restore: () => set({ ..._get(), settings: initialSettings }),
    }),
    {
      name: STORAGE_NAME.SETTINGS,
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);

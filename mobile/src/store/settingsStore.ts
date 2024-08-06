import { createJSONStorage, persist } from "zustand/middleware";
import { STORAGE_NAME, WALLPAPERS } from "../constants";
import { create } from "zustand";
import * as Location from "expo-location";
import { zustandStorage } from "./storage";

export type TNotification = {
  messages: boolean;
  jobs: boolean;
};

export type TLocation = {
  showJobsGlobally: boolean;
  defaultJobListingLocation: "city" | "region" | "country";
  showDistanceToAdvertiser: boolean;
  distanceRadius: number;
  locationAccuracy: Location.LocationAccuracy;
  metric: "km" | "mi" | "m";
};
export type TStorage = { wishlists: boolean };
export type TSettings = {
  haptics: boolean;
  sound: boolean;
  storage: TStorage;
  notifications: TNotification;
  location: TLocation;
  wallpaper: keyof typeof WALLPAPERS;
};

const initialSettings: TSettings = {
  wallpaper: "default",
  haptics: true,
  sound: true,
  storage: {
    wishlists: true,
  },
  notifications: {
    jobs: true,
    messages: true,
  },
  location: {
    showJobsGlobally: false,
    defaultJobListingLocation: "city",
    showDistanceToAdvertiser: true,
    distanceRadius: 60000, // 60km
    locationAccuracy: Location.LocationAccuracy.Highest,
    metric: "km",
  },
};

export const locationAccuracies = [
  {
    title: "balanced",
    value: Location.LocationAccuracy.Balanced,
  },
  {
    title: "low",
    value: Location.LocationAccuracy.Low,
  },
  {
    title: "lowest",
    value: Location.LocationAccuracy.Lowest,
  },
  {
    title: "high",
    value: Location.LocationAccuracy.High,
  },
  {
    title: "highest",
    value: Location.LocationAccuracy.Highest,
  },
];

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

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { STORAGE_NAME } from "../constants";
import { zustandStorage } from "./storage";

export type TLoc = {
  lat: number;
  lon: number;
  address: {
    city: string | null;
    country: string | null;
    district: string | null;
    isoCountryCode: string | null;
    name: string | null;
    postalCode: string | null;
    region: string | null;
    street: string | null;
    streetNumber: string | null;
  };
};
interface TLocState {
  location: TLoc;
  update: (loc: TLoc) => void;
  reset: () => void;
}

const initialState: TLoc = {
  lat: 51.507351,
  lon: -0.127758,
  address: {
    city: null,
    country: null,
    district: null,
    isoCountryCode: null,
    name: null,
    postalCode: null,
    region: null,
    street: null,
    streetNumber: null,
  },
};
export const useLocationStore = create<TLocState>()(
  persist(
    (set, _get) => ({
      location: initialState,
      update: (location) => set({ ..._get(), location }),
      reset: () => set({ location: initialState }),
    }),
    {
      name: STORAGE_NAME.LOCATION,
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);

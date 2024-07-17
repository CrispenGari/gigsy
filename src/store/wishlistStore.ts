import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { STORAGE_NAME } from "../constants";
import { zustandStorage } from "./storage";
import { Id } from "@/convex/_generated/dataModel";

interface Wishlist {
  userId: Id<"users">;
  jobId: Id<"jobs">;
  _creationTime: number;
  _id: Id<"wishlists">;
}

interface TWishlistState {
  wishlists: Wishlist[];
  add: (wishlist: Wishlist) => void;
  remove: (wishlist: Wishlist) => void;
  clear: () => void;
  addAll: (wishlists: Wishlist[]) => void;
}
export const useWishlistStore = create<TWishlistState>()(
  persist(
    (set, _get) => ({
      wishlists: [],
      add: (wishlist) =>
        set({ ..._get(), wishlists: [wishlist, ..._get().wishlists] }),
      remove: (wishlist) =>
        set({
          ..._get(),
          wishlists: _get().wishlists.filter(({ _id }) => _id !== wishlist._id),
        }),
      clear: () => set({ ..._get(), wishlists: [] }),
      addAll: (wishlists) => set({ ..._get(), wishlists }),
    }),
    {
      name: STORAGE_NAME.WISHLIST,
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);

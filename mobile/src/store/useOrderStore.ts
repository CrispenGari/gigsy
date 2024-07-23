import { create } from "zustand";

type TOrder = "asc" | "desc";

type TOrderState = {
  order: TOrder;
  setOrder: (order: TOrder) => void;
};
export const useOderStore = create<TOrderState>()((set, _get) => ({
  order: "desc",
  setOrder: (order) => set({ order }),
}));

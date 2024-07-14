import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { zustandStorage } from "./storage";
import { STORAGE_NAME } from "../constants";

type TBasic = {
  title: string;
  description: string;
  company: string;
  companyDescription?: string;
};
type TAdditional = {
  skills: string[];
  educationLevels: string[];
  benefits: string[];
  experience: string[];
};
type TPayment = {
  salaryRange: {
    min?: string;
    max: string;
  };
  type: "part-time" | "full-time";
};
type TContact = {
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
};
type TFormState = TPayment & TContact & TAdditional & TBasic;
type TCreateFormState = {
  form: TFormState;
  setForm: (form: TFormState) => void;
  setBasic: (state: TBasic) => void;
  setContact: (state: TContact) => void;
  setAdditional: (state: TAdditional) => void;
  setPayment: (state: TPayment) => void;
};

const initialFormState: TFormState = {
  benefits: [],
  company: "",
  contactEmail: "",
  contactName: "",
  description: "",
  educationLevels: [],
  experience: [],
  salaryRange: { max: "", min: "" },
  skills: [],
  title: "",
  type: "part-time",
  companyDescription: "",
  contactPhone: "",
};

export const useCreateFormStore = create<TCreateFormState>()(
  persist(
    (set, _get) => ({
      setForm: (form) => set({ form }),
      form: initialFormState,
      setBasic: (state) => set({ form: { ..._get().form, ...state } }),
      setContact: (state) => set({ form: { ..._get().form, ...state } }),
      setAdditional: (state) => set({ form: { ..._get().form, ...state } }),
      setPayment: (state) => set({ form: { ..._get().form, ...state } }),
    }),
    {
      name: STORAGE_NAME.CREATE_FORM,
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);

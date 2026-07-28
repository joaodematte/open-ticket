import type { RouterOutputs } from "@topsun/api/routers/index";
import { create } from "zustand";

type Ticket = RouterOutputs["ticket"]["getByUser"][number];

interface UpdateDialogState {
  toggle: (ticket: Ticket | null) => void;
  isOpen: boolean;
  ticket: Ticket | null;
}

export const useUpdateDialogStore = create<UpdateDialogState>()((set) => ({
  isOpen: false,
  ticket: null,
  toggle: (ticket) => set((state) => ({ isOpen: !state.isOpen, ticket })),
}));

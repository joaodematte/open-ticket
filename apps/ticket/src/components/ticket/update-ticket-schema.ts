import type { RouterOutputs } from "@topsun/api/routers/index";
import { z } from "zod";

type User = RouterOutputs["ticket"]["getAssignableUsers"][number];

export const UpdateTicketSchema = z.object({
  assigneeId: z.string().optional(),
  estimatedTime: z
    .string()
    .optional()
    .refine((value) => {
      if (value === undefined || value.trim() === "") {
        return true;
      }

      const hours = Number(value.replace(",", "."));

      return Number.isFinite(hours) && hours >= 0;
    }, "Informe um valor decimal válido"),
  status: z.enum(["open", "in_progress", "closed", "cancelled"]),
});

export type UpdateTicketFormValues = z.infer<typeof UpdateTicketSchema>;

export function parseEstimatedHoursToSeconds(
  estimatedTimeHours: string | undefined
): number | undefined {
  if (estimatedTimeHours === undefined || estimatedTimeHours.trim() === "") {
    return undefined;
  }

  const hours = Number(estimatedTimeHours.replace(",", "."));

  return Math.round(hours * 3600);
}

export function createAssignableUsersOptions(users: User[] | undefined) {
  if (!users) {
    return [];
  }

  return users.map((user) => ({
    label: user.name,
    value: user.id,
  }));
}

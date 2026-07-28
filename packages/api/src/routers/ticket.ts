import { db } from "@topsun/db";
import { user } from "@topsun/db/schema/auth";
import { ticket } from "@topsun/db/schema/ticket";
import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

import { adminProcedure, protectedProcedure, router } from "..";

const NewTicketSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
  priority: z.enum(["low", "medium", "high", "critical"]),
  title: z.string().min(1, "Título é obrigatório"),
  type: z.enum([
    "bug",
    "feature",
    "task",
    "improvement",
    "documentation",
    "other",
  ]),
});

const GetTicketByIdSchema = z.object({
  id: z.string(),
});

const UpdateTicketSchema = z.object({
  assigneeId: z.string().optional(),
  estimatedTime: z.number().int().min(0).optional(),
  id: z.string(),
  status: z.enum(["open", "in_progress", "closed", "cancelled"]),
});

export const ticketRouter = router({
  create: protectedProcedure
    .input(NewTicketSchema)
    .mutation(async ({ ctx, input }) => {
      const { title, description, priority, type } = input;

      const [createdTicket] = await db
        .insert(ticket)
        .values({
          createdBy: ctx.session.user.id,
          description,
          priority,
          title,
          type,
          updatedBy: ctx.session.user.id,
        })
        .returning();

      if (!createdTicket) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create ticket",
        });
      }

      return createdTicket;
    }),
  getAssignableUsers: adminProcedure.query(async () => {
    const users = await db.query.user.findMany({
      where: eq(user.role, "admin"),
    });

    return users;
  }),
  getById: adminProcedure
    .input(GetTicketByIdSchema)
    .query(async ({ input }) => {
      const existingTicket = await db.query.ticket.findFirst({
        where: eq(ticket.id, input.id),
        with: {
          assignee: true,
          user: true,
        },
      });

      if (!existingTicket) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ticket not found",
        });
      }

      return existingTicket;
    }),
  getByUser: protectedProcedure.query(async ({ ctx }) => {
    const tickets = await db
      .select()
      .from(ticket)
      .where(eq(ticket.createdBy, ctx.session.user.id))
      .orderBy(desc(ticket.createdAt));

    return tickets;
  }),
  update: adminProcedure
    .input(UpdateTicketSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, status, assigneeId, estimatedTime } = input;

      const [updatedTicket] = await db
        .update(ticket)
        .set({
          assigneeId: assigneeId ?? null,
          estimatedTime: estimatedTime ?? null,
          status,
          updatedBy: ctx.session.user.id,
        })
        .where(eq(ticket.id, id))
        .returning();

      if (!updatedTicket) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ticket not found",
        });
      }

      return updatedTicket;
    }),
});

import { db } from "@topsun/db";
import { user } from "@topsun/db/schema/auth";
import { message } from "@topsun/db/schema/message";
import { ticket } from "@topsun/db/schema/ticket";
import { TRPCError } from "@trpc/server";
import { asc, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { adminProcedure, protectedProcedure, router } from "..";
import type { Context } from "../context";

async function getTicketForSession(ctx: Context, ticketId: string) {
  if (!ctx.session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
    });
  }

  const existingTicket = await db.query.ticket.findFirst({
    where: eq(ticket.id, ticketId),
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

  const isAdmin = ctx.session.user.role === "admin";
  const isCreator = existingTicket.createdBy === ctx.session.user.id;

  if (!isAdmin && !isCreator) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You are not authorized to access this ticket",
    });
  }

  return existingTicket;
}

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

const TicketIdSchema = z.object({
  ticketId: z.string(),
});

const CreateMessageSchema = z.object({
  content: z.string().trim().min(1, "Comentário é obrigatório"),
  ticketId: z.string(),
});

const DeleteMessageSchema = z.object({
  id: z.string(),
  ticketId: z.string(),
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
  createMessage: protectedProcedure
    .input(CreateMessageSchema)
    .mutation(async ({ ctx, input }) => {
      await getTicketForSession(ctx, input.ticketId);

      const [createdMessage] = await db
        .insert(message)
        .values({
          content: input.content,
          ticketId: input.ticketId,
          userId: ctx.session.user.id,
        })
        .returning();

      if (!createdMessage) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create message",
        });
      }

      const messageWithUser = await db.query.message.findFirst({
        where: eq(message.id, createdMessage.id),
        with: {
          user: true,
        },
      });

      if (!messageWithUser) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to load created message",
        });
      }

      return messageWithUser;
    }),
  deleteMessage: protectedProcedure
    .input(DeleteMessageSchema)
    .mutation(async ({ ctx, input }) => {
      const existingTicket = await getTicketForSession(ctx, input.ticketId);

      const existingMessage = await db.query.message.findFirst({
        where: eq(message.id, input.id),
      });

      if (!existingMessage || existingMessage.ticketId !== input.ticketId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Message not found",
        });
      }

      const isAdmin = ctx.session.user.role === "admin";
      const isAuthor = existingMessage.userId === ctx.session.user.id;
      const isTicketClosed = existingTicket.status === "closed";
      const canDelete = isAdmin || (isAuthor && !isTicketClosed);

      if (!canDelete) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized to delete this message",
        });
      }

      await db.delete(message).where(eq(message.id, input.id));

      return { id: input.id };
    }),
  getAssignableUsers: adminProcedure.query(async () => {
    const users = await db.query.user.findMany({
      where: eq(user.role, "admin"),
    });

    return users;
  }),
  getById: protectedProcedure
    .input(GetTicketByIdSchema)
    .query(({ ctx, input }) => getTicketForSession(ctx, input.id)),
  getByUser: protectedProcedure.query(async ({ ctx }) => {
    const tickets = await db
      .select()
      .from(ticket)
      .where(eq(ticket.createdBy, ctx.session.user.id))
      .orderBy(desc(ticket.createdAt));

    return tickets;
  }),
  getMessages: protectedProcedure
    .input(TicketIdSchema)
    .query(async ({ ctx, input }) => {
      await getTicketForSession(ctx, input.ticketId);

      const messages = await db.query.message.findMany({
        orderBy: asc(message.createdAt),
        where: eq(message.ticketId, input.ticketId),
        with: {
          user: true,
        },
      });

      return messages;
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

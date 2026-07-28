import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";

import { user } from "./auth";
import { ticket } from "./ticket";

export const message = pgTable("message", {
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  ticketId: uuid("ticket_id")
    .notNull()
    .references(() => ticket.id),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id),
});

export const messageRelations = relations(message, ({ one }) => ({
  ticket: one(ticket, {
    fields: [message.ticketId],
    references: [ticket.id],
  }),
  user: one(user, {
    fields: [message.userId],
    references: [user.id],
  }),
}));

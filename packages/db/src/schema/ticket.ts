import { relations } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";

import { user } from "./auth";

export const statusEnum = pgEnum("status", [
  "open",
  "in_progress",
  "closed",
  "cancelled",
]);

export const priorityEnum = pgEnum("priority", [
  "low",
  "medium",
  "high",
  "critical",
]);

export const typeEnum = pgEnum("type", [
  "bug",
  "feature",
  "task",
  "improvement",
  "documentation",
  "other",
]);

export const ticket = pgTable("ticket", {
  assigneeId: uuid("assignee_id").references(() => user.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => user.id),
  description: text("description").notNull(),
  estimatedTime: integer("estimated_time"),
  id: uuid("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => uuidv7()),
  priority: priorityEnum("priority").notNull(),
  status: statusEnum("status").notNull().default("open"),
  title: text("title").notNull(),
  type: typeEnum("type").notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  updatedBy: uuid("updated_by")
    .notNull()
    .references(() => user.id),
});

export const ticketRelations = relations(ticket, ({ one }) => ({
  assignee: one(user, {
    fields: [ticket.assigneeId],
    references: [user.id],
    relationName: "ticketAssignee",
  }),
  user: one(user, {
    fields: [ticket.createdBy],
    references: [user.id],
    relationName: "ticketCreator",
  }),
}));

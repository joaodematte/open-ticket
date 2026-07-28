import { user } from "@topsun/db/schema/auth";
import { ticket } from "@topsun/db/schema/ticket";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { alias } from "drizzle-orm/pg-core";

const db = drizzle(process.env.DATABASE_URL ?? "");

const responsible = alias(user, "responsible");

const creatorId = "019fa8bd-c667-736b-9779-f25f7264b8f7";
const creator = await db.select().from(user).where(eq(user.id, creatorId));
console.log("creator row exists:", creator.length, creator[0]?.name);

const query = db
  .select()
  .from(ticket)
  .where(eq(ticket.id, "019fa8cc-9702-731c-90ee-9e29f2924786"))
  .leftJoin(responsible, eq(ticket.assigneeId, responsible.id))
  .leftJoin(user, eq(ticket.createdBy, user.id));

console.log("SQL:", query.toSQL().sql);

const rows = await query;
console.log("user:", rows[0]?.user);
process.exit(0);

import { timestamp, varchar } from "drizzle-orm/pg-core";

import { userSchema } from "./schema";

export const users = userSchema.table("users", {
  id: varchar("id").primaryKey(),
  firstName: varchar("firstName").notNull(),
  lastName: varchar("lastName").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  createdAt: timestamp("createdAt").notNull(),
});

export type User = typeof users.$inferSelect;

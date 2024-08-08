import { enumic, filthyFiat } from "../../../utils/pg/types";
import { timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";

import { AccountType } from "../types";
import { accountSchema } from "./schema";
import { users } from "./../../user/models/user";

export const accounts = accountSchema.table("accounts", {
  id: varchar("id").primaryKey(),
  userId: varchar("userId").references(() => users.id),
  accountType: enumic('accountType', AccountType).notNull(),
  balance: filthyFiat("balance").default("0").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  createdAt: timestamp("createdAt").notNull(),
}, (table) => {
  return {
    userIdUidx: uniqueIndex("userIdUidx").on(table.userId),
  };
});

export type Account = typeof accounts.$inferSelect;

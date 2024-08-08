import { enumic, filthyFiat } from "../../../utils/pg/types";
import { index, timestamp, varchar } from "drizzle-orm/pg-core";

import { TransactionType } from "../types";
import { accounts } from "./../../account/models/account";
import { transactionSchema } from "./schema";

export const transactions = transactionSchema.table("transactions", {
  id: varchar("id").primaryKey(),
  accountId: varchar("accountId").references(() => accounts.id).notNull(),
  transactionType: enumic("transactionType", TransactionType).notNull(),
  amount: filthyFiat("amount").notNull(),
  fee: filthyFiat("fee"),
  updatedAt: timestamp("updatedAt").notNull(),
  createdAt: timestamp("createdAt").notNull(),
}, (table) => {
  return {
    accountIdIdx: index("accountIdIdx").on(table.accountId),
  };
});

export type Transaction = typeof transactions.$inferSelect;

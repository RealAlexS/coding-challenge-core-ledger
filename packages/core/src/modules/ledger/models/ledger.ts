import { enumic, filthyFiat } from "../../../utils/pg/types";
import { index, timestamp, varchar } from "drizzle-orm/pg-core";

import { EntryType } from "../types";
import { accounts } from "../../account/models/account";
import { ledgerSchema } from "./schema";
import { transactions } from "../../transaction/models";

export const ledgers = ledgerSchema.table("ledgers", {
  id: varchar("id").primaryKey(),
  transactionId: varchar("transactionId").references(() => transactions.id).notNull(),
  accountId: varchar("accountId").references(() => accounts.id).notNull(),
  entryType: enumic("entryType", EntryType).notNull(),
  amount: filthyFiat("amount").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  createdAt: timestamp("createdAt").notNull(),
}, (table) => {
  return {
    transactionIdIdx: index("transactionIdIdx").on(table.transactionId),
    accountIdIdx: index("accountIdIdx").on(table.accountId),
  };
});

export type Ledger = typeof ledgers.$inferSelect;

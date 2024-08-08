import { createInsertSchema } from 'drizzle-zod';
import { filthyFiatValidator } from '../../../utils/pg/validators';
import { ledgers } from './ledger';

export const createLedgerSchema = createInsertSchema(ledgers, {
  amount: () => filthyFiatValidator,
}).pick({
  transactionId: true,
  accountId: true,
  entryType: true,
  amount: true
});
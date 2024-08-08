import { createInsertSchema } from 'drizzle-zod';
import { filthyFiatValidator } from '../../../utils/pg/validators';
import { transactions } from './transaction';

export const createTransactionSchema = createInsertSchema(transactions, {
  amount: () => filthyFiatValidator,
  fee: () => filthyFiatValidator.optional(),
}).pick({
  accountId: true,
  transactionType: true,
  amount: true,
  fee: true
});
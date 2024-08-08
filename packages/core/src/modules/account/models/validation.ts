import { accounts } from './account';
import { createInsertSchema } from 'drizzle-zod';
import { filthyFiatValidator } from '../../../utils/pg/validators';

export const createAccountSchema = createInsertSchema(accounts, {
  balance: () => filthyFiatValidator,
}).pick({
  userId: true,
  accountType: true,
  balance: true,
});
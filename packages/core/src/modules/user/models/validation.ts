import { createInsertSchema } from 'drizzle-zod';
import { users } from './user';

export const createUserSchema = createInsertSchema(users).pick({
  firstName: true,
  lastName: true,
});
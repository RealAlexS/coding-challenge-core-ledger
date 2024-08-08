import { z } from 'zod';

export const filthyFiatValidator = z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid number format: must have at most two decimal places.');

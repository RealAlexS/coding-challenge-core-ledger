import { event } from "../../event";
import { z } from "zod";

export const TransactionEvents = {
  Created: event(
    "transaction.created",
    z.object({
      id: z.string(),
    })
  ),
};

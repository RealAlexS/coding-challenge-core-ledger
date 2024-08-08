import { event } from "../../event";
import { z } from "zod";

export const LedgerEvents = {
  Created: event(
    "ledger.created",
    z.object({
      id: z.string(),
      accountId: z.string(),
    })
  ),
};

import { event } from "../../event";
import { z } from "zod";

export const AccountEvents = {
  Created: event(
    "account.created",
    z.object({
      id: z.string(),
    })
  ),
};

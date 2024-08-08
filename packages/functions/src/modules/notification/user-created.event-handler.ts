import { EventHandler } from "sst/node/event-bus";
import { UserEvents } from "@coding-challenge-core-ledger/core/modules/user";

export const handler = EventHandler(UserEvents.Created, async (evt) => {
  console.log("User created", evt);
});

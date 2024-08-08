import { Account, createAccountSchema } from "@coding-challenge-core-ledger/core/modules/account/models";

import { AccountManager } from "@coding-challenge-core-ledger/core/modules/account";
import { AccountType } from "@coding-challenge-core-ledger/core/modules/account/types";
import { EventHandler } from "sst/node/event-bus";
import { UserEvents } from "@coding-challenge-core-ledger/core/modules/user";

export const handler = EventHandler(UserEvents.Created, async (evt) => {
  console.log("Create Account based on User created", evt);

  const createAccountItem = {
    userId: evt.properties.id,
    accountType: AccountType.USER,
  } as Account;

  // schema validation
  createAccountSchema.parse(createAccountItem);
  
  const item = await AccountManager.create(createAccountItem);

  console.log("Account created", item);
});

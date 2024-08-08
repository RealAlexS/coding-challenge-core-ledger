import { AccountEvents } from "../events/account";
import { AccountRepository } from "../repositories/account.repository";
import { accounts } from "../models";
import { baseManager } from "../../base.manager";

export const AccountManager = baseManager<typeof accounts, AccountRepository>(
  new AccountRepository(),
  AccountEvents
);

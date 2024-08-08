import { Account, accounts } from "../models";

import { BaseRepository } from "../../base.repository";
import { DEFAULT_ACCOUNTS } from "../../../config";
import { db } from "../../../drizzle";

export class AccountRepository extends BaseRepository(db, accounts) {
  constructor() {
    super();
    this.createDefaultAccounts();
  }

  // NOTE: Temporary hack to create default accounts for company and bank
  async createDefaultAccounts() {
    for (const account of DEFAULT_ACCOUNTS) {
      const existingAccount = await this.get(account.id) as Account;
      if (!existingAccount) {
        this.create(account);
      }
    }
  }
}

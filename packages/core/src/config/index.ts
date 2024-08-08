import { Account } from "../modules/account/models";

export const TRANSACTION_FEE = "1.00"
export const MINIMUM_DEPOSIT = "2.00"

export const BANK_ACCOUNT_ID = "bank"
export const COMPANY_ACCOUNT_ID = "company"
export const DEFAULT_ACCOUNTS = [
  {
    id: BANK_ACCOUNT_ID,
    accountType: "bank",
  },
  {
    id: COMPANY_ACCOUNT_ID,
    accountType: "company",
  },
] as Account[];

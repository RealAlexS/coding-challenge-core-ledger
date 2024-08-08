import { Account } from "../../modules/account/models";
import { AccountType } from "../../modules/account/types";
import { EntryType } from "../../modules/ledger/types";
import { Ledger } from "../../modules/ledger/models";
import { Transaction } from "../../modules/transaction/models";
import { TransactionType } from "../../modules/transaction/types";
import { bn } from "../common";

export const sumDebitsAndCredits = (
  ledger: Ledger[]
): { debits: string; credits: string } =>{
  const debits = ledger
    .filter(e => e.entryType === EntryType.DEBIT)
    .reduce((acc, entry) => acc.plus(bn(entry.amount)), bn(0))
    .toFixed(2);

  const credits = ledger
    .filter(e => e.entryType === EntryType.DEBIT)
    .reduce((acc, entry) => acc.plus(bn(entry.amount)), bn(0))
    .toFixed(2);

  return {
    debits,
    credits
  };
}

export const sumUserBalances = (accounts: Account[]): string => {
  return accounts
    .filter(e => e.accountType === AccountType.USER)
    .reduce((acc, account) => acc.plus(bn(account.balance)), bn(0))
    .toFixed(2);
}

export const sumTransactions = (
  transactions: Transaction[]
): { deposits: string; withdrawals: string } => {
  const deposits = transactions
    .filter(e => e.transactionType === TransactionType.DEPOSIT)
    .reduce((acc, entry) => acc.plus(bn(entry.amount)), bn(0))
    .toFixed(2);

  const withdrawals = transactions
    .filter(e => e.transactionType === TransactionType.WITHDRAWAL)
    .reduce((acc, entry) => acc.plus(bn(entry.amount)), bn(0))
    .toFixed(2);

  return {
    deposits,
    withdrawals
  };
}

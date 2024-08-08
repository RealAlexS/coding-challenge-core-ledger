import { EntryType } from "../../modules/ledger/types";
import { bn } from "../common";

export const calculateNewBalance = (
  currentBalance: string,
  amount: string,
  entryType: string,
  isBankAccount: boolean
): string => {
  if (isBankAccount) {
    return calculateBankAccountBalance(currentBalance, amount, entryType);
  } else {
    return calculateUserOrCompanyAccountBalance(currentBalance, amount, entryType);
  }
}

export const calculateBankAccountBalance = (
  balance: string,
  amount: string,
  entryType: string
): string => {
  switch (entryType) {
    case EntryType.DEBIT:
      return bn(balance).minus(bn(amount)).toFixed(2);
    case EntryType.CREDIT:
      return bn(balance).plus(bn(amount)).toFixed(2);
    default:
      throw new Error(`Unknown entry type: ${entryType}`);
  }
}

export const calculateUserOrCompanyAccountBalance = (
  balance: string,
  amount: string,
  entryType: string
): string => {
  switch (entryType) {
    case EntryType.CREDIT:
      return bn(balance).minus(bn(amount)).toFixed(2);
    case EntryType.DEBIT:
      return bn(balance).plus(bn(amount)).toFixed(2);
    default:
      throw new Error(`Unknown entry type: ${entryType}`);
  }
}

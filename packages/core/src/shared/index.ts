import { Account } from "../modules/account/models";
import { AccountManager } from "../modules/account";
import { Ledger } from "../modules/ledger/models";
import { LedgerManager } from "../modules/ledger";
import { Transaction } from "../modules/transaction/models";
import { TransactionManager } from "../modules/transaction";

export const getAccount = async (
  id: string,
): Promise<Account> => {
  return await AccountManager.get(id) as Account;
};

export const getAccountBalance = async (
  id: string,
): Promise<string> => {
  const { balance } = await getAccount(id);
  return balance;
};

export const getUserAccount = async (
  userId: string,
): Promise<Account> => {
  return await AccountManager.getBy(
    AccountManager.model.userId,
    userId
  ) as Account;
};

export const getUserAccountBalance = async (
  userId: string,
): Promise<string> => {
  const { balance } = await getUserAccount(userId);
  return balance;
};

export const getUserTransactions = async (
  userId: string,
): Promise<Transaction[]> => {
  const { id: accountId } = await getUserAccount(userId);
  return await TransactionManager.query(
    TransactionManager.model.accountId,
    accountId
  ) as Transaction[];
};

export const getTransaction = async (
  id: string,
): Promise<Transaction> => {
  return await TransactionManager.get(id) as Transaction;
};

export const getTransactionLedger = async (
  transactionId: string,
): Promise<Ledger[]> => {
  return await LedgerManager.query(
    LedgerManager.model.transactionId,
    transactionId
  ) as Ledger[];
};
import { MINIMUM_DEPOSIT, TRANSACTION_FEE } from "../../../config";
import { beforeAll, describe, expect, it } from "vitest";
import { createTestTransaction, createTestTransactionApiCall, createTestUser, waitFor } from "../../../utils/tests";
import { getTransaction, getUserAccount, getUserAccountBalance } from "../../../shared";

import { Transaction } from "../models";
import { TransactionType } from "../types";
import { bn } from "../../../shared/common";

describe("Transaction", () => {
  let userId: string;
  let accountId: string;
  let initialBalance: string;

  beforeAll(async () => {
    const user = await createTestUser();
    userId = user.id;

    const account = await waitFor(
      () => getUserAccount(user.id),
      account => !!account,
      10,
      2000
    );
    accountId = account.id;

    initialBalance = account.balance;
  });

  const validateTransaction = async (transaction: Transaction, transactionType: TransactionType, amount: string) => {
    expect(transaction.accountId).toBe(accountId);
    expect(transaction.transactionType).toBe(transactionType);
    expect(transaction.amount).toBe(amount);
    expect(transaction.fee).toBe(TRANSACTION_FEE);
    
    const dbTransaction = await getTransaction(transaction.id);
    expect(dbTransaction.accountId).toBe(accountId);
    expect(dbTransaction.transactionType).toBe(transactionType);
    expect(dbTransaction.amount).toBe(amount);
    expect(dbTransaction.fee).toBe(TRANSACTION_FEE);
  };

  it("should create deposit", async () => {
    const transactionType = TransactionType.DEPOSIT;
    const amount = "100.00";
    const expBalance = bn(amount).minus(TRANSACTION_FEE).toFixed(2);

    const transaction = await createTestTransaction(
      userId,
      transactionType,
      amount
    );

    // Check the newly created transaction exists
    validateTransaction(transaction, transactionType, amount);

    // Wait for balance to be updated
    const balance = await waitFor(
      () => getUserAccountBalance(userId),
      balance => balance === expBalance,
      10,
      2000
    )
    expect(balance).toBe(expBalance);
  }, 60000);

  it("should create withdrawal", async () => {
    const currentBalance = await getUserAccountBalance(userId);
    const transactionType = TransactionType.WITHDRAWAL;
    const amount = "50.00";
    const expBalance = bn(currentBalance).minus(amount).minus(TRANSACTION_FEE).toFixed(2);

    const transaction = await createTestTransaction(
      userId,
      transactionType,
      amount
    );

    // Check the newly created transaction exists
    validateTransaction(transaction, transactionType, amount);

    // Wait for balance to be updated
    const balance = await waitFor(
      () => getUserAccountBalance(userId),
      balance => balance === expBalance,
      10,
      2000
    )
    expect(balance).toBe(expBalance);
  }, 60000);

  it("should throw an error on deposit amount below minimum deposit", async () => {
    const currentBalance = await getUserAccountBalance(userId);
    const transactionType = TransactionType.DEPOSIT;
    const amount = bn(MINIMUM_DEPOSIT).minus(0.01).toFixed(2);

    const body = {
      transactionType,
      amount
    }
    const response = await createTestTransactionApiCall(userId, body);
    expect(response.status).toBe(400);
    const responseJson = await response.json() as { message: string };  
    expect(responseJson.message).toContain("Minimum deposit amount required");
  }, 60000);

  it("should throw an error on withdrawal amount when balance is insufficient", async () => {
    const currentBalance = await getUserAccountBalance(userId);
    const transactionType = TransactionType.WITHDRAWAL;
    const amount = bn(currentBalance).plus(0.5).toFixed(2);

    const body = {
      transactionType,
      amount
    }
    const response = await createTestTransactionApiCall(userId, body);
    expect(response.status).toBe(400);
    const responseJson = await response.json() as { message: string };  
    expect(responseJson.message).toContain("Insufficient balance");
  }, 60000);
});

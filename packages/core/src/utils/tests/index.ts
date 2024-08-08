import { Api } from "sst/node/api";
import { Transaction } from "../../modules/transaction/models";
import { TransactionType } from "../../modules/transaction/types";
import { User } from "../../modules/user/models";
import { expect } from "vitest";

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const waitFor = async <T>(
  fn: () => Promise<T>,
  condition: (result: T) => boolean,
  retries: number = 5,
  delayMs: number = 1000
): Promise<T> => {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await fn();
      if (condition(result)) {
        return result;
      }
    } catch (error) {
      console.log(`Attempt ${i + 1} failed`, error);
    }
    console.log("Retrying", i + 1);
    await delay(delayMs);
  }
  throw new Error("Retry limit reached");
};

export const createTestUser = async (
  firstName: string = "John",
  lastName: string = "Perkins"
): Promise<User> => {

  const response = await createTestUserApiCall({firstName, lastName});
  expect(response.status).toBe(200);
  return (await response.json()) as User;
}

export const createTestUserApiCall = async (
  body: {
    firstName: string,
    lastName: string
  }
): Promise<Response> => {
  return await fetch(`${Api.api.url}/user`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export const createTestTransaction = async (
  userId: string,
  transactionType: TransactionType,
  amount: string
): Promise<Transaction> => {
  const body = {
    transactionType,
    amount
  }
  const response = await createTestTransactionApiCall(userId, body);
  expect(response.status).toBe(200);
  return (await response.json()) as Transaction;
}

export const createTestTransactionApiCall = async (
  userId: string,
  body: {
    transactionType: TransactionType,
    amount: string
  }
): Promise<Response> => {
  return await fetch(`${Api.api.url}/transaction/${userId}`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

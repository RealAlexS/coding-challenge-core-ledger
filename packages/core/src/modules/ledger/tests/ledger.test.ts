import { BANK_ACCOUNT_ID, COMPANY_ACCOUNT_ID, TRANSACTION_FEE } from "../../../config";
import { beforeAll, describe, expect, it } from "vitest";
import { createTestTransaction, createTestUser, waitFor } from "../../../utils/tests";
import { getAccountBalance, getTransactionLedger, getUserAccount, getUserAccountBalance } from "../../../shared";

import { TransactionType } from "../../transaction/types";
import { bn } from "../../../shared/common";
import { sumDebitsAndCredits } from "../../../shared/helper";

describe("Ledger", () => {
  let userId: string;
  let accountId: string;

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
  });

  const getBalanceInfo = async () => {
    const [user, company, bank] = await Promise.all([
      getUserAccountBalance(userId),
      getAccountBalance(COMPANY_ACCOUNT_ID),
      getAccountBalance(BANK_ACCOUNT_ID)
    ]);
    return {
      user,
      company,
      bank
    };
  };
  

  const waitForUpdateOfAllAccounts = async (
    expUserBalance: string,
    expCompanyBalance: string,
    expBankBalance: string
  ): Promise<void> => {
    await Promise.all([
      waitFor(
        () => getUserAccountBalance(userId),
        balance => balance === expUserBalance,
        15,
        3000
      ),
      waitFor(
        () => getAccountBalance(COMPANY_ACCOUNT_ID),
        balance => balance === expCompanyBalance,
        15,
        3000
      ),
      waitFor(
        () => getAccountBalance(BANK_ACCOUNT_ID),
        balance => balance === expBankBalance,
        15,
        3000
      )
    ]);
  };

  it("should create ledger entries for deposit", async () => {
    const transactionType = TransactionType.DEPOSIT;
    const amount = "100.00";
    const balanceInfo = await getBalanceInfo();
    const expUserBalance = bn(amount).minus(TRANSACTION_FEE).toFixed(2);
    const expCompanyBalance = bn(balanceInfo.company).plus(TRANSACTION_FEE).toFixed(2)
    const expBankBalance = bn(balanceInfo.bank).plus(amount).toFixed(2);

    const transaction = await createTestTransaction(
      userId,
      transactionType,
      amount
    );

    // Wait for balance to be updated before validating ledger entries
    await waitForUpdateOfAllAccounts(
      expUserBalance,
      expCompanyBalance,
      expBankBalance
    );

    const ledgerEntries = await getTransactionLedger(transaction.id) 
    expect(ledgerEntries).toHaveLength(3);

    const { debits, credits} = sumDebitsAndCredits(ledgerEntries)
    expect(debits).toBe(credits);
  }, 60000);

  it("should create ledger entries for withdrawal", async () => {
    const transactionType = TransactionType.WITHDRAWAL;
    const amount = "50.00";
    const balanceInfo = await getBalanceInfo();
    const expUserBalance = bn(balanceInfo.user).minus(amount).minus(TRANSACTION_FEE).toFixed(2);
    const expCompanyBalance = bn(balanceInfo.company).plus(TRANSACTION_FEE).toFixed(2)
    const expBankBalance = bn(balanceInfo.bank).minus(amount).toFixed(2);

    const transaction = await createTestTransaction(
      userId,
      transactionType,
      amount
    );

    // Wait for balance to be updated before validating ledger entries
    await waitForUpdateOfAllAccounts(
      expUserBalance,
      expCompanyBalance,
      expBankBalance
    );

    const ledgerEntries = await getTransactionLedger(transaction.id) 
    expect(ledgerEntries).toHaveLength(3);

    const { debits, credits} = sumDebitsAndCredits(ledgerEntries)
    expect(debits).toBe(credits);
  }, 60000);
});

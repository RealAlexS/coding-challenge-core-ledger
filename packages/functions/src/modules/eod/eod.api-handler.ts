import { BANK_ACCOUNT_ID, COMPANY_ACCOUNT_ID } from "@coding-challenge-core-ledger/core/config";
import { sumDebitsAndCredits, sumTransactions, sumUserBalances } from "@coding-challenge-core-ledger/core/shared/helper";

import { Account } from "@coding-challenge-core-ledger/core/modules/account/models";
import { AccountManager } from "@coding-challenge-core-ledger/core/modules/account";
import { ApiHandler } from "sst/node/api";
import { Ledger } from "@coding-challenge-core-ledger/core/modules/ledger/models";
import { LedgerManager } from "@coding-challenge-core-ledger/core/modules/ledger";
import { Transaction } from "@coding-challenge-core-ledger/core/modules/transaction/models";
import { TransactionManager } from "@coding-challenge-core-ledger/core/modules/transaction";
import { bn } from "@coding-challenge-core-ledger/core/shared/common";

export const get = ApiHandler(async (_evt) => {
  const [accounts, transactions, ledger] = await Promise.all([
    AccountManager.list() as Promise<Account[]>,
    TransactionManager.list() as Promise<Transaction[]>,
    LedgerManager.list() as Promise<Ledger[]>
  ]);

  // legder info
  const ledgerInfo = sumDebitsAndCredits(ledger);

  // balance info
  const balanceInfo = {
    users: sumUserBalances(accounts),
    company: accounts.filter(account => account.id === COMPANY_ACCOUNT_ID)[0].balance,
    bank: accounts.filter(account => account.id === BANK_ACCOUNT_ID)[0].balance,
  }

  const debitBalance = bn(balanceInfo.users).plus(balanceInfo.company)
  const creditBalance = bn(balanceInfo.bank)

  // transaction info
  const transactionInfo = sumTransactions(transactions);
  const netTransactions = bn(transactionInfo.deposits).minus(transactionInfo.withdrawals);

  // discrepancies
  const discrepancies = {
    ledger: bn(ledgerInfo.debits).minus(ledgerInfo.credits),
    balance: debitBalance.minus(creditBalance),
    netTransactionsToBankBalance: netTransactions.minus(balanceInfo.bank),
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      discrepancies,
      ledgerInfo,
      transactionInfo,
      balanceInfo,
    }),
  };
});

import { ApiHandler, usePathParams } from "sst/node/api";
import { MINIMUM_DEPOSIT, TRANSACTION_FEE } from "@coding-challenge-core-ledger/core/config";
import { Transaction, createTransactionSchema } from "@coding-challenge-core-ledger/core/modules/transaction/models";
import { bn, bnMax } from "@coding-challenge-core-ledger/core/shared/common";

import { TransactionManager } from "@coding-challenge-core-ledger/core/modules/transaction";
import { TransactionType } from "@coding-challenge-core-ledger/core/modules/transaction/types";
import { getUserAccount } from "@coding-challenge-core-ledger/core/shared";

export const create = ApiHandler(async (_evt) => {
  const params = usePathParams();
  if (!params.userId) return { statusCode: 400 };
  if (!_evt.body) return { statusCode: 400 };

  const account  = await getUserAccount(params.userId);
  if (!account) return { statusCode: 400, body: JSON.stringify({ message: "Account not found"}) };

  const data = {
    accountId: account.id,
    ...JSON.parse(_evt.body),
    fee: TRANSACTION_FEE,
  } as Transaction;

  // schema validation
  createTransactionSchema.parse(data);

  // validate deposit
  if (data.transactionType === TransactionType.DEPOSIT) {
    if (bn(data.amount).lt(MINIMUM_DEPOSIT)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: `Minimum deposit amount required: ${MINIMUM_DEPOSIT}`})
      }
    }
  }

  // validate withdrawal
  if (data.transactionType === TransactionType.WITHDRAWAL) {
    const txAmountWithFee = bn(data.amount).plus(TRANSACTION_FEE);
    const accountBalance = bn(account.balance);
    if (accountBalance.lt(txAmountWithFee)) {
      const maxWithdrawalAmount = bnMax(accountBalance.minus(TRANSACTION_FEE), bn(0));
      return {
        statusCode: 400,
        body: JSON.stringify({ message: `Insufficient balance: Maximum withdrawal amount: ${maxWithdrawalAmount}`})
      }
    }
  }
  
  const item = await TransactionManager.create(data);
  return {
    statusCode: 200,
    body: JSON.stringify(item),
  };
});
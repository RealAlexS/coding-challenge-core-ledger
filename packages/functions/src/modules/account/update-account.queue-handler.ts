import { Account } from "@coding-challenge-core-ledger/core/modules/account/models";
import { AccountManager } from "@coding-challenge-core-ledger/core/modules/account";
import { BANK_ACCOUNT_ID } from "@coding-challenge-core-ledger/core/config";
import { Ledger } from "@coding-challenge-core-ledger/core/modules/ledger/models";
import { LedgerManager } from "@coding-challenge-core-ledger/core/modules/ledger";
import { SQSEvent } from "aws-lambda";
import { calculateNewBalance } from "@coding-challenge-core-ledger/core/shared/calculations/updateAccount";

export const handler = async (evt: SQSEvent) => {
  console.log("Update Account based on Ledger Entry sent to SQS Queue", evt);

  const [record] = evt.Records;

  const { ledgerId } = JSON.parse(record.body) as {
    ledgerId: string;
  };

  const { accountId, entryType, amount } = await LedgerManager.get(ledgerId) as Ledger;

  const account = await AccountManager.get(accountId) as Account;

  const isBankAccount = accountId === BANK_ACCOUNT_ID;

  const newBalance = calculateNewBalance(
    account.balance, 
    amount, 
    entryType, 
    isBankAccount
  );

  const updatedAccount = await AccountManager.update(
    accountId, 
    { ...account, balance: newBalance }
  );

  console.log("Account updated", updatedAccount);
};

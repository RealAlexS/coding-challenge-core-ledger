import { BANK_ACCOUNT_ID, COMPANY_ACCOUNT_ID } from "@coding-challenge-core-ledger/core/config";
import { Ledger, createLedgerSchema } from "@coding-challenge-core-ledger/core/modules/ledger/models";
import { TransactionEvents, TransactionManager } from "@coding-challenge-core-ledger/core/modules/transaction";

import { EntryType } from "@coding-challenge-core-ledger/core/modules/ledger/types";
import { EventHandler } from "sst/node/event-bus";
import { LedgerManager } from "@coding-challenge-core-ledger/core/modules/ledger";
import { Transaction } from "@coding-challenge-core-ledger/core/modules/transaction/models";
import { TransactionType } from "@coding-challenge-core-ledger/core/modules/transaction/types";
import { bn } from "@coding-challenge-core-ledger/core/shared/common";

export const handler = EventHandler(TransactionEvents.Created, async (evt) => {
  console.log("Update Ledger based on Transaction created", evt);

  const { id } = evt.properties;
  const transaction = await TransactionManager.get(id) as Transaction;

  const items = [];
  const entries = generateEntries(transaction);
  for (const entry of entries) {
    // schema validation
    createLedgerSchema.parse(entry);

    const item = await LedgerManager.create(entry);
    items.push(item);
  }

  console.log("Ledger entries created ", items);
});

const generateEntries = (transaction: Transaction): Ledger[] => {
  const amount = bn(transaction.amount);
  const fee = bn(transaction.fee);
  const netAmount = amount.minus(fee); // for deposits
  const grossAmount = amount.plus(fee); // for withdrawals
  // formatted to numeric format
  const fAmount = amount.toFixed(2);
  const fFee = fee.toFixed(2);
  const fNetAmount = netAmount.toFixed(2);
  const fGrossAmount = grossAmount.toFixed(2);

  const entries = [];
  switch (transaction.transactionType) {
    case TransactionType.DEPOSIT:
      entries.push(createEntry(transaction.id, BANK_ACCOUNT_ID, EntryType.CREDIT, fAmount));
      entries.push(createEntry(transaction.id, COMPANY_ACCOUNT_ID, EntryType.DEBIT, fFee));
      entries.push(createEntry(transaction.id, transaction.accountId, EntryType.DEBIT, fNetAmount));
      break;

    case TransactionType.WITHDRAWAL:
      entries.push(createEntry(transaction.id, BANK_ACCOUNT_ID, EntryType.DEBIT, fAmount));
      entries.push(createEntry(transaction.id, COMPANY_ACCOUNT_ID, EntryType.DEBIT, fFee));
      entries.push(createEntry(transaction.id, transaction.accountId, EntryType.CREDIT, fGrossAmount));
      break;
  
    default:
      console.error(`Unknown transaction type: ${transaction.transactionType}`);
      break;
  }
  return entries;
}

const createEntry = (transactionId: string, accountId: string, entryType: EntryType, amount: string): Ledger =>{
  return {
    transactionId,
    accountId,
    entryType,
    amount
  } as Ledger;
}

import { TransactionEvents } from "../events/transaction";
import { TransactionRepository } from "../repositories/transaction.repository";
import { baseManager } from "../../base.manager";
import { transactions } from "../models";

export const TransactionManager = baseManager<typeof transactions, TransactionRepository>(
  new TransactionRepository(),
  TransactionEvents
);

import { LedgerEvents } from "../events/ledger";
import { LedgerRepository } from "../repositories/ledger.repository";
import { baseManager } from "../../base.manager";
import { ledgers } from "../models";

export const LedgerManager = baseManager<typeof ledgers, LedgerRepository>(
  new LedgerRepository(),
  LedgerEvents
);

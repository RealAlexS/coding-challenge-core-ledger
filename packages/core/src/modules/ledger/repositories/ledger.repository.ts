import { BaseRepository } from "../../base.repository";
import { db } from "../../../drizzle";
import { ledgers } from "../models";

export class LedgerRepository extends BaseRepository(db, ledgers) { }

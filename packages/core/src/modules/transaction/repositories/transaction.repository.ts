import { BaseRepository } from "../../base.repository";
import { db } from "../../../drizzle";
import { transactions } from "../models";

export class TransactionRepository extends BaseRepository(db, transactions) { }

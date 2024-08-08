CREATE SCHEMA "user";
--> statement-breakpoint
CREATE SCHEMA "transaction";
--> statement-breakpoint
CREATE SCHEMA "ledger";
--> statement-breakpoint
CREATE SCHEMA "account";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user"."users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"firstName" varchar NOT NULL,
	"lastName" varchar NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"createdAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transaction"."transactions" (
	"id" varchar PRIMARY KEY NOT NULL,
	"accountId" varchar NOT NULL,
	"transactionType" varchar NOT NULL,
	"amount" numeric(13, 2) NOT NULL,
	"fee" numeric(13, 2),
	"updatedAt" timestamp NOT NULL,
	"createdAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ledger"."ledgers" (
	"id" varchar PRIMARY KEY NOT NULL,
	"transactionId" varchar NOT NULL,
	"accountId" varchar NOT NULL,
	"entryType" varchar NOT NULL,
	"amount" numeric(13, 2) NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"createdAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account"."accounts" (
	"id" varchar PRIMARY KEY NOT NULL,
	"userId" varchar,
	"accountType" varchar NOT NULL,
	"balance" numeric(13, 2) DEFAULT '0' NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"createdAt" timestamp NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transaction"."transactions" ADD CONSTRAINT "transactions_accountId_accounts_id_fk" FOREIGN KEY ("accountId") REFERENCES "account"."accounts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ledger"."ledgers" ADD CONSTRAINT "ledgers_transactionId_transactions_id_fk" FOREIGN KEY ("transactionId") REFERENCES "transaction"."transactions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ledger"."ledgers" ADD CONSTRAINT "ledgers_accountId_accounts_id_fk" FOREIGN KEY ("accountId") REFERENCES "account"."accounts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account"."accounts" ADD CONSTRAINT "accounts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "user"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "accountIdIdx" ON "transaction"."transactions" ("accountId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transactionIdIdx" ON "ledger"."ledgers" ("transactionId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "accountIdIdx" ON "ledger"."ledgers" ("accountId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "userIdUidx" ON "account"."accounts" ("userId");
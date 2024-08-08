# Project Overview

Welcome to the project repository! This guide will help you get started and understand the different parts of the project.

> **Hint**: If you encounter timeouts during `pnpm run dev`, `pnpm run deploy` or `pnpm run test`, it might be due to the database needing to spin up as it is currently in idle mode.

## Technologies Used

- **SST**: We use [SST](https://sst.dev/) for easy serverless deployments and live lambda development.
- **Database**: PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/).
- **Messaging**: EventBridge Event Bus for easy publishing and subscribing.

## Code Structure

Feel free to adjust the code structure as you see fit and use the patterns that work best for you.

- **Infrastructure**: Located in the `/stacks` folder.
- **Application Code**: Found in `/packages`.
- **Lambda Functions**: Found in `/functions`.

## Installation

You will need an active AWS account to run this code. Follow these steps to set up your environment:

1. [Setup AWS Account](https://sst.dev/chapters/create-an-aws-account.html)
2. [Create IAM User](https://sst.dev/chapters/create-an-iam-user.html)
3. [Configure AWS CLI](https://sst.dev/chapters/configure-the-aws-cli.html)

> **Hint**: Please ensure you have node v18.18.2 or above installed.

Then, follow these commands:

```sh
pnpm install
pnpm run build # Ensures all types are working
pnpm run dev # will start deploy the ressources and start the live lambda development
```

You can optionally run with `aws-vault`:

If you update the database models, generate the migration files with:

```sh
pnpm run generate:migrations
```

## Running Tests

To run tests, ensure your environment is deployed `pnpm run deploy` or running with `pnpm run dev`. In another terminal window, run:

```sh
cd packages/core && pnpm run test
```

> **Hint**: The database might need some time to start. If you get timeouts, try again after a few minutes.

## Removing Resources

Remember to remove resources after you are done to avoid unnecessary AWS billing costs, especially for the database.

```sh
pnpm run remove
```

# Challenge

## Overview

Develop a system to track money transactions in a financial ledger, using TypeScript in a serverless environment.

The provided example repository demonstrates a simple user and notification domain. Both are implemented using AWS Lambda and deployed with the Serverless Stack Toolkit (SST). The repository also illustrates how to interact with the API to create and retrieve users, publish domain events, listen to these events, and send out notifications such as emails to users. The focus is on the design and structure of the solution, code organization, interaction with repositories, and handling of business logic.

## **Scenario:**

Users can deposit and withdraw money. A fee is applied to each deposit, with the remainder being credited to or withdrawn from the user's account. It's crucial to monitor these transactions to maintain accurate records of account balances (users, bank, company,…) at specific times. Double-entry accounting is a suitable method for tracking this type of money movement.

### Main Goals

1. **Create Transactions**:
    - Introduce API calls to generate transactions (both deposits and withdrawals) for users.
    - Apply a flat fee of 1€ to each transaction.
2. **Retrieve Transactions**:
    - Create API calls to retrieve transactions for a specific user.
3. **User Balance**:
    - Develop API calls to check the balance of a specific user.
4. **End-of-Day (EOD) Report**:
    - Build an API to produce an EOD report. This report should validate all balances, confirm that accounts are in alignment, and highlight any discrepancies in the ledger.
    - For example, we have €1,000 in our external bank account. Does this match our internal balances?

### Key Requirements

- Make sure all financial transactions are trackable and verifiable for accuracy.
- Use double-entry accounting to keep accurate balances.

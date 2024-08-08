import { ApiHandler, usePathParams } from "sst/node/api";
import { getUserAccountBalance, getUserTransactions } from "@coding-challenge-core-ledger/core/shared";

import { UserManager } from "@coding-challenge-core-ledger/core/modules/user";
import { createUserSchema } from "@coding-challenge-core-ledger/core/modules/user/models";

export const get = ApiHandler(async (_evt) => {
  const params = usePathParams();
  if (!params.id) return { statusCode: 400 };
  const item = await UserManager.get(params.id);
  return {
    statusCode: 200,
    body: JSON.stringify(item),
  };
});

export const create = ApiHandler(async (_evt) => {
  if (!_evt.body) return { statusCode: 400 };

  const data = JSON.parse(_evt.body)
  
  // schema validation
  createUserSchema.parse(data);

  const item = await UserManager.create(data);

  return {
    statusCode: 200,
    body: JSON.stringify(item),
  };
});

export const getBalance = ApiHandler(async (_evt) => {
  const params = usePathParams();
  if (!params.id) return { statusCode: 400 };
  const balance = await getUserAccountBalance(params.id);
  return {
    statusCode: 200,
    body: JSON.stringify({ balance }),
  };
});

export const getTransactions = ApiHandler(async (_evt) => {
  const params = usePathParams();
  if (!params.id) return { statusCode: 400 };
  const transactions = await getUserTransactions(params.id);
  return {
    statusCode: 200,
    body: JSON.stringify(transactions),
  };
});

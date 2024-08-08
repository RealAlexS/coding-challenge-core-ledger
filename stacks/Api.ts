import { Api as SSTApi, StackContext, use } from "sst/constructs";

import { Bus } from "./Bus";
import { Database } from "./Database";
import { UpdateAccountQueue } from "./Queue";
import { makePath } from "./utils";

export function Api({ stack }: StackContext) {
  const db = use(Database);
  const updateAccountQueue = use(UpdateAccountQueue);
  const bus = use(Bus);

  const api = new SSTApi(stack, "api", {
    defaults: {
      function: {
        timeout: "900 seconds",
        bind: [db, bus, updateAccountQueue],
      },
    },
    routes: {
      // user
      "GET /user/{id}": makePath("/user/user.api-handler.get"),
      "POST /user": makePath("/user/user.api-handler.create"),
      "GET /user/{id}/balance": makePath("/user/user.api-handler.getBalance"),
      "GET /user/{id}/transactions": makePath("/user/user.api-handler.getTransactions"),
      // transaction
      "POST /transaction/{userId}": makePath("/transaction/transaction.api-handler.create"),
      // eod
      "GET /eod": makePath("/eod/eod.api-handler.get"),
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  return Api;
}

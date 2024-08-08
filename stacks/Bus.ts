import { EventBus, StackContext, use } from "sst/constructs";

import { Database } from "./Database";
import { UpdateAccountQueue } from "./Queue";
import { makePath } from "./utils";

export function Bus({ stack }: StackContext) {
  const db = use(Database);
  const updateAccountQueue = use(UpdateAccountQueue);

  const bus = new EventBus(stack, "bus", {
    defaults: {
      retries: 3,
    },
  });
  
  bus.subscribe("user.created", {
    bind: [db],
    handler: makePath("notification/user-created.event-handler.handler"),
  });

  bus.subscribe("user.created", {
    bind: [db, bus],
    handler: makePath("account/user-created.event-handler.handler"),
  });

  bus.subscribe("transaction.created", {
    bind: [db, bus],
    handler: makePath("ledger/transaction-created.event-handler.handler"),
  });

  bus.subscribe("ledger.created", {
    bind: [db, updateAccountQueue, bus],
    handler: makePath("account/ledger-created.event-handler.handler"),
  });

  stack.addOutputs({
    busName: bus.eventBusName,
  });

  return bus;
}

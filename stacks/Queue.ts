import { Queue as SSTQueue, StackContext, use } from "sst/constructs";

import { Database } from "./Database";
import { makePath } from "./utils";

export function UpdateAccountQueue({ stack }: StackContext) {
  const db = use(Database);

  const updateAccountQueue = new SSTQueue(stack, "UpdateAccountQueue", {
    consumer: {
      function: {
        bind: [db],
        handler: makePath("account/update-account.queue-handler.handler"),
      },
    },
    cdk: {
      queue: {
        fifo: true,
      },
    }
  });

  stack.addOutputs({
    updateAccountQueueName: updateAccountQueue.queueName,
    updateAccountQueueUrl: updateAccountQueue.queueUrl,
  });

  return updateAccountQueue;
}

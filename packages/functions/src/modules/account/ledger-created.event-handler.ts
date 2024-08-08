import { EventHandler } from "sst/node/event-bus";
import { LedgerEvents } from "@coding-challenge-core-ledger/core/modules/ledger";
import { Queue } from "sst/node/queue";
import { createSQS } from "@coding-challenge-core-ledger/core/shared/aws";

export const handler = EventHandler(LedgerEvents.Created, async (evt) => {
  console.log("Notify Update Account Queue based on Ledger Entry created", evt);

  const sqs = createSQS();
  await sqs
    .sendMessage({
      QueueUrl: Queue.UpdateAccountQueue.queueUrl,
      MessageBody: JSON.stringify({ ledgerId: evt.properties.id }),
      MessageGroupId: evt.properties.accountId, // Ensure sequential processing for the same account
      MessageDeduplicationId: evt.properties.id
    })
    .promise();

  console.log("Message sent to SQS Queue");
});


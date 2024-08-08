import AWS from 'aws-sdk';

export const createSQS = (): AWS.SQS => {
  return new AWS.SQS();
};

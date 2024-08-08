import { BigNumber } from 'bignumber.js';

export const bn = (n: string | number | null) => {
  if (n === null) {
    return new BigNumber(0);
  }
  return new BigNumber(n);
};

export const bnMax = (a: BigNumber, b: BigNumber) => BigNumber.max(a, b);
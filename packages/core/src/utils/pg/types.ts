import { numeric, varchar } from 'drizzle-orm/pg-core';

export const int256 = (name: string) => numeric(name, { precision: 78, scale: 0 });
export const filthyFiat = (name: string) => numeric(name, { precision: 13, scale: 2 });
export const enumic = <T extends string>(name: string, enumObj: Record<string, T>) => {
  const enumValues = Object.values(enumObj) as string[];
  if (enumValues.length === 0) {
    throw new Error("Enum must have at least one value.");
  }
  return varchar(name, { enum: enumValues as [string, ...string[]] });
};
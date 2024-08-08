const defaultPath = "packages/functions/src/modules";

export const makePath = (p: string): string => {
  return `${defaultPath}/${p}`;
};
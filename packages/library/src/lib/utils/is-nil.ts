export const isNil = (obj: any): obj is null | undefined =>
  typeof obj === 'undefined' || obj === null;

export const before = <T extends Function>(
  next: T,
  condition: () => boolean
) => {
  const defaultFunc = () => {};

  if (typeof next !== 'function' || typeof condition !== 'function')
    return defaultFunc;

  if (condition()) return defaultFunc;

  return next;
};

export const isObjectType = <T extends { type: string }>(item: T) =>
  item?.type === 'object';

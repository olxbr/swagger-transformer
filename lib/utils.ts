export const clone = <T>(data: T): T => JSON.parse(JSON.stringify(data));

const isObject = (item: any) =>
  typeof item === 'object' && !Array.isArray(item);

export const mergeDeep = <T extends { [k: string]: any }>(
  target: T,
  ...sources: T[]
): T => {
  if (!sources?.length) return target;
  const source = sources.shift() ?? ({} as T);

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, { [key]: {} });
        }

        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
};
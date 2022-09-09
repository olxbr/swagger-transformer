export const hasOneOf = <T extends Array<string>>(properties: T) =>
  properties.includes('oneOf');

export const dogFindSchema = {
  name: 'name',
  schema: {
    type: 'string',
  },
  description: 'Filter dogs by Name',
  example: 'Khalice',
  required: true,
};

export const dogFindQuerySchema = {
  name: 'age',
  schema: {
    type: 'number',
  },
};

import { AjvSchema } from '../../../../lib/core/transformers/ajvToSwagger';

export const dogListSchema = {
  name: 'breed',
  schema: {
    enum: ['Caramelo', 'Labrador'],
    example: 'Caramelo',
  },
  description: 'Filter dogs by Breed',
  explode: true,
};

export const dogListResponse: AjvSchema = {
  type: 'array',
  items: {
    oneOf: [
      {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
        },
      },
      {
        type: 'object',
        properties: {
          age: {
            type: 'number',
          },
        },
      },
    ],
  },
};

import { AjvSchema } from '../../../../lib/core/transformers/ajvToSwagger';

export const dogCreateSchema: AjvSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      example: 'Khalice',
    },
    age: {
      type: 'integer',
    },
    breed: {
      type: 'string',
      example: 'Caramelo',
    },
  },
};

export const dogCreateSuccessSchema = {
  httpCode: 200,
  description: 'Registered dog',
  schema: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
      },
      status: {
        type: 'integer',
      },
    },
  },
};

export const dogCreateErrorSchema = {
  httpCode: 422,
  description: 'Unregistered dog',
  schema: {
    type: 'object',
    properties: {
      message: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
      status: {
        type: 'integer',
      },
    },
  },
};

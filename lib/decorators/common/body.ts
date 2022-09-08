import {
  SwaggerRequestBodyApplicationJSON,
  SwaggerSchema,
} from '../../core/swagger/types';

export const ajvBodyApplicationJSON = (
  schema: SwaggerSchema,
  description?: string
): { requestBody: SwaggerRequestBodyApplicationJSON } => ({
  requestBody: {
    description,
    content: {
      'application/json': {
        schema,
      },
    },
  },
});

import {
  SwaggerRequestBodyApplicationJSON,
  SwaggerSchema,
} from '../../core/swagger/types';

export const responseBodyApplicationJSON = (
  httpCode: number,
  schema?: SwaggerSchema,
  description?: string
): { [s: number]: SwaggerRequestBodyApplicationJSON } => ({
  [httpCode]: {
    description,
    content: schema
      ? {
          'application/json': {
            schema,
          },
        }
      : undefined,
  },
});

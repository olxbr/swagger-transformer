import { SwaggerParameter, SwaggerSchema } from '../../core/swagger/types';

type Options = {
  in: 'query' | 'path';
  name: string;
  schema: SwaggerSchema;
  description?: string;
  required?: boolean;
  explode?: boolean;
  example?: string;
};

export const parameter = (options: Options): SwaggerParameter => ({
  name: options.name,
  in: options.in,
  description: options.description,
  example: options.example,
  required: options.required,
  explode: options.explode,
  schema: options.schema,
});

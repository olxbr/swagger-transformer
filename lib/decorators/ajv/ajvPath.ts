import { IS_PROD, METADATA_AJV_QUERY_SCHEMA } from '../../core/constants';
import { SwaggerGenerate } from '../../core/swagger/Swagger';
import { Ajv, AjvSchema } from '../../core/transformers/ajvToSwagger';
import { before } from '../common/before';
import { parameter } from '../common/parameter';

type Options = {
  name: string;
  schema: AjvSchema;
  description?: string;
  required?: boolean;
  explode?: boolean;
  example?: string;
};

export const ajvPath = function (...options: Options[]) {
  return before(
    (_: any, __: string, descriptor: TypedPropertyDescriptor<any>) => {
      const transformed = options.map((curr) =>
        parameter({
          in: 'path',
          name: curr.name,
          description: curr.description,
          example: curr.example,
          required: curr.required ?? false,
          explode: curr.explode ?? false,
          schema: Ajv.toSwagger(curr.schema)!,
        })
      );

      Reflect.defineMetadata(
        METADATA_AJV_QUERY_SCHEMA,
        transformed,
        descriptor.value
      );

      SwaggerGenerate.init().addTarget(descriptor.value);
    },
    () => IS_PROD
  );
};

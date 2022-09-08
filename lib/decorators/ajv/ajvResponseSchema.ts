import { METADATA_AJV_RESPONSES_SCHEMA } from '../../core/constants';
import { SwaggerGenerate } from '../../core/swagger/Swagger';
import { Ajv, AjvSchema } from '../../core/transformers/ajvToSwagger';
import { responseBodyApplicationJSON } from '../common/response';

type Options = {
  httpCode: number;
  description: string;
  schema?: AjvSchema;
};

export const ajvResponseSchema = function (...options: Options[]) {
  return (_: any, __: string, descriptor: TypedPropertyDescriptor<any>) => {
    const responses = options.reduce(
      (acc, curr) => ({
        ...acc,
        ...responseBodyApplicationJSON(
          curr.httpCode,
          Ajv.toSwagger(curr.schema),
          curr.description
        ),
      }),
      {}
    );

    const hasResponse = Object.keys(responses)?.length >= 1;

    Reflect.defineMetadata(
      METADATA_AJV_RESPONSES_SCHEMA,
      hasResponse ? responses : undefined,
      descriptor.value
    );

    SwaggerGenerate.init().addTarget(descriptor.value);
  };
};

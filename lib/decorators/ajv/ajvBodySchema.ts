import { IS_PROD, METADATA_AJV_BODY_SCHEMA } from '../../core/constants';
import { SwaggerGenerate } from '../../core/swagger/Swagger';
import { Ajv, AjvSchema } from '../../core/transformers/ajvToSwagger';
import { before } from '../common/before';
import { ajvBodyApplicationJSON } from '../common/body';

type Options = {
  schema: AjvSchema;
  description?: string;
};

export const ajvBodySchema = function ({ schema, description }: Options) {
  return before(
    (_: any, __: string, descriptor: TypedPropertyDescriptor<any>) => {
      Reflect.defineMetadata(
        METADATA_AJV_BODY_SCHEMA,
        ajvBodyApplicationJSON(Ajv.toSwagger(schema)!, description),
        descriptor.value
      );

      SwaggerGenerate.init().addTarget(descriptor.value);
    },
    () => IS_PROD
  );
};

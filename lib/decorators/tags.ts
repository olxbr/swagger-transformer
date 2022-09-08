import { METADATA_SWAGGER_TAGS } from '../core/constants';
import { SwaggerGenerate } from '../core/swagger/Swagger';

type Tag = string;

export const Tags = function (...tags: Tag[]) {
  return (_: any, __: string, descriptor: TypedPropertyDescriptor<any>) => {
    if (!tags || tags.length === 0) return;

    Reflect.defineMetadata(METADATA_SWAGGER_TAGS, tags, descriptor.value);
    SwaggerGenerate.init().addTarget(descriptor.value);
  };
};

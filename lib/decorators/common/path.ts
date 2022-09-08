import {
  METADATA_HTTP_DESCRIPTION,
  METADATA_HTTP_PATH,
  METADATA_HTTP_SUMMARY,
  METADATA_HTTP_VERB,
} from '../../core/constants';
import { SwaggerGenerate } from '../../core/swagger/Swagger';
import { VerbHTTP } from '../../core/types';

type Options = {
  summary: string;
  description?: string;
};

const createPathDecorator = (verb: VerbHTTP) => {
  return (path: string, options?: Options) =>
    (_: object, __: string, descriptor: TypedPropertyDescriptor<any>) => {
      Reflect.defineMetadata(METADATA_HTTP_PATH, path, descriptor.value);
      Reflect.defineMetadata(METADATA_HTTP_VERB, verb, descriptor.value);
      Reflect.defineMetadata(
        METADATA_HTTP_SUMMARY,
        options?.summary,
        descriptor.value
      );
      Reflect.defineMetadata(
        METADATA_HTTP_DESCRIPTION,
        options?.description,
        descriptor.value
      );

      SwaggerGenerate.init().addTarget(descriptor.value);
    };
};

export const Get = createPathDecorator(VerbHTTP.GET);

export const Post = createPathDecorator(VerbHTTP.POST);

export const Put = createPathDecorator(VerbHTTP.PUT);

export const Patch = createPathDecorator(VerbHTTP.PATCH);

export const Delete = createPathDecorator(VerbHTTP.DELETE);

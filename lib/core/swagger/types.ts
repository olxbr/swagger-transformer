import { VerbHTTP } from '../types';

type ValueOf<T> = T[keyof T];

type Path = string;

type HTTPCode = number;

export type SwaggerStringSchema = {
  type: string; // 'string'
  format?: string; // 'date-time'
  description?: string;
  example?: string;
  enum?: string[];
};

export type SwaggerNumberSchema = {
  type: string; // 'integer'
  format?: string; // 'int32' | 'int64'
  example?: number;
};

type SwaggerBooleanSchema = {
  type: string; // 'boolean'
};

type SwaggerEnumSchema = {
  enum: string[];
};

type SwaggerArraySchema = {
  type: string; // 'array'
  items: SwaggerSchema;
};

export type SwaggerObjectSchema = {
  type: string; // 'object'
  properties: { [k: string]: SwaggerSchema } | SwaggerSchema;
};

export type SwaggerSchema =
  | SwaggerStringSchema
  | SwaggerNumberSchema
  | SwaggerBooleanSchema
  | SwaggerEnumSchema
  | SwaggerObjectSchema
  | SwaggerArraySchema;

type ExternalDoc = {
  url: string;
  description?: string;
};

type Tag = {
  name: string;
  description: string;
  externalDocs?: ExternalDoc;
};

export type SwaggerParameter = {
  in: 'path' | 'query';
  name: string;
  schema: SwaggerSchema;
  description?: string;
  required?: boolean;
  explode?: boolean;
  example?: string;
};

export type SwaggerRequestBodyApplicationJSON = {
  description?: string;
  content?: {
    'application/json': {
      schema: SwaggerSchema;
    };
  };
};

export type Tags = string[];

export type SwaggerPath = {
  summary: string;
  operationId: string;
  description?: string;
  responses?: {
    [s: HTTPCode]: SwaggerRequestBodyApplicationJSON;
  };
  parameters?: SwaggerParameter[];
  requestBody?: SwaggerRequestBodyApplicationJSON;
  tags?: Tags;
};

export type SwaggerPathGet = Omit<SwaggerPath, 'requestBody'>;

export type SwaggerPaths = {
  [s: Path]: {
    [K in ValueOf<typeof VerbHTTP>]?: K extends 'get'
      ? SwaggerPathGet
      : SwaggerPath;
  };
};

export type SwaggerSettings = {
  openapi: string;
  info: {
    title: string;
    version: string;
    description?: string;
    contact?: {
      email: string;
    };
  };
  externalDocs?: ExternalDoc;
  servers?: { url: string }[];
  tags?: Tag[];
};

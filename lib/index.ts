import 'reflect-metadata';
import { Get, Post, Put, Patch, Delete } from './decorators/common/path';
import { Tags } from './decorators/tags';
import { ajvPath } from './decorators/ajv/ajvPath';
import { ajvQuery } from './decorators/ajv/ajvQuery';
import { ajvBodySchema } from './decorators/ajv/ajvBodySchema';
import { ajvResponseSchema } from './decorators/ajv/ajvResponseSchema';
import { SwaggerGenerate } from './core/swagger/Swagger';

export {
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Tags,
  ajvPath,
  ajvQuery,
  ajvBodySchema,
  ajvResponseSchema,
  SwaggerGenerate,
};

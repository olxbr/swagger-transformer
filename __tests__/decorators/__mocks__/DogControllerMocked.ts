import {
  ajvBodySchema,
  ajvPath,
  ajvQuery,
  ajvResponseSchema,
  Get,
  Post,
  Tags,
} from '../../../lib';
import {
  dogCreateErrorSchema,
  dogCreateSchema,
  dogCreateSuccessSchema,
} from './schemas/dog.create.schema';
import { dogFindQuerySchema, dogFindSchema } from './schemas/dog.find.schema';
import { dogListResponse, dogListSchema } from './schemas/dog.list.schema';

export class DogControllerMocked {
  @Post('/dog', {
    summary: 'The EP to register a dog',
    description: 'Use this EP to register your favorite Dog',
  })
  @Tags('dog')
  @ajvBodySchema({ schema: dogCreateSchema })
  @ajvResponseSchema(dogCreateSuccessSchema, dogCreateErrorSchema)
  create() {
    return {};
  }

  @Get('/dog/{name}')
  @Tags('dog')
  @ajvPath(dogFindSchema)
  @ajvQuery(dogFindQuerySchema)
  find() {
    return {};
  }

  @Get('/dog')
  @Tags('dog', 'another_tag')
  @ajvQuery(dogListSchema)
  @ajvResponseSchema({
    httpCode: 200,
    schema: dogListResponse,
    description: 'Ok',
  })
  list() {
    return {};
  }
}

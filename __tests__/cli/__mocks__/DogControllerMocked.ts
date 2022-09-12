import { Get, Post, Tags } from '../../../lib';

export class DogControllerMocked {
  @Post('/dog', {
    summary: 'The EP to register a dog',
    description: 'Use this EP to register your favorite Dog',
  })
  @Tags('dog')
  create() {
    return {};
  }

  @Get('/dog/{name}')
  @Tags('dog')
  find() {
    return {};
  }

  @Get('/dog')
  @Tags('dog', 'another_tag')
  list() {
    return {};
  }
}

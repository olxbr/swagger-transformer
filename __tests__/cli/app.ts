import { SwaggerGenerate } from '../../lib';
import { DogControllerMocked } from './__mocks__/DogControllerMocked';

const bootstrap = () => {
  new DogControllerMocked();

  SwaggerGenerate.init().generate({});
};

bootstrap();

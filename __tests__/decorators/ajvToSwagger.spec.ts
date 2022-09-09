import { SwaggerGenerate } from '../../lib/core/swagger/Swagger';
import {
  SwaggerNumberSchema,
  SwaggerObjectSchema,
  SwaggerStringSchema,
} from '../../lib/core/swagger/types';
import { DogControllerMocked } from './__mocks__/DogControllerMocked';

describe('ajvToSwagger Decorators', () => {
  it('[CREATE] Should return a valid Swagger definitions', () => {
    new DogControllerMocked();
    const output = SwaggerGenerate.init().generate({});

    expect(output!.paths).toHaveProperty('/dog');
    expect(output!.paths['/dog']).toHaveProperty('post');

    const path = output!.paths['/dog']['post'];

    expect(path!.summary).toBe('The EP to register a dog');
    expect(path!.description).toBe('Use this EP to register your favorite Dog');
    expect(path!.tags).toEqual(['dog']);
    expect(path!.operationId).toBe('create');

    expect(path!.parameters).toBeUndefined();
    expect(path!.requestBody?.description).toBeUndefined();
    expect(path!.requestBody?.content).toHaveProperty('application/json');

    const schema = path?.requestBody?.content!['application/json']
      ?.schema as SwaggerObjectSchema;

    const properties = schema!.properties as {
      [k: string]: SwaggerObjectSchema;
    };

    const propertyName = properties.name as SwaggerStringSchema;
    const propertyAge = properties.age as SwaggerNumberSchema;

    expect(schema!.type).toBe('object');
    expect(propertyName.type).toBe('string');
    expect(propertyName.example).toBe('Khalice');
    expect(propertyName.format).toBeUndefined();

    expect(propertyAge.type).toBe('integer');

    expect(path!.responses!['200'].description).toBe('Registered dog');
    expect(path!.responses!['200'].content).toEqual({
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: undefined,
              format: undefined,
            },
            status: {
              type: 'integer',
              example: undefined,
              format: undefined,
            },
          },
        },
      },
    });

    expect(path!.responses!['422'].description).toBe('Unregistered dog');
    expect(path!.responses!['422'].content).toEqual({
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: {
              type: 'array',
              items: {
                type: 'string',
                example: undefined,
                format: undefined,
              },
            },
            status: {
              type: 'integer',
              example: undefined,
              format: undefined,
            },
          },
        },
      },
    });
  });

  it('[FIND] Should return a valid Swagger definitions', () => {
    new DogControllerMocked();
    const output = SwaggerGenerate.init().generate({});

    expect(output!.paths).toHaveProperty('/dog/{name}');
    expect(output!.paths['/dog/{name}']).toHaveProperty('get');

    const path = output!.paths['/dog/{name}']['get'];

    expect(path!.summary).toBeUndefined();
    expect(path!.description).toBeUndefined();
    expect(path!.tags).toEqual(['dog']);
    expect(path!.operationId).toBe('find');

    expect(Array.isArray(path?.parameters)).toBe(true);
    expect(path!.parameters![0].in).toBe('path');
    expect(path!.parameters![0].name).toBe('name');
    expect(path!.parameters![0].schema).toEqual({
      type: 'string',
      format: undefined,
    });
    expect(path!.parameters![0].description).toBe('Filter dogs by Name');
    expect(path!.parameters![0].example).toBe('Khalice');
    expect(path!.parameters![0].required).toBe(true);
    expect(path!.parameters![0].explode).toBe(false);

    expect(path?.responses).toEqual({ '200': { description: 'Ok' } });
  });

  it('[LIST] Should return a valid Swagger definitions', () => {
    new DogControllerMocked();
    const output = SwaggerGenerate.init().generate({});

    expect(output!.paths).toHaveProperty('/dog');
    expect(output!.paths['/dog']).toHaveProperty('post');
    expect(output!.paths['/dog']).toHaveProperty('get');

    const path = output!.paths['/dog']['get'];

    expect(path!.summary).toBeUndefined();
    expect(path!.description).toBeUndefined();
    expect(path!.tags).toEqual(['dog', 'another_tag']);
    expect(path!.operationId).toBe('list');

    expect(Array.isArray(path?.parameters)).toBe(true);
    expect(path!.parameters![0].in).toBe('query');
    expect(path!.parameters![0].name).toBe('breed');
    expect(path!.parameters![0].schema).toEqual({
      enum: ['Caramelo', 'Labrador'],
      example: 'Caramelo',
    });
    expect(path!.parameters![0].description).toBe('Filter dogs by Breed');
    expect(path!.parameters![0].required).toBe(false);
    expect(path!.parameters![0].explode).toBe(true);

    expect(path?.responses).toEqual({
      '200': {
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                oneOf: [
                  {
                    type: 'object',
                    properties: {
                      name: {
                        type: 'string',
                      },
                    },
                  },
                  {
                    type: 'object',
                    properties: {
                      age: {
                        type: 'integer',
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        description: 'Ok',
      },
    });
  });
});

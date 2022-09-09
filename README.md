### Swagger Transformer

This package uses decorators to generate the Swagger file template based on [AJV validator](https://ajv.js.org/).

#### How to use

- Create a `sg-transformer-config.json`file based on `sg-transformer-config.example.json` in project root;
- Use the decorators tô mapping your paths;

    ```tsx
        // Controller
        @Post('/dogs')
        @Tags('dogs', ...)
        @ajvBodySchema({ schema: dogsRequestBody })
        @ajvResponseSchema({ httpCode: 200, schema: dogsResponsesSchema, description: "" }, {...}, {...})
        public async create(req: Request, res: Response){
            ...
        }
        
        @Get('/dogs/{dogName}')
        @Tags('dogs')
        @ajvPath({name: "dogName", schema: { type: "string", ... } })
        @ajvQuery({name: "ageFilter", schema: { type: "number", ... } })
        @ajvResponseSchema({ httpCode: 200, schema: dogsResponsesSchema, description: "" }, {...}, {...})
        public async list(req: Request, res: Response){
            ...
        }
    ```

    After register all decorators, call `SwaggerGenerate.init().generate({});` to swagger-transfomer binary generate a output.

- Run `yarn swagger-transformer gen -a ./src/AppExample.ts` to generate a Swagger file.


### WIP

- Some types of AJV are not implemented in Transformer.
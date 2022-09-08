import { stringify } from 'yaml';
import { SwaggerPath, SwaggerPaths, SwaggerSettings } from './types';
import { Storage } from './Storage';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import {
  METADATA_AJV_BODY_SCHEMA,
  METADATA_AJV_QUERY_SCHEMA,
  METADATA_AJV_RESPONSES_SCHEMA,
  METADATA_HTTP_DESCRIPTION,
  METADATA_HTTP_PATH,
  METADATA_HTTP_SUMMARY,
  METADATA_HTTP_VERB,
  METADATA_SWAGGER_TAGS,
  SG_TRANSFORMER_CLI_PROCESS_DIR,
} from '../constants';
import { VerbHTTP } from '../types';
import { mergeDeep } from '../../utils';

type GenerateOptions = {
  fileName?: string;
  configs?: SwaggerSettings;
};

export class SwaggerGenerate {
  private static ref: SwaggerGenerate;
  private storage: Storage;

  private constructor() {
    this.storage = new Storage();
  }

  private configs(): SwaggerSettings | undefined {
    const fileName = 'sg-transformer.json';
    const path = `${SG_TRANSFORMER_CLI_PROCESS_DIR}/${fileName}`;

    if (!existsSync(path)) {
      throw new Error(`${fileName} not exists on project root: ${path}`);
    }

    try {
      const file = readFileSync(path, {
        encoding: 'utf-8',
      });

      return JSON.parse(file) as SwaggerSettings;
    } catch (err) {
      console.error(err);
    }
  }

  public static init() {
    if (SwaggerGenerate.ref) return SwaggerGenerate.ref;

    SwaggerGenerate.ref = new SwaggerGenerate();

    return SwaggerGenerate.ref;
  }

  public addTarget(target: object) {
    return this.storage.addTarget(target);
  }

  public generate({
    fileName = 'sg-transformer.yaml',
    configs,
  }: GenerateOptions) {
    try {
      const paths = this.storage
        .getTargets()
        .reduce((acc: SwaggerPaths, curr) => {
          const verb = Reflect.getMetadata(METADATA_HTTP_VERB, curr);
          const path = Reflect.getMetadata(METADATA_HTTP_PATH, curr);
          const summary = Reflect.getMetadata(METADATA_HTTP_SUMMARY, curr);
          const description = Reflect.getMetadata(
            METADATA_HTTP_DESCRIPTION,
            curr
          );
          const tags = Reflect.getMetadata(METADATA_SWAGGER_TAGS, curr);
          const parameters = Reflect.getMetadata(
            METADATA_AJV_QUERY_SCHEMA,
            curr
          );
          const bodySchema = Reflect.getMetadata(
            METADATA_AJV_BODY_SCHEMA,
            curr
          );
          const responsesSchema = Reflect.getMetadata(
            METADATA_AJV_RESPONSES_SCHEMA,
            curr
          );

          const pathInformations: { [k: string]: SwaggerPath } = {
            [verb]: {
              summary,
              description,
              operationId: (curr as Function)?.name,
              tags,
              parameters,
              ...(verb === VerbHTTP.GET ? {} : bodySchema),
              responses: responsesSchema ?? { 200: { description: 'Ok' } },
            },
          };

          if (acc[path])
            return {
              ...acc,
              [path]: {
                ...acc[path],
                ...pathInformations,
              },
            };

          return {
            ...acc,
            [path]: pathInformations,
          };
        }, {} as SwaggerPaths);

      const outputAsJson = {
        ...mergeDeep({}, this.configs() ?? {}, configs ?? {}),
        paths,
      };

      const yaml = stringify(outputAsJson);

      writeFileSync(`${SG_TRANSFORMER_CLI_PROCESS_DIR}/${fileName}`, yaml, {
        encoding: 'utf-8',
      });

      return outputAsJson;
    } catch (err) {
      console.error(err);
    }
  }
}

import { stringify } from 'yaml';
import { SwaggerPath, SwaggerPaths, SwaggerSettings } from './types';
import { Storage } from './Storage';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import {
  METADATA_AJV_BODY_SCHEMA,
  METADATA_AJV_PATH_SCHEMA,
  METADATA_AJV_QUERY_SCHEMA,
  METADATA_AJV_RESPONSES_SCHEMA,
  METADATA_HTTP_DESCRIPTION,
  METADATA_HTTP_PATH,
  METADATA_HTTP_SUMMARY,
  METADATA_HTTP_VERB,
  METADATA_SWAGGER_TAGS,
  SG_TRANSFORMER_CLI_PROCESS_DIR,
  SG_TRANSFORMER_CLI_PROCESS_OUTPUT_DIR,
} from '../constants';
import { VerbHTTP } from '../types';
import { mergeDeep } from '../../utils';

type GenerateOptions = {
  fileName?: string;
  ext?: 'yaml' | 'json';
  configs?: SwaggerSettings;
};

export class SwaggerGenerate {
  private static ref: SwaggerGenerate;
  private storage: Storage;

  private constructor() {
    this.storage = new Storage();
  }

  private configs(): SwaggerSettings | undefined {
    const fileName = 'sg-transformer-config.json';
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
    fileName = 'sg-transformer',
    ext = 'yaml',
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
          const parametersPath = Reflect.getMetadata(
            METADATA_AJV_PATH_SCHEMA,
            curr
          );
          const parametersQuery = Reflect.getMetadata(
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

          const hasParameters = !!(parametersPath || parametersQuery);

          const pathInformations: { [k: string]: SwaggerPath } = {
            [verb]: {
              summary,
              description,
              operationId: (curr as Function)?.name,
              tags,
              parameters: hasParameters
                ? [...(parametersPath ?? []), ...(parametersQuery ?? [])]
                : undefined,
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

      const stringifyOutputFile = ext === 'json' ? JSON.stringify : stringify;
      const output = stringifyOutputFile(outputAsJson);

      const dirExists = existsSync(SG_TRANSFORMER_CLI_PROCESS_OUTPUT_DIR);
      if (!dirExists) {
        mkdirSync(SG_TRANSFORMER_CLI_PROCESS_OUTPUT_DIR, {
          recursive: true,
        });
      }

      writeFileSync(
        `${SG_TRANSFORMER_CLI_PROCESS_OUTPUT_DIR}/${fileName}.${ext}`,
        output,
        {
          encoding: 'utf-8',
        }
      );

      return outputAsJson;
    } catch (err) {
      console.error(err);
    }
  }
}

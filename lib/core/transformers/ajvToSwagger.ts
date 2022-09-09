import { clone } from '../../utils';
import { SwaggerSchema } from '../swagger/types';
import { isObjectType } from './common/object';
import { hasOneOf } from './common/oneOf';

type ajvString = {
  type: string; // 'string'
  format?: string;
  example?: string;
  [k: string]: any;
};

type ajvNumber = {
  type: string; // 'integer' | 'number'
  format?: string;
  example?: number;
  [k: string]: any;
};

type ajvBoolean = {
  type: string; // 'boolean'
  [k: string]: any;
};

type ajvEnum = {
  type?: string;
  enum: string[];
};

type ajvOneOf = {
  oneOf: AjvSchema[];
};

type ajvArrayItem = Record<string, AjvSchema> | ajvOneOf | AjvSchema;

type ajvArray = {
  type: string; // 'array'
  items: ajvArrayItem;
  [k: string]: any;
};

type ajvObject = {
  type: string; // 'object'
  properties: Record<string, AjvSchema>;
  required?: string[];
  [k: string]: any;
};

export type AjvSchema =
  | ajvString
  | ajvNumber
  | ajvBoolean
  | ajvEnum
  | ajvObject
  | ajvArray;

export class Ajv {
  public static toSwagger(
    schema: AjvSchema | undefined
  ): SwaggerSchema | undefined {
    if (!schema) return;

    const handleProperties = (
      properties: Record<string, AjvSchema | AjvSchema[]>
    ) =>
      Object.keys(properties ?? {}).reduce((acc, curr) => {
        if (Array.isArray(properties[curr])) {
          return {
            ...acc,
            [curr]: (properties[curr] as AjvSchema[]).map(Ajv.toSwagger),
          };
        }

        return {
          ...acc,
          [curr]: Ajv.toSwagger(properties[curr] as AjvSchema),
        };
      }, {} as SwaggerSchema);

    const ajvSchema = clone(schema);

    if (Array.isArray(ajvSchema.enum)) {
      ajvSchema.type = 'enum';
    }

    switch (ajvSchema.type) {
      case 'string':
        const strSchema = ajvSchema as ajvString;

        return {
          type: 'string',
          format: strSchema.format,
          example: strSchema.example,
        };
      case 'integer':
      case 'number':
        const numberSchema = ajvSchema as ajvNumber;

        return {
          type: 'integer',
          format: numberSchema.format,
          example: numberSchema.example,
        };
      case 'boolean':
        return {
          type: 'boolean',
        };

      case 'enum':
        const enumSchema = ajvSchema as ajvEnum;

        return {
          enum: enumSchema.enum,
        };
      case 'object':
        const objSchema = ajvSchema as ajvObject;

        return {
          type: 'object',
          properties: handleProperties(objSchema?.properties),
        };
      case 'array':
        const arrSchema = ajvSchema as ajvArray | ajvObject;

        if (isObjectType(arrSchema.items))
          return {
            type: 'array',
            items: {
              type: 'object',
              properties: handleProperties(arrSchema.items.properties),
            },
          };

        const itemsKey = Object.keys(arrSchema.items);
        const hasReservedProperty = hasOneOf(itemsKey);

        const handler = hasReservedProperty ? handleProperties : Ajv.toSwagger;

        return {
          type: 'array',
          items: handler(arrSchema.items),
        };
    }
  }
}

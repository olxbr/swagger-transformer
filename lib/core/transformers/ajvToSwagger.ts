import { clone } from '../../utils';
import { SwaggerSchema } from '../swagger/types';

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

    // const handleArrayItems = (items: Record<string, AjvSchema | AjvSchema[]>) =>
    //   Object.keys(items).reduce((acc, curr) => {
    //     if (Array.isArray(items[curr])) {
    //       return {
    //         ...acc,
    //         [curr]: (items[curr] as AjvSchema[]).map(Ajv.toSwagger),
    //       };
    //     }

    //     return {
    //       ...acc,
    //       [curr]: Ajv.toSwagger(items[curr] as AjvSchema),
    //     };
    //   }, {} as SwaggerSchema);

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
        const reservedProperties = ['oneOf'];
        const arrSchema = ajvSchema as ajvArray | ajvObject;

        const isObjectType = arrSchema.items.type === 'object';
        const properties = isObjectType
          ? (arrSchema.items as ajvObject).properties
          : (arrSchema as ajvArray).items;

        if (isObjectType)
          return {
            type: 'array',
            items: {
              type: 'object',
              properties: handleProperties(
                properties as Record<string, AjvSchema>
              ),
            },
          };

        const hasReservedProperty = Object.keys(properties).find((p) =>
          reservedProperties.includes(p)
        );

        const items = hasReservedProperty
          ? handleProperties(
              properties as Record<string, AjvSchema | AjvSchema[]>
            )
          : Ajv.toSwagger(properties as AjvSchema);

        return {
          type: 'array',
          items,
        };
    }
  }
}

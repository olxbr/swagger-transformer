const NODE_ENV = process.env.NODE_ENV;

export const IS_PROD = NODE_ENV === 'prod' || NODE_ENV === 'production';

export const SG_TRANSFORMER_CLI_PROCESS_DIR =
  process.env.SG_TRANSFORMER_CLI_PROCESS_DIR ?? process.cwd();

export const METADATA_HTTP_PATH = Symbol('__http_path__');
export const METADATA_HTTP_VERB = Symbol('__http_verb__');
export const METADATA_HTTP_SUMMARY = Symbol('__http_summary__');
export const METADATA_HTTP_DESCRIPTION = Symbol('__http_description__');

export const METADATA_AJV_BODY_SCHEMA = Symbol('__ajv_body_schema__');
export const METADATA_AJV_RESPONSES_SCHEMA = Symbol('__ajv_responses_schema__');
export const METADATA_AJV_QUERY_SCHEMA = Symbol('__ajv_query_schema__');

export const METADATA_SWAGGER_TAGS = Symbol('__swagger_tags__');

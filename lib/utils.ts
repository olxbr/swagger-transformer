export const clone = <T>(data: T): T => JSON.parse(JSON.stringify(data));

export const SG_TRANSFORMER_CLI_PROCESS_DIR =
  process.env.SG_TRANSFORMER_CLI_PROCESS_DIR ?? process.cwd();

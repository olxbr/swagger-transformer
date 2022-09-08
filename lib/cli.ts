#!/usr/bin/env node

import commander from 'commander';
import { spawnSync } from 'child_process';
import { resolve } from 'path';

const packageJson = require('../package.json');

const logger = {
  error: (msg: string) => console.log(`[CLI][${packageJson.name}]`, msg),
  success: (msg: string) => console.log(`[CLI][${packageJson.name}]`, msg),
};

const ROOT_DIR = process.cwd();

commander.program.version(packageJson.version);
commander.program
  .command('gen')
  .option('-a, --app [app]', 'Set a App index to generate Swagger file')
  .description('This command will generate a output file in project root')
  .action(async ({ app }) => {
    if (!app) {
      logger.error('--app is a parameter required for "gen" command');
      return;
    }

    const path = resolve(ROOT_DIR, app);

    const result = spawnSync('ts-node', [path], {
      cwd: resolve(ROOT_DIR, 'node_modules', '.bin'),
      env: {
        ...process.env,
        SG_TRANSFORMER_CLI_PROCESS_DIR: ROOT_DIR,
      },
    });

    const err = result.stderr?.toString();
    if (err) {
      logger.error(err);
      return;
    }

    logger.success('Success');
  });

commander.program.parse(process.argv);

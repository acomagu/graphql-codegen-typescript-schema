import type { CodegenPlugin } from '@graphql-codegen/plugin-helpers';
import { printSchemaWithDirectives } from '@graphql-tools/utils';
import { parse } from 'graphql';
import * as path from 'node:path';

interface TypescriptSchemaPluginConfig {
  schemaRepresentation?: 'dsl' | 'ast';
}

const plugin: CodegenPlugin<TypescriptSchemaPluginConfig> = {
  plugin(schema, _documents, config, info) {
    const isTs = ['.ts', '.tsx'].includes(path.extname(info?.outputFile ?? ''));
    const asAny = isTs ? ' as any' : '';

    const { schemaRepresentation = 'ast' } = config;
    if (schemaRepresentation === 'dsl') {
      return {
        prepend: ['import { buildSchema } from \'graphql\';'],
        content: `export const schema = buildSchema(${JSON.stringify(printSchemaWithDirectives(schema))});\n`,
      };
    } else if (schemaRepresentation === 'ast') {
      return {
        prepend: ['import { buildASTSchema } from \'graphql\';'],
        content: `export const schema = buildASTSchema(${JSON.stringify(parse(printSchemaWithDirectives(schema)))}${asAny});\n`,
      };
    }
    throw new Error(`Invalid representation type is specified: ${schemaRepresentation}. Only 'dsl' or 'ast' are supported.`);
  },
  validate(_schema, _documents, config) {
    if (config.schemaRepresentation && !['dsl', 'ast'].includes(config.schemaRepresentation)) {
      throw new Error(`Invalid representation type is specified: ${config.schemaRepresentation}. Only 'dsl' or 'ast' are supported.`);
    }
  },
};

export = plugin;

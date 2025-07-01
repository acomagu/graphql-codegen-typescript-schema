import type { CodegenPlugin } from '@graphql-codegen/plugin-helpers';
import { printSchemaWithDirectives } from '@graphql-tools/utils';

interface TypescriptSchemaPluginConfig {
  output?: 'schemaObject' | 'dslString';
}

const plugin: CodegenPlugin<TypescriptSchemaPluginConfig> = {
  plugin(schema, _documents, config) {
    const { output = 'schemaObject' } = config;

    if (output === 'schemaObject') {
      return {
        prepend: ['import { buildSchema } from \'graphql\';'],
        content: `export const schema = buildSchema(${JSON.stringify(printSchemaWithDirectives(schema))});\n`,
      };
    } else if (output === 'dslString') {
      return {
        content: `export const schema = ${JSON.stringify(printSchemaWithDirectives(schema))};\n`,
      };
    }

    throw new Error(`Invalid output type is specified: ${output}. Only 'schemaObject' or 'dslString' are supported.`);
  },
  validate(_schema, _documents, config) {
    if (config.output && !['schemaObject', 'dslString'].includes(config.output)) {
      throw new Error(`Invalid output type is specified: ${config.output}. Only 'schemaObject' or 'dslString' are supported.`);
    }
  },
};

export = plugin;

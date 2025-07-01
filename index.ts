import type { CodegenPlugin } from '@graphql-codegen/plugin-helpers';
import { printSchemaWithDirectives } from '@graphql-tools/utils';

interface TypescriptSchemaPluginConfig {
  schemaOutput?: 'schemaObject' | 'dslString';
}

const plugin: CodegenPlugin<TypescriptSchemaPluginConfig> = {
  plugin(schema, _documents, config) {
    const { schemaOutput = 'schemaObject' } = config;

    const minifiedSchema = printSchemaWithDirectives(schema)
      .replace(/#.*/g, '')
      .replace(/\n/g, ' ')
      .replace(/\s\s+/g, ' ')
      .replace(/\s*([{}():,.=@])\s*/g, '$1');

    if (schemaOutput === 'schemaObject') {
      return {
        prepend: ['import { buildSchema } from \'graphql\';'],
        content: `export const schema = buildSchema(${JSON.stringify(minifiedSchema)});\n`,
      };
    } else if (schemaOutput === 'dslString') {
      return {
        content: `export const schema = ${JSON.stringify(minifiedSchema)};\n`,
      };
    }

    throw new Error(`Invalid schemaOutput type is specified: ${schemaOutput}. Only 'schemaObject' or 'dslString' are supported.`);
  },
  validate(_schema, _documents, config) {
    if (config.schemaOutput && !['schemaObject', 'dslString'].includes(config.schemaOutput)) {
      throw new Error(`Invalid schemaOutput type is specified: ${config.schemaOutput}. Only 'schemaObject' or 'dslString' are supported.`);
    }
  },
};

export = plugin;

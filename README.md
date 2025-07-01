# GraphQL Codegen TypeScript Schema Plugin

This plugin for [GraphQL Code Generator](https://the-guild.dev/graphql/codegen) allows you to import the schema from generated file(like [typescript-document-nodes plugin](https://the-guild.dev/graphql/codegen/plugins/typescript/typescript-document-nodes), but for schema).

Traditionally, working with `.graphql` files required configuring a bundler loader and adjusting `tsconfig` settings. With this plugin, you can bypass those steps. You can just import schema object from the generated TypeScript file.

## Installation

```bash
npm i -D graphql-codegen-typescript-schema
```

## Usage

Add the plugin to your GraphQL Codegen configuration file:

```yaml
schema: schema.graphql
generates:
  schema.ts:
    plugins:
      - typescript-schema # <-- this
```

It can be used with other `typescript-*` plugins;

```yaml
schema: schema.graphql
generates:
  generated.ts:
    plugins:
      - typescript
      - typescript-resolvers
      - typescript-schema # <-- this
```

This will add an named export as `schema` to generated.ts.

```typescript
import { schema } from './generated.ts';
```

## Options

### `output`

This option specifies the format of the generated output. It accepts two values:

- `schemaObject` (default): Exports a GraphQL schema object using `buildSchema`.
- `dslString`: Exports the schema as a raw DSL string.

For example,

```yaml
- typescript-schema:
    output: schemaObject
```

This configuration will generate a file that looks like:

```typescript
import { buildSchema } from 'graphql';

export const schema = buildSchema(`
  type Query {
    hello: String
  }
`);
```

Also,

```yaml
- typescript-schema:
    output: dslString
```

This configuration will generate a file that looks like:

```typescript
export const schema = `
  type Query {
    hello: String
  }
`;
```

The schema object format is ready to use with GraphQL libraries, while the DSL string format provides more flexibility for custom processing.

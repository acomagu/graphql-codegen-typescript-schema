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

### `schemaRepresentation`

This option specifies how the schema should be coded in the generated TypeScript file. It accepts two values:

- `ast` (default): Coded the schema as an AST object.
- `dsl`: Coded the schema as a DSL string.

For example,

```yaml
- typescript-schema
    schemaRepresentation: ast
```

This configuration will generate a file that looks like:

```typescript
import { buildASTSchema } from 'graphql';

export const schema = buildASTSchema({
  kind: 'Document',
  definitions: [ ... ]
} as any);
```

Also,

```yaml
- typescript-schema
    schemaRepresentation: dsl
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

The former style makes the generated file size bigger, but CPU time is considered slightly shorter. The latter style has a smaller file size, but requires parsing on loading.

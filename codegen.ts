import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: [{ "http://localhost:8800/graphql": {} }],
  generates: {
    "./src/common/interfaces/graphql/graphql.ts": {
      plugins: ["typescript", "typescript-resolvers"],
    },
  },
  config: {
    namingConvention: {
      enumValues: "change-case-all#upperCase",
    },
  },
};

export default config;

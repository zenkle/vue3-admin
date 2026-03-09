/* eslint-disable */
declare module "@eslint/js" {
  import { Linter } from "eslint";
  const config: Linter.Config[];
  export default config;
}

declare module "eslint-plugin-vue" {
  import { Linter } from "eslint";
  const plugin: Linter.Plugin & {
    configs: {
      "flat/recommended": Linter.Config[];
      "flat/essential": Linter.Config[];
      "flat/all": Linter.Config[];
    };
  };
  export default plugin;
}

declare module "@typescript-eslint/eslint-plugin" {
  import { Linter } from "eslint";
  const plugin: Linter.Plugin & {
    configs: {
      strict: Linter.Config;
      recommended: Linter.Config;
    };
  };
  export default plugin;
}

declare module "@typescript-eslint/parser" {
  import { Parser } from "eslint";
  const parser: Parser;
  export default parser;
}

declare module "vue-eslint-parser" {
  import { Parser } from "eslint";
  const parser: Parser;
  export default parser;
}

declare module "eslint-config-prettier" {
  import { Linter } from "eslint";
  const config: Linter.Config & {
    rules: Record<string, any>;
  };
  export default config;
}

declare module "eslint-plugin-prettier" {
  import { Linter } from "eslint";
  const plugin: Linter.Plugin & {
    configs: {
      recommended: {
        rules: Record<string, any>;
      };
    };
  };
  export default plugin;
}

import path from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import jsxA11Y from "eslint-plugin-jsx-a11y";
import prettier from "eslint-plugin-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import { fixupConfigRules } from "@eslint/compat";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...fixupConfigRules(...compat.extends("next/core-web-vitals")),
  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: [
      ".next/**",
      "node_modules/**",
      "dist/**",
      "next.config.js",
      "postcss.config.mjs",
      "eslint.config.mjs",
    ],
    plugins: {
      "unused-imports": unusedImports,
      "simple-import-sort": simpleImportSort,
      "@typescript-eslint": typescriptEslint,
      "jsx-a11y": jsxA11Y,
      prettier,
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 5,
      sourceType: "module",
      parserOptions: {
        project: "./tsconfig.json",
      },
    },

    rules: {
      "prettier/prettier": [
        "error",
        {
          trailingComma: "es5",
          singleQuote: true,
          semi: true,
        },
      ],

      "@typescript-eslint/lines-between-class-members": "off",
      "@typescript-eslint/no-throw-literal": "off",
      "simple-import-sort/imports": "error",
      "unused-imports/no-unused-imports": "error",
      "react/react-in-jsx-scope": "off",
      "import/prefer-default-export": "off",
      "react/jsx-props-no-spreading": "off",
      "react/prop-types": "off",
      "no-console": "warn",
      "@typescript-eslint/no-empty-object-type": "off",
    },
  },
  {
    // Separate block for settings
    settings: {
      react: {
        version: "detect", // Automatically detect the React version
      },
    },
  },
];

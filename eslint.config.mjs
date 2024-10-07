/* eslint-disable no-redeclare */
import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import react from "eslint-plugin-react";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default [
    ...fixupConfigRules(
        compat.extends(
            "eslint:recommended",
            "plugin:@next/next/core-web-vitals",
            "plugin:@next/next/recommended",
            "plugin:react-hooks/recommended",
            // "plugin:react/recommended",
            "plugin:@tanstack/eslint-plugin-query/recommended"
            // "plugin:deprecation/recommended"
        )
    ),
    {
        name: "eslint/defaults/",
        ignores: [".amplify/**/*", ".next/**/*", "**/*.config.{js,mjs}"],
    },
    {
        name: "typescript",

        plugins: {
            "@typescript-eslint": typescriptEslint,
            react: fixupPluginRules(react),
        },

        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },

            parser: tsParser,
            ecmaVersion: "latest",
            sourceType: "module",

            parserOptions: {
                project: "./tsconfig.json",
            },
        },

        settings: {
            react: {
                version: "detect",
            },
        },

        rules: {
            "@typescript-eslint/ban-ts-comment": "warn",
            "@typescript-eslint/no-empty-function": "off",
            // "@typescript-eslint/no-empty-interface": "warn",
            "@typescript-eslint/no-namespace": "off",
            "@typescript-eslint/no-unused-vars": ["off"],
            "@typescript-eslint/no-non-null-assertion": "off",
            "no-case-declarations": "warn",
            "no-constant-condition": "warn",
            "no-debugger": "warn",
            "no-empty-function": "off",
            "no-empty-pattern": "off",
            "no-unused-vars": "off",
            "no-inner-declarations": "off",
            "no-redeclare": "off",
            "no-unreachable": "off",
            //react
            "react/react-in-jsx-scope": "off",
            //tanstack
            "@tanstack/query/exhaustive-deps": "warn",
            //deprecation

            // "deprecation/deprecation": "warn",
        },
        files: ["{app,amplify}/**/*.{ts,tsx}"],
        ignores: [".amplify/**/*"],
    },
    {
        files: ["**/*.html"],
    },
];

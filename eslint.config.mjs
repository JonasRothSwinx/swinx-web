import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tseslint from "typescript-eslint";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import next from "@next/eslint-plugin-next";
import js from "@eslint/js";
import tanstack from "@tanstack/eslint-plugin-query";

console.log(reactHooks);
console.log({ typescriptEslint });
export default [
    {
        ...js.configs.recommended,
        name: "eslint/recommended",
        rules: {
            "no-extra-semi": "off",
            "no-mixed-spaces-and-tabs": "off",
        },
    },
    // { ...next.configs.recommended, name: "next/recommended" },
    {
        name: "eslint/defaults/",
        ignores: [
            //
            ".amplify/**/*",
            ".next/**/*",
            "**/*.config.{js,mjs}",
        ],
    },
    {
        name: "typescript",
        plugins: {
            "@typescript-eslint": typescriptEslint,
            react,
            "react-hooks": reactHooks,
            "@next/next": next,
            "@tanstack/query": tanstack,
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
            ...next.configs.recommended.rules,
            ...react.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,

            ...tseslint.configs.recommendedTypeChecked[2].rules,
            //typescript
            "@typescript-eslint/ban-ts-comment": "warn",
            "@typescript-eslint/no-empty-function": "off",
            // "@typescript-eslint/no-empty-interface": "warn",
            "@typescript-eslint/no-namespace": "off",
            "@typescript-eslint/no-unused-vars": ["off"],
            "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unsafe-return": "off",
            "@typescript-eslint/no-floating-promises": "off",
            "@typescript-eslint/no-misused-promises": "off",
            "@typescript-eslint/require-await": "off",
            "@typescript-eslint/no-unsafe-assignment": "off",

            //js
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
];

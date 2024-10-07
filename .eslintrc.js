/** @type {import("@typescript-eslint/utils/dist/ts-eslint/Linter").Linter} c */
var c = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:@next/next/core-web-vitals",
        "plugin:@next/next/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react-hooks/recommended",
        "plugin:react/recommended",
        "plugin:@tanstack/eslint-plugin-query/recommended",
        "plugin:deprecation/recommended",
    ],
    overrides: [
        {
            env: {
                node: true,
            },
            files: [".eslintrc.{js,cjs}"],
            parserOptions: {
                sourceType: "script",
            },
        },
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
    },
    plugins: ["@typescript-eslint", "react"],
    settings: {
        react: {
            version: "detect",
        },
    },
    rules: {
        // "@typescript-eslint/ban-types": "warn",
        "@typescript-eslint/ban-ts-comment": "warn",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-empty-interface": "warn",
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
        "react/react-in-jsx-scope": "off",
    },
};
module.exports = c;

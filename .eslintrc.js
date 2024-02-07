module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
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
    },
    plugins: ["@typescript-eslint", "react"],
    rules: {
        "no-empty-function": "off",
        "@typescript-eslint/no-empty-function": "off",
        "react/react-in-jsx-scope": "off",
        "no-empty-pattern": "off",
        "@typescript-eslint/ban-types": "off",
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": ["off"],
    },
};

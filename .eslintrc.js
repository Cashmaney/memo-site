// eslint-disable-next-line no-undef
module.exports = {
    root: true,
    env: {
        es2021: true,
    },
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
    ],
    parserOptions: {
        sourceType: "module",
    },
    rules: {
        "prettier/prettier": [
            "error",
            {
                trailingComma: "all",
                tabWidth: 4,
                semi: true,
                singleQuote: false,
            },
        ],
    },
};

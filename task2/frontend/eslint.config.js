import js from "@eslint/js";

export default [
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "coverage/**",
    ],
  },

  js.configs.recommended,

  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        document: "readonly",
        console: "readonly",
        fetch: "readonly",
        setTimeout: "readonly",
      },
    },
    rules: {
      "no-console": "off",
    },
  },
];
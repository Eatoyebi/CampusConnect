// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = tseslint.config(
  // TYPESCRIPT + ANGULAR TS RULES
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      // KEEP Angular selector rules
      "@angular-eslint/directive-selector": [
        "error",
        { type: "attribute", prefix: "app", style: "camelCase" },
      ],
      "@angular-eslint/component-selector": [
        "error",
        { type: "element", prefix: "app", style: "kebab-case" },
      ],

      // Allow constructor injection
      "@angular-eslint/prefer-inject": "off",

      // Allow "any" type without complaining
      "@typescript-eslint/no-explicit-any": "off",

      // Prevent other random strictness errors
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-unused-vars": ["warn"],
      "@typescript-eslint/no-inferrable-types": "off",
    },
  },

  // HTML TEMPLATE RULES
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,

    ],
    rules: {
      // Shut down individual accessibility nags:
      "@angular-eslint/template/alt-text": "off",
      "@angular-eslint/template/no-autofocus": "off",
      "@angular-eslint/template/label-has-for": "off",
      "@angular-eslint/template/form-control-has-label": "off",
      "@angular-eslint/template/no-positive-tabindex": "off",
    },
  }
);

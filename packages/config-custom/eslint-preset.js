/** @type {import('eslint').Linter.Config} */
module.exports = {
  // Extends the recommended Next.js configuration.
  extends: [
    "next/core-web-vitals",
    // Disables ESLint rules that might conflict with Prettier.
    "prettier"
  ],
  // Add any rules you want to enforce across your entire monorepo.
  rules: {
    // Example: Warn about console logs instead of erroring, useful for development.
    "no-console": "warn",
    // Enforce that all imports are sorted.
    "import/order": [
      "error",
      {
        "groups": ["builtin", "external", "internal", "parent", "sibling", "index", "object"],
        "newlines-between": "always",
        "alphabetize": { "order": "asc", "caseInsensitive": true }
      }
    ]
  }
};

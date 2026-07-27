import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";
import react from "ultracite/oxlint/react";
import tanstack from "ultracite/oxlint/tanstack";

export default defineConfig({
  extends: [core, react, tanstack],
  ignorePatterns: core.ignorePatterns,
  overrides: [
    {
      files: ["**/routes/**"],
      rules: {
        "no-use-before-define": "off",
      },
    },
  ],
  rules: {
    "func-style": [
      "error",
      "declaration",
      {
        allowArrowFunctions: true,
      },
    ],
  },
});

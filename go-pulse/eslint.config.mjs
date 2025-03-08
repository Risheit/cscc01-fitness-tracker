import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    root: true, // Explicitly mark this as the root config
    extends: [...compat.extends("next/core-web-vitals", "next/typescript")],
    rules: {
      "@typescript-eslint/explicit-module-boundary-types": "off", // Disables the rule globally
      "no-unused-vars": "off", // Disable unused variable rule
      "no-console": "off", // Disable console logging rule
      // Add more rules you want to disable here...
    },
  },
];

export default eslintConfig;

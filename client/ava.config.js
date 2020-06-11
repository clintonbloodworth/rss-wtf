export default {
  files: ["**/tests.js", "**/tests/**/*", "!node_modules"],
  require: [
    "./browser-env",
    "esm",
  ],
};

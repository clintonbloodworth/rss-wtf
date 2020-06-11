module.exports = {
  env: {
    browser: true,
  },
  overrides: [
    {
      files: "*.svelte",
      processor: "svelte3/svelte3",
      rules: {
        "import/extensions": "off", // https://github.com/sveltejs/eslint-plugin-svelte3/issues/72
        "import/no-mutable-exports": "off", // https://github.com/sveltejs/eslint-plugin-svelte3/blob/master/OTHER_PLUGINS.md#eslint-plugin-import
        "import/order": "off", // https://github.com/sveltejs/eslint-plugin-svelte3/blob/master/OTHER_PLUGINS.md#eslint-plugin-import
        "no-multiple-empty-lines": ["error", { max: 2, maxBOF: 2 }], // https://github.com/sveltejs/eslint-plugin-svelte3/issues/41
        "no-unused-vars": "off", // https://github.com/sveltejs/eslint-plugin-svelte3/issues/66#issue-645958676
      },
    },
  ],
  parserOptions: {
    sourceType: "module",
  },
  plugins: ["svelte3"],
  rules: {
    "import/no-extraneous-dependencies": ["error", {
      devDependencies: [
        "**/.eslintrc.js",
        "**/tests.js",
        "**/webpack.config.js",
        "browser-env.js",
        "tests/**",
      ],
    }],
  },
  settings: {
    "import/resolver": {
      webpack: "webpack.config.js",
    },
    "svelte3/ignore-styles": () => true,
  },
};

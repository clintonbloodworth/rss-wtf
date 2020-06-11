module.exports = {
  hooks: {
    "pre-commit":
      "lerna run --concurrency 1 --stream precommit --since HEAD --exclude-dependents",
  },
};

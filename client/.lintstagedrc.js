module.exports = {
  "*.{json,md}": ["prettier --write"],
  "*.js": ["eslint --fix"],
  "*.svelte": ["eslint --fix", "stylelint --fix"],
};

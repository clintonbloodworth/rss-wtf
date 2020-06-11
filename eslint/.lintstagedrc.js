// Exports
module.exports = {
  '*.js': [
    'eslint --config index.js --fix',
    'git add',
  ],
};

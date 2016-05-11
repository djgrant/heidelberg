const getConfig = require('hjs-webpack');

const config = getConfig({
  in: 'examples',
  out: 'public',
  clearBeforeBuild: true
});

module.exports = config;

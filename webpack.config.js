const NODE_ENV = process.env.NODE_ENV;
const getConfig = require('hjs-webpack');

const config = getConfig({
  in: 'src/index.js',
  out: 'build/umd',
  html: false,
  clearBeforeBuild: true,
  devServer: {
    hot: false
  }
});

config.resolve.modulesDirectories = ['src', 'node_modules'];

if (NODE_ENV === 'production') {
  config.output.libraryTarget = 'umd';
  config.output.library = 'heidelberg';

  config.externals = [{
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    }
  }];
}

module.exports = config;

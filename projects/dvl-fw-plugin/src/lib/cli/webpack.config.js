var path = require('path');
var shell = require('shelljs');
var nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',
  node: {
    __filename: true,
    __dirname: true,
    fs: true
  },
  entry: {
    'famri': path.resolve(__dirname, 'index.ts')
  },
  // mode: 'production',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.[tj]sx?$/,
        use: ["source-map-loader"],
        enforce: "pre"
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  externals: [nodeExternals()],
  output: {
    filename: '[name].js',
    path: path.resolve('dist', 'dvl-fw-plugin')
  },

  plugins: [
    function () {
      function mkExecutable(dist, fname) {
        shell
          .echo('#!/usr/bin/env node\n')
          .cat(path.resolve(dist, fname + '.js'))
          .to(path.resolve(dist, fname));
        shell.chmod(755, path.resolve(dist, fname));
        shell.rm(path.resolve(dist, fname + '.js'));
      }
      this.plugin('done', function() {
        var dist = path.resolve('dist', 'dvl-fw-plugin');
        mkExecutable(dist, 'famri');
      });
    },
  ]
};

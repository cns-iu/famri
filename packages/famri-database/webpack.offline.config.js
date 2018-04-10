const path = require('path');
const nodeExternals = require("webpack-node-externals");
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const { NoEmitOnErrorsPlugin } = require('webpack');
const { AotPlugin } = require('@ngtools/webpack');

module.exports = {
  "target": "node",
  "resolve": {
    "extensions": [
      ".ts",
      ".js"
    ],
    "modules": [
      "./node_modules"
    ]
  },
  "resolveLoader": {
    "modules": [
      "./node_modules"
    ]
  },
  "externals": [ nodeExternals({modulesDir: '../../node_modules', whitelist: [/@ngx-dino\/.*/]}) ],
  "entry": {
    "build/read-raw-data": [
      './src/loader/read-raw-data.ts'
    ],
    "build/create-database": [
      './src/loader/create-database.ts'
    ],
    "build/import-database": [
      './src/loader/import-database.ts'
    ],
    "build/server": [
      './src/server.ts'
    ],
    "build/prod-server": [
      './src/prod-server.ts'
    ]
  },

  "output": {
    "path": process.cwd(),
    "filename": "[name].js"
  },

  "watch": false,

  "module": {
    "rules": [
      {
        "test": /\.json$/,
        "loader": "json-loader"
      },
      {
        "test": /\.ts$/,
        "loader": "@ngtools/webpack",
        options: {
          "tsConfigPath": "src/tsconfig.app.json"
        }
      }
    ]
  },
  "plugins": [
    new NoEmitOnErrorsPlugin(),
    new ProgressPlugin(),
    // new AotPlugin({
    //   "mainPath": "index.ts",
    //   "exclude": [],
    //   "tsConfigPath": "src/tsconfig.app.json",
    //   "skipCodeGeneration": true
    // })
  ],
  "node": {
    "fs": true,
    "global": true,
    "crypto": "empty",
    "tls": "empty",
    "net": "empty",
    "process": true,
    "module": false,
    "clearImmediate": false,
    "setImmediate": false
  }
};

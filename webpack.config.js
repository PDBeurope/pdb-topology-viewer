const path = require('path');
// const webpack = require('webpack');
// const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const PACKAGE_ROOT_PATH = process.cwd();
const PKG_JSON = require(path.join(PACKAGE_ROOT_PATH, "package.json"));

const componentConfig = {
    entry: path.resolve(__dirname, `src/web-component/index.js`),
    output: { filename: `${PKG_JSON.name}-component-build-${PKG_JSON.version}.js`, path: path.resolve(__dirname, `build/`) },
    target: "web",
    devtool: "source-map",
    resolve: {
      extensions: [".js"]
    },
    externals: {
      "PdbTopologyViewerPlugin": "PdbTopologyViewerPlugin"
    },
    // plugins: [new CleanWebpackPlugin([path.join(PACKAGE_ROOT_PATH, "build")])],
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            "style-loader",
            { loader: "css-loader", options: { importLoaders: 1 } }
          ]
        },
        {
          test: /.(jpg|jpeg|png|svg)$/,
          use: ['url-loader'],
        },
        {
          test: /\.(js)$/,
          exclude: function excludeCondition(path){
              
              const nonEs5SyntaxPackages = [
                'lit-element',
                'lit-html'
              ]
              
              // DO transpile these packages
              if (nonEs5SyntaxPackages.some( pkg => path.match(pkg))) {
                return false;
              }
            
              // Ignore all other modules that are in node_modules
              if (path.match(/node_modules\\/)) { return true; }
            
              else return false;
            },
          use: {
            loader: "babel-loader",
            options: {
              babelrc: false,
              presets: [
                [
                  "@babel/preset-env",
                  {
                    targets: {
                      ie: 11,
                      browsers: "last 2 versions"
                    },
                    modules: false
                  }
                ]
              ],
              plugins: [
                [
                  "@babel/plugin-transform-runtime",
                  {
                    regenerator: true
                  }
                ]
              ]
            }
          }
        }
      ]
    }
}

module.exports = [componentConfig];
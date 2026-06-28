process.env.WEBPACK_CLI_FORCE_MULTI_CONFIG = 'true';

const path = require('path');
const PKG_JSON = require(path.join(process.cwd(), 'package.json'));

// Build 1: Plugin (the core D3 viewer)
const pluginConfig = {
  entry: path.resolve(__dirname, 'src/app/index.ts'),
  output: {
    filename: `${PKG_JSON.name}-plugin-${PKG_JSON.version}.js`,
    path: path.resolve(__dirname, 'build'),
    library: {
      name: 'PdbTopologyViewerPlugin',
      type: 'umd',
      export: 'default',
    },
    globalObject: 'this',
    clean: false,
  },
  target: 'web',
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: 'defaults' }]],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|svg|webp)$/i,
        type: 'asset/inline',
      },
    ],
  },
  optimization: { minimize: true },
};

// 🔹 Build 2: Web Component (depends on plugin)
const componentConfig = {
  entry: path.resolve(__dirname, 'src/web-component/index.js'),
  output: {
    filename: `${PKG_JSON.name}-component-build-${PKG_JSON.version}.js`,
    path: path.resolve(__dirname, 'build'),
    library: {
      name: 'PdbTopologyViewerComponent',
      type: 'umd',
      export: 'default',
    },
    globalObject: 'this',
    clean: false,
  },
  target: 'web',
  devtool: 'source-map',
  externals: {
    PdbTopologyViewerPlugin: 'PdbTopologyViewerPlugin',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: 'defaults' }]],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  optimization: { minimize: true },
};

module.exports = [pluginConfig, componentConfig];

require('dotenv-extended').load({
  errorOnExtra: true,
  errorOnMissing: true,
});

const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { sass } = require('svelte-preprocess-sass');
const webpack = require('webpack');

module.exports = {
  devtool: process.env.NODE_ENV === 'production'
    ? 'source-map'
    : 'cheap-module-eval-source-map',
  entry: {
    main: path.resolve('source', 'main'),
    offline: path.resolve('source', 'offline'),
  },
  mode: process.env.NODE_ENV === 'production'
    ? 'production'
    : 'development',
  module: {
    rules: [
      {
        test: /\.svelte$/,
        use: [
          {
            loader: 'svelte-loader',
            options: {
              dev: process.env.NODE_ENV !== 'production',
              emitCss: true,
              hydratable: true,
              legacy: true,
              loopGuardTimeout: process.env.NODE_ENV !== 'production',
              preprocess: {
                style: sass({
                  includePaths: [
                    path.resolve('source'),
                  ],
                }, { all: true, name: 'scss' }),
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { sourceMap: true },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [autoprefixer()],
            },
          },
        ],
      },
    ],
  },
  node: {
    global: false // https://github.com/webpack/webpack/issues/5627#issuecomment-394309966
  },
  optimization: {
    minimizer: process.env.NOD_ENV === 'production'
      ? [
        new UglifyJsPlugin({
          parallel: true,
          sourceMap: true,
          uglifyOptions: {
            output: {
              comments: false,
            },
           },
        }),
      ]
      : [],
    splitChunks: {
      cacheGroups: {
        vendor: {
         test: /node_modules\/userbase/,
         chunks: 'all',
         name: 'vendor',
         enforce: true
        },
      }
    }
  },
  output: {
    path: path.resolve(__dirname, 'distribution'),
    filename: '[name].js',
  },
  plugins: process.env.NODE_ENV === 'production'
    ? [
        new webpack.DefinePlugin({
          global: 'window', // https://github.com/webpack/webpack/issues/5627#issuecomment-394309966
        }),
        new webpack.EnvironmentPlugin([
          'NODE_ENV',
          'API_URL',
          'USERBASE_APP_ID',
        ]),
        new MiniCssExtractPlugin({
          filename: '[name].css',
        }),
      ]
    : [
        new webpack.DefinePlugin({
          global: 'window', // https://github.com/webpack/webpack/issues/5627#issuecomment-394309966
        }),
        new webpack.EnvironmentPlugin([
          'NODE_ENV',
          'API_URL',
          'USERBASE_APP_ID',
        ]),
        new MiniCssExtractPlugin({
          filename: '[name].css',
        }),
      ],
  resolve: {
    alias: {
      app: path.resolve('source', 'app'),
      components: path.resolve('source', 'components'),
      icons: path.resolve('source', 'icons'),
      elements: path.resolve('source', 'elements'),
      jobs: path.resolve('source', 'jobs'),
      stores: path.resolve('source', 'stores'),
      views: path.resolve('source', 'views'),

      // Ensures one copy of the Svelte runtime is bundled in the app.
      svelte: path.resolve('node_modules', 'svelte'),
    },
    extensions: ['.mjs', '.js', '.svelte'],
    mainFields: ['svelte', 'browser', 'module', 'main'],
  },
  stats: process.env.NODE_ENV === 'production' ? 'normal' : 'minimal',
  watch: process.env.NODE_ENV !== 'production',
};

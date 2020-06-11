const autoprefixer = require("autoprefixer");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const postcssCustomMedia = require("postcss-custom-media");
const postcssNested = require("postcss-nested");
const postcssPxToRem = require("postcss-pxtorem");
const sveltePreprocess = require("svelte-preprocess");
const webpack = require("webpack");
const breakpoints = require("./source/library/breakpoints");

// TODO: Upgrade to Webpack 5 after this is resolved:
// https://github.com/sveltejs/svelte-loader/issues/139

module.exports = {
  cache: {
    type: "filesystem",
  },
  devServer: {
    compress: true,
    contentBase: path.join(__dirname, "distribution"),
    historyApiFallback: true,
    host: "0.0.0.0",
    inline: false,
    liveReload: false,
    port: 3000,
  },
  devtool:
    process.env.NODE_ENV === "production"
      ? "source-map"
      : "eval-cheap-module-source-map",
  entry: {
    index: path.resolve(__dirname, "source", "index"),
    worker: path.resolve(__dirname, "source", "worker"),
  },
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  module: {
    rules: [
      {
        test: /\.svelte$/,
        use: [
          {
            loader: "svelte-loader",
            options: {
              dev: process.env.NODE_ENV !== "production",
              emitCss: true,
              hydratable: true,
              legacy: true,
              loopGuardTimeout: process.env.NODE_ENV === "development"
                ? 1000
                : null,
              preprocess: sveltePreprocess({
                defaults: {
                  style: "postcss",
                },
                postcss: {
                  plugins: [
                    autoprefixer,
                    postcssNested,
                    postcssCustomMedia({
                      importFrom: [
                        {
                          customMedia: breakpoints,
                        },
                      ],
                    }),
                  ],
                },
              }),
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  // It's not clear to me why this doesn't do its
                  // thing inside of `sveltePreprocess.postcss`.
                  postcssPxToRem,
                ],
              },
            },
          },
        ],
      },
    ],
  },
  node: {
    global: false, // https://github.com/webpack/webpack/issues/5627#issuecomment-394309966
  },
  optimization: {
    minimize: process.env.NODE_ENV === "production",
    minimizer: [
      `...`, // eslint-disable-line
      new CssMinimizerPlugin(),
    ],
  },
  output: {
    path: path.resolve(__dirname, "distribution"),
  },
  plugins: [
    new CleanWebpackPlugin(),
    new Dotenv({
      defaults: true,
      path: ".env.example",
      safe: true,
      silent: false,
      systemvars: true,
    }),
    new webpack.NormalModuleReplacementPlugin(/^debug$/, resource => {
      if (process.env.NODE_ENV !== "development") {
        resource.request = resource.request.replace(
          /^debug$/,
          "library/noop/debug",
        );
      }
    }),
    new webpack.DefinePlugin({
      global: "window", // https://github.com/webpack/webpack/issues/5627#issuecomment-394309966
    }),
    new MiniCssExtractPlugin(),
    new CopyPlugin({
      patterns: [
        {
          context: path.resolve("source", "assets"),
          from: path.join("**", "*"),
          to: path.resolve(__dirname, "distribution"),
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      components: path.resolve(__dirname, "source", "components"),
      jobs: path.resolve(__dirname, "source", "jobs"),
      layouts: path.resolve(__dirname, "source", "layouts"),
      library: path.resolve(__dirname, "source", "library"),
      mixins: path.resolve(__dirname, "source", "mixins"),
      router: path.resolve(__dirname, "source", "router"),
      stores: path.resolve(__dirname, "source", "stores"),
      svelte: path.resolve(__dirname, "node_modules", "svelte"), // Ensure only one copy of Svelte runtime is bundled.
      views: path.resolve(__dirname, "source", "views"),
    },
    extensions: [".mjs", ".js", ".svelte"],
    mainFields: ["svelte", "browser", "module", "main"],
  },
  stats: process.env.NODE_ENV === "production" ? "normal" : "minimal",
  watch: process.env.NODE_ENV !== "production",
};

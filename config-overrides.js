const { override, addWebpackPlugin } = require("customize-cra");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const CompressionWebpackPlugin = require("compression-webpack-plugin");

const isEnvProduction = process.env.NODE_ENV === "production";

const addCompression = () => (config) => {
  if (isEnvProduction) {
    config.plugins.push(
      new CompressionWebpackPlugin({
        algorithm: "brotliCompress",
        test: /\.(css|js)$/,
        threshold: 1024,
        minRatio: 0.8,
      }),
    );
  }

  return config;
};

const addAnalyzer = () => (config) => {
  if (process.env.ANALYZER) {
    config.plugins.push(new BundleAnalyzerPlugin());
  }

  return config;
};

const splitChunks = () => (config) => {
  config.optimization.splitChunks = {
    chunks: "all",
    minSize: 100000,
    maxSize: 500000,
    minChunks: 2,
    maxAsyncRequests: 30,
    maxInitialRequests: 30,
    automaticNameDelimiter: "~",
    cacheGroups: {
      defaultVendors: {
        test: /[\\/]node_modules[\\/]/,
        priority: -10,
        reuseExistingChunk: true,
      },
      default: {
        minChunks: 2,
        priority: -20,
        reuseExistingChunk: true,
      },
      common: {
        name: `chunk-common`,
        minChunks: 2,
        priority: -20,
        chunks: "initial",
        reuseExistingChunk: true, //如果当前块包含已经从主包中分离出来的模块，那么该模块将被重用，而不是生成新的模块
      },
    },
  };

  return config;
};

module.exports = override(addCompression(), addAnalyzer(), addWebpackPlugin(new ProgressBarPlugin()), splitChunks());

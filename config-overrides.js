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

module.exports = override(addCompression(), addAnalyzer(), addWebpackPlugin(new ProgressBarPlugin()));

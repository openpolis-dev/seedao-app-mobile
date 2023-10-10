module.exports = function override(config, env) {
  config.module.rules.push({
    test: /\.m?js$/,
    resolve: {
      fullySpecified: false, // disable the behaviour
    },
  });
  return config;
};

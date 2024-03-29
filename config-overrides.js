/* config-overrides.js */

module.exports = function override(config, env) {
    okv = {
        fallback: {
            crypto: require.resolve('crypto-browserify'),
            util: false,
            url: false,
        },
    };
    if (!config.resolve) {
        config.resolve = okv;
    } else {
        config.resolve.fallback = {
            ...config.resolve.fallback, ...okv.fallback
        };
    }
    config.experiments = { ...config.experiments, topLevelAwait: true }
    return config;
}
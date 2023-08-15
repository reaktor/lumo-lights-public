/** @type {import('next').NextConfig} */
module.exports = {
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    // Important: return the modified config
    return {
      ...config,
      optimization: { ...config.optimization, minimize: false },
    };
  },
};

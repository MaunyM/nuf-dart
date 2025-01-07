const nextConfig = {
    webpack: (config, options) => {
        // silencing warnings until https://github.com/vercel/next.js/issues/33693 is resolved
        config.infrastructureLogging = {
          level: "error",
        };
    
        config.module.rules.push({
          test: /\.(png|jpg|webp|gif|mp4|mp3|webm|ogg|swf|ogv|woff2)$/i,
          type: "asset/resource",
        });
    
        config.module.rules.push({
          test: /\.svg$/,
          oneOf: [
            {
              issuer: /\.[mjt]sx?$/,
              resourceQuery: /react/,
              use: "@svgr/webpack",
            },
            {
              type: "asset/resource",
            },
          ],
        });
    
        return config;
      }
};

export default nextConfig;

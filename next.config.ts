import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  devIndicators: false,
  // Turbopack config for Next.js 16+ (used in dev by default)
  turbopack: {
    resolveAlias: {
      // Stub out Node.js modules that @tensorflow-models/speech-commands tries to use
      fs: { browser: './app/lib/stubs/empty.js' },
      util: { browser: './app/lib/stubs/util-browser.js' },
    },
  },
  // Webpack config for production builds
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        util: false,
      };
    }
    return config;
  },
};

export default nextConfig;

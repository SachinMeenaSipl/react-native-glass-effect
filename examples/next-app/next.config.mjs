import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // This example sits inside a larger repo that has its own lockfile.
  turbopack: {
    root: here,
    // Web apps render react-native components through react-native-web.
    resolveAlias: { 'react-native': 'react-native-web' },
  },
  webpack(config) {
    config.resolve.alias = { ...config.resolve.alias, 'react-native$': 'react-native-web' };
    return config;
  },
};

export default nextConfig;

import type { NextConfig } from 'next';
import path from 'node:path';

const vercel = process.env.VERCEL === '1' || process.env.DEPLOYMENT_TARGET === 'vercel';
const hostedServicesOrigin = 'https://bennett-cole-law-charleston.braingigllc.chatgpt.site';

const nextConfig: NextConfig = {
  ...(vercel ? {
    env: { NEXT_PUBLIC_HOSTED_SERVICES_ORIGIN: hostedServicesOrigin },
    async redirects() {
      return [
        { source: '/contact', destination: `${hostedServicesOrigin}/contact`, permanent: false },
        { source: '/inbox', destination: `${hostedServicesOrigin}/inbox`, permanent: false },
      ];
    },
  } : {}),
  webpack(config, { webpack }) {
    config.plugins.push(new webpack.NormalModuleReplacementPlugin(
      /^cloudflare:workers$/,
      (resource: { request: string }) => {
        resource.request = path.resolve(process.cwd(), 'lib/node-worker-env.ts');
      },
    ));
    return config;
  },
};
export default nextConfig;

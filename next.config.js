/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'storeror01.blob.core.windows.net',
          port: '',
          pathname: '/**',
        },
      ],
    },
  }

module.exports = nextConfig

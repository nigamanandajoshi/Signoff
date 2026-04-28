import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "arweave.net",
      },
      {
        protocol: "https",
        hostname: "*.arweave.net",
      },
      {
        protocol: "https",
        hostname: "shdw-drive.genesysgo.net",
      },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const apiImageUrl = process.env.NEXT_PUBLIC_API_URL
  ? new URL(process.env.NEXT_PUBLIC_API_URL)
  : null;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      ...(apiImageUrl
        ? [
            {
              protocol: apiImageUrl.protocol === "http:" ? ("http" as const) : ("https" as const),
              hostname: apiImageUrl.hostname,
              port: apiImageUrl.port,
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;

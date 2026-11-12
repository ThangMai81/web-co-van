import type { NextConfig } from "next";

const apiImageUrl = process.env.NEXT_PUBLIC_API_URL
  ? new URL(process.env.NEXT_PUBLIC_API_URL)
  : null;

// Ảnh/video trong /public ít khi đổi: cho trình duyệt giữ 7 ngày, sau đó vẫn dùng bản cũ
// trong lúc tải lại ở nền (khách quay lại thấy ảnh ngay).
const staticMediaCache = [
  {
    key: "Cache-Control",
    value: "public, max-age=604800, stale-while-revalidate=2592000",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      { source: "/images/:path*", headers: staticMediaCache },
      { source: "/videos/:path*", headers: staticMediaCache },
    ];
  },
  images: {
    // Ảnh đã tối ưu (WebP, đúng kích thước) được giữ 31 ngày thay vì tạo lại thường xuyên.
    formats: ["image/webp"],
    minimumCacheTTL: 2_678_400,
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

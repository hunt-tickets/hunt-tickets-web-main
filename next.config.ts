import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure external image domains for Next.js Image component
  images: {
    loader: "custom",
    loaderFile: "./supabase-image-loader.js",
    remotePatterns: [
      {
        // Allow images from Supabase storage
        protocol: "https",
        hostname: "jtfcfsnksywotlbsddqb.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        // Allow images from Supabase image transformation API
        protocol: "https",
        hostname: "jtfcfsnksywotlbsddqb.supabase.co",
        port: "",
        pathname: "/storage/v1/render/image/public/**",
      },
    ],
    // Add these optimization settings
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [96, 128, 256, 384], // Add 96px for your thumbnails
  },
};

export default nextConfig;

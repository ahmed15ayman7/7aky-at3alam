import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://7aky-at3alam.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/api/*",
          "/children/*/assessment",
          "/children/*/diagnosis",
          "/children/*/plans/*/edit",
          "/children/*/sessions/*",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: ["/"],
        disallow: [
          "/api/*",
          "/children/*/assessment",
          "/children/*/diagnosis",
          "/children/*/plans/*/edit",
          "/children/*/sessions/*",
        ],
      },
      {
        userAgent: "bingbot",
        allow: ["/"],
        disallow: [
          "/api/*",
          "/children/*/assessment",
          "/children/*/diagnosis",
          "/children/*/plans/*/edit",
          "/children/*/sessions/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}


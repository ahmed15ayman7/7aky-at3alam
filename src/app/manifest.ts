import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "حقي أتعلم - نظام إدارة العلاج الطبي",
    short_name: "حقي أتعلم",
    description:
      "منصة متكاملة لإدارة علاج الأطفال في مراكز التخاطب. نظام شامل لتتبع التقييمات، التشخيص، وخطط العلاج.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#EAB308",
    orientation: "portrait",
    lang: "ar",
    dir: "rtl",
    scope: "/",
    icons: [
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/logo.png",
        sizes: "any",
        type: "image/png",
        purpose: "any",
      },
    ],
    categories: ["medical", "education", "healthcare", "productivity"],
    shortcuts: [
      {
        name: "الأطفال",
        short_name: "الأطفال",
        description: "عرض وإدارة الأطفال",
        url: "/children",
        icons: [{ src: "/logo.png", sizes: "192x192" }],
      },
      {
        name: "المراكز",
        short_name: "المراكز",
        description: "إدارة المراكز الطبية",
        url: "/centers",
        icons: [{ src: "/logo.png", sizes: "192x192" }],
      },
      {
        name: "الخطط العلاجية",
        short_name: "الخطط",
        description: "مكتبة الخطط العلاجية",
        url: "/plans/library",
        icons: [{ src: "/logo.png", sizes: "192x192" }],
      },
      {
        name: "التحليلات",
        short_name: "التحليلات",
        description: "تحليلات وإحصائيات",
        url: "/analytics",
        icons: [{ src: "/logo.png", sizes: "192x192" }],
      },
    ],
    screenshots: [
      {
        src: "/logo.png",
        sizes: "540x720",
        type: "image/png",
        form_factor: "narrow",
      },
      {
        src: "/logo.png",
        sizes: "720x540",
        type: "image/png",
        form_factor: "wide",
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  };
}


import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cairo",
  display: "swap",
});

const siteUrl = "https://7aky-at3alam.vercel.app";
const siteName = "حقي أتعلم - نظام إدارة العلاج الطبي";
const siteDescription =
  "منصة متكاملة لإدارة علاج الأطفال في مراكز التخاطب. نظام شامل لتتبع التقييمات، التشخيص، وخطط العلاج مع تحليلات متقدمة باستخدام الذكاء الاصطناعي.";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "التخاطب",
    "علاج النطق",
    "تربية خاصة",
    "أطفال",
    "مراكز التخاطب",
    "إدارة العلاج",
    "تقييم الأطفال",
    "خطة علاجية",
    "تحليلات طبية",
    "ذكاء اصطناعي",
    "speech therapy",
    "special education",
    "child therapy",
  ],
  authors: [
    {
      name: "باسم شرف الدين",
      url: siteUrl,
    },
  ],
  creator: "باسم شرف الدين",
  publisher: "حقي أتعلم للتربية الخاصة",
  applicationName: siteName,
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      ar: siteUrl,
      "ar-EG": siteUrl,
    },
  },
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/logo.png" },
      { url: "/logo.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "apple-touch-icon",
        url: "/logo.png",
      },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: siteUrl,
    title: siteName,
    description: siteDescription,
    siteName: siteName,
    images: [
      {
        url: `${siteUrl}/logo.png`,
        width: 1200,
        height: 1200,
        alt: "حقي أتعلم - شعار المنصة",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    images: [`${siteUrl}/logo.png`],
    creator: "@7aky_at3alam",
    site: "@7aky_at3alam",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "حقي أتعلم",
  },
  formatDetection: {
    telephone: true,
    date: true,
    address: true,
    email: true,
  },
  category: "healthcare",
  classification: "Medical Education Platform",
  other: {
    "msapplication-TileColor": "#EAB308",
    "msapplication-TileImage": "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: "حقي أتعلم - نظام إدارة العلاج الطبي",
    description: siteDescription,
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    image: `${siteUrl}/logo.png`,
    founder: {
      "@type": "Person",
      name: "باسم شرف الدين",
      jobTitle: "دكتوراه في التربية الخاصة",
      affiliation: {
        "@type": "Organization",
        name: "كلية علوم الإعاقة والتأهيل",
      },
    },
    sameAs: [
      siteUrl,
    ],
    medicalSpecialty: "Speech-Language Pathology",
    serviceType: "Speech Therapy Management System",
    audience: {
      "@type": "MedicalAudience",
      audienceType: "Speech Therapists and Special Education Centers",
    },
    potentialAction: {
      "@type": "UseAction",
      target: siteUrl,
      name: "إدارة علاج التخاطب",
    },
  };

  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${cairo.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

import { Metadata } from "next";

const siteUrl = "https://7aky-at3alam.vercel.app";
const siteName = "حقي أتعلم - نظام إدارة العلاج الطبي";

interface PageSEOProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
}

/**
 * Generate SEO metadata for pages
 */
export function generatePageSEO({
  title,
  description,
  path = "",
  image = "/logo.png",
  keywords = [],
  noIndex = false,
}: PageSEOProps): Metadata {
  const url = `${siteUrl}${path}`;
  const fullTitle = `${title} | ${siteName}`;
  const imageUrl = image.startsWith("http") ? image : `${siteUrl}${image}`;

  return {
    title: fullTitle,
    description,
    keywords: [
      "التخاطب",
      "علاج النطق",
      "تربية خاصة",
      "أطفال",
      ...keywords,
    ],
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
    openGraph: {
      type: "website",
      locale: "ar_EG",
      url,
      title: fullTitle,
      description,
      siteName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 1200,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
      creator: "@7aky_at3alam",
    },
  };
}

/**
 * Generate breadcrumb JSON-LD for pages
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`,
    })),
  };
}

/**
 * Generate Organization JSON-LD
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: siteName,
    description:
      "منصة متكاملة لإدارة علاج الأطفال في مراكز التخاطب",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    image: `${siteUrl}/logo.png`,
    founder: {
      "@type": "Person",
      name: "باسم شرف الدين",
      jobTitle: "دكتوراه في التربية الخاصة",
    },
    medicalSpecialty: "Speech-Language Pathology",
    serviceType: "Speech Therapy Management System",
  };
}

/**
 * Generate FAQ JSON-LD
 */
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate Article JSON-LD
 */
export function generateArticleSchema({
  title,
  description,
  datePublished,
  dateModified,
  author,
  image,
}: {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: image || `${siteUrl}/logo.png`,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
  };
}


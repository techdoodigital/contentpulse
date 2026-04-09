import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://citewatch.app";

export const metadata: Metadata = {
  title: {
    default: "CiteWatch - Detect Content Decay & Recover Search Rankings",
    template: "%s | CiteWatch",
  },
  description:
    "CiteWatch connects to Google Search Console to detect pages losing traffic and rankings. Get AI-powered recommendations to recover decaying content before competitors take over.",
  keywords: [
    "content decay",
    "content decay detection",
    "search ranking monitor",
    "SEO content monitoring",
    "Google Search Console tool",
    "content health monitoring",
    "ranking drop detection",
    "AI content analysis",
    "content refresh tool",
    "organic traffic recovery",
  ],
  authors: [{ name: "DooDigital" }],
  creator: "DooDigital",
  publisher: "DooDigital",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "CiteWatch",
    title: "CiteWatch - Detect Content Decay & Recover Search Rankings",
    description:
      "Connect Google Search Console, detect pages losing traffic, and get AI recovery plans. Free plan available.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CiteWatch - Detect Content Decay & Recover Search Rankings",
    description:
      "Connect Google Search Console, detect pages losing traffic, and get AI recovery plans.",
  },
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
};

/* JSON-LD structured data for AEO/GEO optimization */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "CiteWatch",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Content decay detection tool that connects to Google Search Console, identifies pages losing search traffic, and provides AI-powered recovery recommendations.",
  url: siteUrl,
  author: {
    "@type": "Organization",
    name: "DooDigital",
    url: "https://doodigital.co",
  },
  offers: [
    {
      "@type": "Offer",
      name: "Starter",
      price: "0",
      priceCurrency: "USD",
      description:
        "Free plan with 1 site, 50 pages, weekly sync, and 5 AI analyses per month.",
    },
    {
      "@type": "Offer",
      name: "Pro",
      price: "19",
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        billingDuration: "P1M",
      },
      description:
        "3 sites, 500 pages, daily sync, 90-day history, and 50 AI analyses per month.",
    },
    {
      "@type": "Offer",
      name: "Advanced",
      price: "39",
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        billingDuration: "P1M",
      },
      description:
        "10 sites, 2000 pages, daily sync, 12-month history, unlimited AI analyses, and API access.",
    },
  ],
  featureList: [
    "Content decay detection from Google Search Console data",
    "AI-powered recovery recommendations",
    "Multi-signal analysis (clicks, impressions, position, CTR)",
    "Decay severity scoring (0-100)",
    "Automated monitoring and alerts",
    "Historical performance tracking",
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is content decay?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Content decay is the gradual decline in a page's search performance over time. Pages that once ranked well start losing positions, clicks, and impressions due to outdated information, increased competition, or shifting search intent.",
      },
    },
    {
      "@type": "Question",
      name: "How does CiteWatch detect decaying content?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CiteWatch connects to your Google Search Console data and compares recent performance against historical baselines. It analyzes four signals: clicks, impressions, average position, and click-through rate. Pages showing significant decline are flagged and scored by severity.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need Google Search Console to use CiteWatch?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. CiteWatch pulls performance data directly from Google Search Console. You need to sign in with the Google account that has access to your verified Search Console properties.",
      },
    },
    {
      "@type": "Question",
      name: "Is my data private and secure?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Each user's data is completely isolated. Your Search Console data, decay reports, and AI analyses are only accessible to you. CiteWatch never shares, aggregates, or uses your data for any purpose other than providing your reports.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

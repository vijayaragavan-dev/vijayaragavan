import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/layout/ScrollProgress";
import SmoothScroll from "@/components/layout/SmoothScroll";
import CustomCursor from "@/components/layout/CustomCursor";
import { ToastProvider } from "@/components/ui/Toast";
import { profile } from "@/data/profile";
import { links, site } from "@/data/links";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: "%s — Vijayaragavan",
  },
  description: site.description,
  applicationName: "Vijayaragavan Portfolio",
  authors: [{ name: profile.name, url: site.url }],
  creator: profile.name,
  publisher: profile.name,
  keywords: [
    "Vijayaragavan",
    "Software Developer",
    "Backend Developer",
    "Full Stack Developer",
    "AI ML Enthusiast",
    "Computer Science Student",
    "Java",
    "Python",
    "Spring Boot",
    "React",
    "Next.js",
    "Portfolio",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: "Vijayaragavan — Portfolio",
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#07090D",
  colorScheme: "dark",
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: site.url,
  image: `${site.url}${profile.photo}`,
  jobTitle: profile.title,
  description: site.description,
  email: `mailto:${profile.email}`,
  address: {
    "@type": "PostalAddress",
    addressRegion: "Tamil Nadu",
    addressCountry: "IN",
  },
  sameAs: [links.github, links.linkedin, links.leetcode],
  knowsAbout: [
    "Java",
    "Python",
    "JavaScript",
    "Spring Boot",
    "REST APIs",
    "MySQL",
    "MongoDB",
    "Data Structures and Algorithms",
    "Object-Oriented Programming",
    "Machine Learning",
    "Generative AI",
    "Agentic AI",
    "Prompt Engineering",
    "LangChain",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-svh bg-transparent font-sans text-ink antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <a
          href="#main"
          className="sr-only z-[100] rounded-md bg-emerald px-4 py-2 text-sm font-medium text-[#04110e] focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <div className="site-backdrop" aria-hidden="true" />
        <ToastProvider>
          <SmoothScroll>
            <ScrollProgress />
            <CustomCursor />
            <Navbar />
            {children}
            <Footer />
          </SmoothScroll>
        </ToastProvider>
      </body>
    </html>
  );
}

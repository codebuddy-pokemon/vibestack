import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/shared/navbar";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

export const metadata: Metadata = {
  title: {
    default: "VibeStack - AI Landing Page Builder",
    template: "%s | VibeStack",
  },
  description: "Generate production-ready landing pages in seconds with AI. Text to website, screenshot to code, and more.",
  keywords: ["AI website builder", "landing page generator", "React code generator", "Tailwind CSS builder"],
  authors: [{ name: "VibeStack Team" }],
  creator: "VibeStack",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vibestack.ai",
    title: "VibeStack - AI Landing Page Builder",
    description: "Generate production-ready landing pages in seconds with AI.",
    siteName: "VibeStack",
  },
  twitter: {
    card: "summary_large_image",
    title: "VibeStack - AI Landing Page Builder",
    description: "Generate production-ready landing pages in seconds with AI.",
    creator: "@vibestack",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jakarta.variable} ${outfit.variable} font-sans antialiased`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}

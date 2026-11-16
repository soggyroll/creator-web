/** @format */
import { Barlow_Condensed, Figtree } from "next/font/google";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/ui/themes";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/components/providers";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree", display: "swap" });
const barlowCondensed = Barlow_Condensed({
  weight: ["500", "600"],
  subsets: ["latin"],
  variable: "--font-barlow",
  display: "swap",
});

const DESCRIPTION =
  "ComfyUI workflows on demand. Buy credits, run generations, download results. No GPU, no config, no subscription.";

export const metadata: Metadata = {
  metadataBase: new URL("https://soggyroll.art"),

  title: {
    default: "Soggy Roll — Make room for ideas",
    template: "%s | Soggy Roll",
  },
  description: DESCRIPTION,
  applicationName: "Soggy Roll",
  keywords: [
    "ComfyUI",
    "GPU compute",
    "AI image generation",
    "stable diffusion",
    "workflow runner",
    "on-demand GPU",
    "no subscription GPU",
    "ComfyUI cloud",
    "generative AI",
    "image generation API",
  ],

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://soggyroll.art",
    siteName: "Soggy Roll",
    title: "Soggy Roll",
    description: DESCRIPTION,
  },

  twitter: {
    card: "summary_large_image",
    title: "Soggy Roll",
    description: DESCRIPTION,
    site: "@soggyroll",
  },

  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/icon.png" }],
    shortcut: "/favicon.png",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ theme: shadcn }}>
      <html
        suppressHydrationWarning
        lang="en"
        className={cn(
          "h-full",
          "antialiased",
          figtree.variable,
          barlowCondensed.variable,
          "font-sans",
        )}
      >
        <body className="min-h-full flex flex-col">
          <Providers>
            <Toaster richColors />
            {children}
            <Analytics />
            <SpeedInsights />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}

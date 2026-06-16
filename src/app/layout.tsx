/** @format */
import { Bebas_Neue, Figtree, Inter } from "next/font/google";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/ui/themes";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/components/providers";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const interHeading = Inter({ subsets: ["latin"], variable: "--font-heading" });
const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });
const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Soggy Roll",
  description:
    "ComfyUI workflows on demand. Buy credits, run generations, download results. No GPU required.",
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
          interHeading.variable,
          figtree.variable,
          bebasNeue.variable,
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

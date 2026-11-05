import type { Metadata } from "next";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SismoLive",
  description: "Sismos y volcanes de Chile en tiempo real, con datos de USGS y SERNAGEOMIN.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f3f0e9",
  colorScheme: "light",
} as const;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${sourceSans.variable} ${sourceSerif.variable} h-full antialiased`}
      // Browser extensions inject attributes on <html> before hydration (e.g. data-yd-*).
      // This only ignores attribute mismatches on this element, not its children.
      suppressHydrationWarning
    >
      <body className="min-h-full bg-bg font-sans text-ink lg:h-full lg:overflow-hidden">
        {children}
      </body>
    </html>
  );
}

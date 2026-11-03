import type { Metadata } from "next";
import { Geist, Poppins } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-logo",
  weight: "800",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SismoLive",
  description: "Sismos y volcanes de Chile en tiempo real, con datos de USGS y SERNAGEOMIN.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${poppins.variable} h-full antialiased`}
      // Browser extensions inject attributes on <html> before hydration (e.g. data-yd-*).
      // This only ignores attribute mismatches on this element, not its children.
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col md:h-full">{children}</body>
    </html>
  );
}

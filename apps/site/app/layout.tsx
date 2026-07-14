import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SiteCommandPalette } from "./_components/site-command-palette";
import "./globals.css";

const poppins = localFont({
  src: "../public/Poppins-Regular.ttf",
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "chrome — components by justin06lee",
  description:
    "A component registry of polished, copy-paste React components. Run `bunx @justin06lee/chrome@latest init` to get started.",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <SiteCommandPalette />
        <Analytics />
      </body>
    </html>
  );
}

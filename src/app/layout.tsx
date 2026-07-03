import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Simon Kane | Retro Portfolio OS",
  description: "A retro Windows-inspired portfolio with 3D and ugly modes."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

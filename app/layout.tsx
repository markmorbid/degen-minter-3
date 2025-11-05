import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Degen Minter - Bitcoin Ordinals Inscription",
  description: "Create Bitcoin Ordinals inscriptions with custom images",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

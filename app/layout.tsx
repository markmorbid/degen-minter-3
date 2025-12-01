import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
      <head>
        <link rel="icon" href="https://degent.club/wp-content/uploads/2025/10/favicon-300x300.png" type="image/png" />
      </head>
      <body className="antialiased bg-degent-dark selection:bg-degent-green">
        
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}

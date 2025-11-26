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
      <body className="bg-degent-dark text-white font-sans antialiased selection:bg-degent-green selection:text-degent-dark">
        {/* Optional: Add a subtle noise texture overlay */}
        <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-degent-green/10 via-transparent to-degent-orange/10"></div>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}

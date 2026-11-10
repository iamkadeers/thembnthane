import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { BreakingNewsTicker } from "@/components/BreakingNewsTicker";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "MBN – Modern Indian Digital News Platform",
  description: "Independent, bold, people-focused digital news media covering India, Maharashtra, public issues, and citizen journalism.",
  keywords: ["MBN", "Indian News", "Citizen Journalism", "MBN Squad", "Ground Reality"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased min-h-screen flex flex-col bg-white text-black selection:bg-black selection:text-white"
      >
        <LanguageProvider>
          <BreakingNewsTicker />
          <Header />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}

import React from 'react';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { cn } from "../src/lib/utils";
import { Header } from "../src/components/Header";
import { Footer } from "../src/components/Footer";
import { ClientLayout } from "./ClientLayout";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Life-Guide",
  description: "Жизненные советы, которые всегда полезны",
  keywords: ["guides", "life advice", "education", "self-improvement"],
  authors: [{ name: "Life-Guide Team" }],
  creator: "Life-Guide",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://life-guide.example.com",
    title: "Life-Guide",
    description: "Жизненные советы, которые всегда полезны",
    siteName: "Life-Guide",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased flex flex-col",
          inter.variable
        )}
        style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
      >
        <ClientLayout>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </ClientLayout>
      </body>
    </html>
  );
}

import React from 'react';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils"
import { Header } from "@/components/Header"; // Импорт Header
import { Footer } from "@/components/Footer"; // Импорт Footer

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "LifeGuide",
  description: "Цифровой помощник для школьников",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
         className={cn(
           "min-h-screen bg-background font-sans antialiased flex flex-col", // Добавим flex для прижатия футера
           inter.variable
         )}
      >
        <Header /> {/* Используем Header */}
        <main className="container mx-auto py-4 flex-grow"> {/* flex-grow чтобы main занимал доступное место */}
          {children}
        </main>
        <Footer /> {/* Используем Footer */}
      </body>
    </html>
  );
}
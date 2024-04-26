import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ThemeSwitch from "./_components/themeSwitch";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Providers from "@/app/_components/providers";
import dynamic from 'next/dynamic';
const Footer = dynamic( () => import('@/app/_components/footer'), { ssr: false } ); // lazy loading

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Jet Comparator",
  description: "Compare Jet models using OpenAI",
};

export default async function RootLayout({ children }: Readonly<{children: React.ReactNode;}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen`}>
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="sticky top-0 z-50 w-full backdrop-blur-lg backdrop-opacity-90 bg-secondary-rgba">
              <header className="flex flexRow justify-between items-center p-4">
                <div className="text-lg font-bold">
                  AI Jet Comparator
                </div>
                <ThemeSwitch />
              </header>
            </div>
            {children}
            <Footer />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}

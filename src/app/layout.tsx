import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ThemeSwitch from "./_components/themeSwitch";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import initializeDb from "@/app/db";
import Providers from "@/app/_components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Jet Comparator",
  description: "Compare Jet models using OpenAI",
};

initializeDb(); // initialize database connection

export default function RootLayout({ children }: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <header className="flex flexRow justify-between items-center p-4">
              <div className="text-lg font-bold">
                AI Jet Comparator
              </div>
              <ThemeSwitch />
            </header>
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}

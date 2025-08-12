import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "@/lib/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QART - Dijital Kartvizit Sistemi",
  description: "NFC teknolojisi ile dijital kartvizitinizi paylaşın",
  keywords: "nfc, dijital kartvizit, qr kod, kartvizit, business card",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark">
      <body className={`${inter.className} bg-[#0A0B0D] text-white min-h-screen`}>
        <AuthProvider>
          <ThemeProvider defaultThemeId="default">
            <Toaster position="top-center" />
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

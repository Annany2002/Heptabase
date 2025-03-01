import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "./header";
import { Toaster } from "@/components/ui/toaster";

const monte = Montserrat({ weight: ["100", "300", "500"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HeptaBase",
  description: "PDF Conversations Simplified with Heptabase 📄💬",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${monte.className} antialiased`}>
        <Providers>
          <Header />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}

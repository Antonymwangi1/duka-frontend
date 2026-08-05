"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useInitAuth } from "@/hooks/useInitAuth";

function AuthInitializer() {
  useInitAuth();
  return null;
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClientProvider client={queryClient}>
          <AuthInitializer />
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}

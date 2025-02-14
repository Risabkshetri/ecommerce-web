import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils"
import AIChatbot from "@/components/Chatbot";
import Navbar from "@/components/Navbar";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: "Elctro Store",
  description: "AI Based Electro Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
       className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.variable
      )}
      >
        <Navbar />
        <AIChatbot />
        {children}
        </body>
    </html>
  );
}
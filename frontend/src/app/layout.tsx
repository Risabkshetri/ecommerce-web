import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils"
import AIChatbot from "@/components/Chatbot";
import Navbar from "@/components/Navbar";

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
        "min-h-screen bg-background font-sans antialiased"
      )}
      >
        <Navbar />
        <AIChatbot />
        {children}
        </body>
    </html>
  );
}
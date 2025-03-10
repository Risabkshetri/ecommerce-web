import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils"
import AIChatbot from "@/components/Chatbot";
import Navbar from "@/components/Navbar";
import {ToastContainer} from "react-toastify";
import { CartProvider } from "@/context/CartContext";
import { OrderProvider } from "@/context/OrderContext";

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: "Electro Store",
  description: "AI Based Electro Store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
       
        <CartProvider>
        <OrderProvider>
        <AIChatbot />
        <ToastContainer />
        <Navbar />
        {children}
        </OrderProvider>
        </CartProvider>
      </body>
    </html>
  );
}
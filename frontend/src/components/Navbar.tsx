"use client";

import * as React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, ShoppingCart, User } from "lucide-react";
import { useCart } from '@/context/CartContext';

const categories: { title: string; href: string; description: string }[] = [
  {
    title: "Smartphones & Accessories",
    href: "/category/smartphones-accessories",
    description: "Find the latest smartphones, cases, chargers, and more.",
  },
  {
    title: "Laptops & Computers",
    href: "/category/laptops-computers",
    description: "Shop for high-performance laptops, desktops, and accessories.",
  },
  {
    title: "Audio & Headphones",
    href: "/category/audio-headphones",
    description: "Discover premium speakers, earbuds, and headphones.",
  },
  {
    title: "Gaming & Consoles",
    href: "/category/gaming-consoles",
    description: "Get the latest gaming consoles, games, and accessories.",
  },
];

export default function Navbar() {
  const { cart } = useCart();
  
  return (
    <NavigationMenu className="bg-white dark:bg-gray-900 shadow-lg py-2 sm:py-4 px-4 sm:px-6 lg:px-8 fixed top-0 left-0 right-0 w-full max-w-[100vw] z-50 transition-all duration-300 ease-in-out">
      <NavigationMenuList className="flex items-center w-full max-w-7xl mx-auto">
        {/* Mobile Menu */}
        <NavigationMenuItem className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4">
                <Link href="/" className="text-lg font-bold">
                  Electro Store
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.title}
                    href={category.href}
                    className="text-sm"
                  >
                    {category.title}
                  </Link>
                ))}
                <Link href="/deals" className="text-sm">
                  Deals
                </Link>
                <Link href="/products" className="text-sm">
                  Products
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </NavigationMenuItem>

        {/* Desktop Layout */}
        <div className="hidden lg:flex w-full items-center justify-between">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-xl font-bold")}>
                Electro Store
              </NavigationMenuLink>
            </Link>
          </div>

          {/* Center Navigation */}
          <div className="flex items-center justify-center space-x-4 flex-1 mx-8">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-sm font-medium">Categories</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {categories.map((category) => (
                    <ListItem
                      key={category.title}
                      title={category.title}
                      href={category.href}
                    >
                      {category.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link href="/deals" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Deals
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link href="/products" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Products
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem className="flex-grow">
              <Input placeholder="Search products..." className="w-full max-w-md" />
            </NavigationMenuItem>
          </div>

          {/* Right Section - Cart and Sign In */}
          <div className="flex items-center">
            <NavigationMenuItem>
              <Link href="/sign-up" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <User className="mr-2 h-4 w-4" />
                  Signup
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link href="/cart" className="relative">
                <Button variant="outline">
                  <ShoppingCart className="mr-2" />
                  Cart 
                  {cart.length > 0 && (
                    <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
                      {cart.reduce((total, item) => total + item.quantity, 0)}
                    </span>
                  )}
                </Button>
              </Link>
            </NavigationMenuItem>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="flex lg:hidden w-full items-center justify-between">
          <Link href="/" className="text-lg font-bold">
            Electro Store
          </Link>
          <div className="flex items-center space-x-4">
            <Input placeholder="Search products..." className="w-full max-w-[200px]" />
            <Link href="/cart" className="relative">
              <Button variant="outline" size="sm">
                <ShoppingCart className="h-4 w-4" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
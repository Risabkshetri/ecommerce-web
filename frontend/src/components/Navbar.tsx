"use client"

import * as React from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, ShoppingCart, User } from "lucide-react"

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
    description: "Get the latest gaming consoles, accessories, and games.",
  },
];


export default function Navbar(){
  return (
    <NavigationMenu className="bg-white dark:bg-gray-900 shadow-lg py-2 sm:py-4 px-4 sm:px-6 lg:px-8 fixed top-0 left-0 right-0 w-full max-w-[100vw] z-50 transition-all duration-300 ease-in-out">
      <NavigationMenuList className="flex items-center justify-between w-full max-w-7xl mx-auto">
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
                <Link href="/sign-up" className="text-sm">
                <User className="mr-2 h-4 w-4" />
                 Signup
                </Link>
                <Link href="/cart" className="text-sm">
                <ShoppingCart className="mr-2 h-4 w-4" />
                  Cart
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </NavigationMenuItem>
        <NavigationMenuItem className="mr-4">
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-xl font-bold")}>
            Electro Store
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden md:flex">
          <NavigationMenuTrigger className="text-sm font-medium">Categories</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
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
        <NavigationMenuItem className="hidden md:flex">
          <Link href="/deals" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Deals
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden md:flex">
          <Link href="/products" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              products
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="flex-grow mx-4">
          <Input placeholder="Search products..." className="w-full max-w-md" />
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden md:flex">
          <Link href="/sign-up" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <User className="mr-2 h-4 w-4" />
              Signup
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/cart" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Cart
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
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
  )
})
ListItem.displayName = "ListItem"

'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import electronicsGadgets from "../../data/dummydata.json"
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import Image from 'next/image';

interface Gadget {
  id?: string;
  name: string;
  price: number;
  image: string;
}

const ITEMS_PER_PAGE = 8;

const ElectronicsMenu: React.FC = () => {
  const { addToCart, cart } = useCart();
  const data: { electronicsGadgets: Gadget[] } = electronicsGadgets;
  const [currentPage, setCurrentPage] = useState(1);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  // Calculate pagination values
  const totalItems = data.electronicsGadgets.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = data.electronicsGadgets.slice(startIndex, endIndex);

  const handleAddToCart = (item: Gadget) => {
    try {
      addToCart({
        id: item.id ?? '',
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 0
      });
      
      toast(`${item.name} has been added to you cart `);
    } catch (error) {
      toast('Failed to add item to cart');
    }
  };

  const getItemQuantityInCart = (itemId: string): number => {
    const cartItem = cart.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push('ellipsis');
      }
    }
    return pages.filter((page, index, array) =>
      page === 'ellipsis' ? array[index - 1] !== 'ellipsis' : true
    );
  };

  return (
    <div className="container mx-auto py-8 mt-24">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-center mb-2">Electro Store</h1>
        <p className="text-center text-gray-600">Discover the latest in tech products</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentItems.map((item) => {
          const quantityInCart = getItemQuantityInCart(item.id);
          
          return (
            <Card key={item.id} className="flex flex-col justify-between hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <Image
                    src={item.image}
                    alt={item.name}
                    className="object-contain h-40 w-40"
                  />
                </div>
                <CardTitle className="text-lg">{item.name}</CardTitle>
              </CardHeader>
              
              <CardContent>
                <p className="text-2xl font-bold text-primary">
                  {formatPrice(item.price)}
                </p>
              </CardContent>

              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => handleAddToCart(item)}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {quantityInCart > 0 ? 'Add Another' : 'Add to Cart'}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>

            {getPageNumbers().map((pageNumber, index) => (
              <PaginationItem key={index}>
                {pageNumber === 'ellipsis' ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    onClick={() => setCurrentPage(pageNumber as number)}
                    isActive={currentPage === pageNumber}
                    className="cursor-pointer"
                  >
                    {pageNumber}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default ElectronicsMenu;
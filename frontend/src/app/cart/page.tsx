// src/app/cart/page.tsx
'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import CartItem from '@/components/order/CartItem';
import OrderSummary from '@/components/order/OrderSummary';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { redirect } from 'next/navigation';

// Define the type for the CartItem props
interface CartItemProps {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
}

// Define the type for the OrderSummary props
interface OrderSummaryProps {
  order: {
    items: CartItemProps[];
    customerDetails: {
      address: string;
    };
  };
  onProceedToPayment: () => void;
}

export default function CartPage() {
  const { cart, clearCart } = useCart();
  console.log(cart);

  const handleProceedToPayment = () => {
    redirect('/checkout');
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-brand-primary">
          Your Cart
        </h1>

        {cart.length === 0 ? (
          <div className="text-center bg-amber-50 p-8 rounded-lg border-2 border-dashed border-amber-200">
          <div className="mb-6 flex justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 64 64" 
              className="w-24 h-24 text-amber-600"
              fill="currentColor"
            >
              <path d="M32 2L2 22l30 20 30-20L32 2zm0 60l-22-14v-22l22 14 22-14v22L32 62z"/>
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-amber-900 mb-3">
            Your Tech Adventure Awaits!
          </h3>
          <p className="text-amber-700 mb-4">
            Looks like your tech exploration is on pause. Ready to discover the latest gadgets?
          </p>
          <Link href="/electronics">
            <Button className="bg-amber-700 hover:bg-amber-800 transition-colors">
              Explore Cutting-Edge Gadgets
            </Button>
          </Link>
        </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-white rounded-lg p-6 shadow-md">
              {cart.map((item) => (
                <CartItem 
                  key={`${item.id}`}
                  {...item}
                />
              ))}
              <div className="flex justify-between mt-4">
                <Button 
                  variant="outline"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </div>
            </div>

            <div>
              <OrderSummary 
                order={{ 
                  items: cart, 
                  customerDetails: { 
                    address: 'Delivery Address' 
                  } 
                }}
                onProceedToPayment={handleProceedToPayment}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
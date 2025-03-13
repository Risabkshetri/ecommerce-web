'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import CartItem from '@/components/order/CartItem';
import OrderSummary from '@/components/order/OrderSummary';
import Payment from '@/components/Payment';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

// Define the type for the CartItem
export interface CartItemType {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

// Define the type for the OrderSummary props
interface OrderSummaryProps {
  order: {
    items: CartItemType[];
    customerDetails: {
      address: string;
    };
  };
  onProceedToPayment: () => void;
}

// Define possible checkout steps
type CheckoutStep = 'cart' | 'payment';

export default function CartPage() {
  const { cart, clearCart } = useCart();
  // Track the current step in the checkout process
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('cart');
  
  // Calculate order total for payment
  const orderTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const handleProceedToPayment = () => {
    // Instead of redirecting, just change the checkout step
    setCheckoutStep('payment');
  };
  
  const handleBackToCart = () => {
    setCheckoutStep('cart');
  };

  // Show empty cart message
  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-center text-brand-primary">
            Your Cart
          </h1>
          
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
        </div>
      </div>
    );
  }

  // Show cart or payment based on the current step
  return (
    <div className="min-h-screen pt-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-brand-primary">
          {checkoutStep === 'cart' ? 'Your Cart' : 'Complete Your Payment'}
        </h1>

        {checkoutStep === 'cart' ? (
          // Cart view
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
        ) : (
          // Payment view
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg p-6 shadow-md mb-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={`summary-${item.id}`} className="flex justify-between">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-600 ml-2">x{item.quantity}</span>
                      </div>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹{orderTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <Button 
                variant="outline"
                onClick={handleBackToCart}
                className="mb-6"
              >
                Back to Cart
              </Button>
            </div>

            <div className="md:col-span-1">
              {/* Integrate the Payment component */}
              <Payment 
                defaultAmount={orderTotal.toString()}
                orderId={`ORDER-${Date.now()}`}
                onPaymentSuccess={() => {
                  // Handle successful payment (e.g., clear cart and show success page)
                  clearCart();
                  // In a real app, you might redirect to a success page
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
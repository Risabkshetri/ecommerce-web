'use client'
import { useState, useEffect } from 'react';

interface CartItem {
  id: string | number;
  name: string;
  price: number;
  image: string;
  quantity: number; // Added quantity as a required property
  [key: string]: any;
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      console.log("Saved Cart", savedCart);
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return currentCart.map(cartItem => 
          cartItem.id === item.id 
            ? {...cartItem, quantity: cartItem.quantity + 1}
            : cartItem
        );
      }
      console.log(currentCart);
      return [...currentCart, {...item, quantity: 1}];
    });
  };

  const removeFromCart = (itemId: CartItem['id']) => {
    setCart(currentCart => 
      currentCart.filter(item => item.id !== itemId)
    );
  };

  const updateQuantity = (itemId: CartItem['id'], newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(currentCart => 
        currentCart.map(item => 
          item.id === itemId 
            ? {...item, quantity: newQuantity}
            : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const calculateTotal = (): number => {
    return cart.reduce((total, item) => 
      total + (item.price * item.quantity), 0
    );
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    calculateTotal
  };
}
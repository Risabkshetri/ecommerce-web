// context/CartContext.tsx
'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface CartItem {
  id: string | number;
  name: string
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string | number) => void;
  updateQuantity: (itemId: string | number, quantity: number) => void;
  clearCart: () => void;
  calculateTotal: () => number;
}

const CartContext = createContext<CartContextType | null>(null);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = useCallback((item: CartItem) => {
    const existingItemIndex = cart.findIndex(
      cartItem => cartItem.id === item.id
    );

    if (existingItemIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      setCart(prev => [...prev, { ...item, quantity: 1, }]);
    }
  }, [cart]);

  const removeFromCart = useCallback((itemId: string | number) => {
    setCart(prev => prev.filter(item => 
      item.id !== itemId
    ));
  }, []);

  const updateQuantity = useCallback((itemId: string | number, quantity: number) => {
    const updatedCart = cart.map(item => 
      (item.id === itemId) 
        ? { ...item, quantity } 
        : item
    );
    setCart(updatedCart);
  }, [cart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const calculateTotal = useCallback(() => {
    return cart.reduce((total, item) => 
      total + (item.price * item.quantity), 0
    );
  }, [cart]);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      calculateTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
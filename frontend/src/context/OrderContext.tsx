'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface CartItem {
  id: string | number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  [key: string]: any;
}

interface CustomerDetails {
  name: string;
  email: string;
  address: string;
  [key: string]: any;
}

interface Order {
  id: string;
  items: CartItem[];
  customerDetails: CustomerDetails;
  status: string;
  timestamp: Date;
  total: number;
}

interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  createOrder: (cartItems: CartItem[], customerDetails: CustomerDetails) => Order;
  updateOrderStatus: (orderId: string, newStatus: string) => void;
  getOrderById: (orderId: string) => Order | undefined;
}

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderContext = createContext<OrderContextType>({
  orders: [],
  currentOrder: null,
  createOrder: () => {
    throw new Error('createOrder not implemented');
  },
  updateOrderStatus: () => {},
  getOrderById: () => undefined
});

export const OrderProvider = ({ children }: OrderProviderProps): JSX.Element => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const createOrder = useCallback((cartItems: CartItem[], customerDetails: CustomerDetails): Order => {
    const newOrder: Order = {
      id: Date.now().toString(),
      items: cartItems,
      customerDetails,
      status: 'Order Placed',
      timestamp: new Date(),
      total: cartItems.reduce((total, item) => 
        total + (item.price * item.quantity), 0)
    };

    setOrders(prev => [...prev, newOrder]);
    setCurrentOrder(newOrder);
    return newOrder;
  }, []);

  const updateOrderStatus = useCallback((orderId: string, newStatus: string): void => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus }
          : order
      )
    );

    if (currentOrder?.id === orderId) {
      setCurrentOrder(prev => prev ? { ...prev, status: newStatus } : null);
    }
  }, [currentOrder]);

  const getOrderById = useCallback((orderId: string): Order | undefined => {
    return orders.find(order => order.id === orderId);
  }, [orders]);

  const value: OrderContextType = {
    orders,
    currentOrder,
    createOrder,
    updateOrderStatus,
    getOrderById
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  
  return context;
};
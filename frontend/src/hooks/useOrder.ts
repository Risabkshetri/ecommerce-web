'use client'
import { useState, useCallback } from 'react';

interface CartItem {
  id: string | number;
  price: number;
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

export const useOrder = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const createOrder = useCallback((
    cartItems: CartItem[], 
    customerDetails: CustomerDetails
  ): Order => {
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

  const updateOrderStatus = useCallback((
    orderId: string, 
    newStatus: string
  ): void => {
    const updatedOrders = orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus }
        : order
    );
    setOrders(updatedOrders);

    if (currentOrder && currentOrder.id === orderId) {
      setCurrentOrder(prev => prev ? { ...prev, status: newStatus } : null);
    }
  }, [orders, currentOrder]);

  const getOrderById = useCallback((
    orderId: string
  ): Order | undefined => {
    return orders.find(order => order.id === orderId);
  }, [orders]);

  return {
    orders,
    currentOrder,
    createOrder,
    updateOrderStatus,
    getOrderById
  };
};
// components/order/OrderSummary.tsx
import React from 'react';
import { Button } from "@/components/ui/button";

interface OrderSummaryProps {
  order: {
    items: {
      id: string | number;
      name: string;
      price: number;
      quantity: number;
    }[];
    customerDetails: {
      address: string;
    };
  };
  onProceedToPayment: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ order, onProceedToPayment }) => {
  const total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h3 className="text-xl font-bold mb-4">Order Summary</h3>
      <p>Total Items: {order.items.length}</p>
      <p>Total Price: ${total.toFixed(2)}</p>
      <p>Delivery Address: {order.customerDetails.address}</p>
      <Button onClick={onProceedToPayment} className="mt-4 w-full">
        Proceed to Payment
      </Button>
    </div>
  );
};

export default OrderSummary;
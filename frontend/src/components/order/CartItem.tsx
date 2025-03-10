import React from 'react';
import Image from 'next/image';
import { 
  Plus, 
  Minus, 
  Trash2 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useCart } from '@/context/CartContext';

interface PriceObject {
  [key: string]: number;
}

interface CartItemProps {
  id: string | number;
  name: string;
  price: number | PriceObject;
  quantity: number;
  image?: string;
}

export default function CartItem({ 
  id, 
  name, 
  price, 
  quantity, 
  image
}: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  // Calculate price
  const calculatePrice = (): number => {
    return typeof price === 'number' ? price : Object.values(price)[0];
  };

  const itemPrice = calculatePrice();
  const totalPrice = itemPrice * quantity;

  return (
    <div className="flex items-center border-b py-4 space-x-4">
      <div className="relative h-20 w-20 flex-shrink-0">
        <Image 
          src={image || '/placeholder-dish.jpg'} 
          alt={name} 
          fill 
          className="object-cover rounded-md"
        />
      </div>

      <div className="flex-grow">
        <h3 className="font-semibold">{name}</h3>
        <p className="text-brand-primary font-bold">
          ₹{totalPrice.toFixed(2)}
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => updateQuantity(id, Math.max(1, quantity - 1))}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span>{quantity}</span>
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => updateQuantity(id, quantity + 1)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Button 
        variant="destructive" 
        size="icon"
        onClick={() => removeFromCart(id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
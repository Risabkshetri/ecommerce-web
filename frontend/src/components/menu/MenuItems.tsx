import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { useCart } from '@/context/CartContext';

interface Gadget {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface GadgetItemProps {
  id: string;
  name: string;
  price: number;
  image: string;
}

export default function GadgetItem({
  id,
  name,
  price,
  image,
}: GadgetItemProps) {
  const [quantity, setQuantity] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id,
      name,
      price,
      image,
      quantity
    });
    setDialogOpen(false);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="relative h-48 w-full">
        <Image
          src={image || '/placeholder-gadget.jpg'}
          alt={name}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold">{name}</h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold">
              ₹{price.toFixed(2)}
            </span>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full bg-amber-600 hover:bg-purple-700" onClick={() => setDialogOpen(true)}>
                Add to Cart
              </Button>
            </DialogTrigger>
            {dialogOpen && ( 
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Customize {name}</DialogTitle>
                </DialogHeader>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus />
                    </Button>
                    <span>{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus />
                    </Button>
                  </div>
                  <Button
                    onClick={handleAddToCart}
                    className="flex-grow"
                  >
                    <ShoppingCart className="mr-2" /> Add to Cart
                  </Button>
                </div>
              </DialogContent>
            )}
          </Dialog>
        </div>
      </div>
    </motion.div>
  );
}
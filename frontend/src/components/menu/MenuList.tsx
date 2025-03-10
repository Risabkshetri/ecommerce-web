'use client'
import React, { useState, useMemo } from 'react';
import GadgetItem from './MenuItems';
import { Input } from "@/components/ui/input";

interface Gadget {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface MenuListProps {
  menuData: Gadget[];
}

export default function MenuList({ menuData }: MenuListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    return menuData.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [menuData, searchTerm]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Input 
          placeholder="Search gadgets" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <GadgetItem 
            key={item.id}
            id={item.id}
            name={item.name}
            price={item.price}
            image={item.image}
          />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No gadgets found
        </div>
      )}
    </div>
  );
}
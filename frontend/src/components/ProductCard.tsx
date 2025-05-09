// Product Card Component with Hover Description
'use client';
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import {ShoppingCart } from "lucide-react"
import { Product } from "@/types/products";

export default function ProductCard({ product } : { product: Product }) {
    const [isHovered, setIsHovered] = useState(false);
    
    // // Format price from cents to dollars with appropriate formatting
    // const formattedPrice = new Intl.NumberFormat('en-US', {
    //   style: 'currency',
    //   currency: 'USD',
    //   minimumFractionDigits: 0
    // }).format(product.price);
    
    return (
      <Card 
        className="h-full hover:shadow-lg transition-shadow duration-300 relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-4">
          <div className="overflow-hidden mb-4 relative">
            {/* Stock status badge */}
            <div className={`absolute top-2 right-2 z-10 px-2 py-1 text-xs font-bold text-white rounded-full ${
              product.inStock ? "bg-green-500" : "bg-red-500"
            }`}>
              {product.inStock ? "In Stock" : "Out of Stock"}
            </div>
            
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-48 object-contain transition-transform duration-500 ease-out hover:scale-110"
              loading="lazy"
            />
            
            {/* Product Description Overlay */}
            <div 
              className={`absolute inset-0 bg-purple-600 bg-opacity-90 flex flex-col justify-center p-4 transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <div className="text-white whitespace-pre-line">
                {product.description}
              </div>
              
              {/* Color options */}
              {product.colorOptions && product.colorOptions.length > 0 && (
                <div className="mt-2">
                  <p className="text-white text-sm font-medium mb-1">Available Colors:</p>
                  <div className="flex gap-2">
                    {product.colorOptions.map(color => (
                      <span key={color} className="text-white text-xs bg-purple-700 px-2 py-1 rounded-full">
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <p className="font-bold text-lg">₹{product.price}</p>
            
            {/* Color options preview (visible without hover) */}
            {product.colorOptions && product.colorOptions.length > 0 && (
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <span>Colors:</span>
                <span>{product.colorOptions.join(", ")}</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full bg-purple-600 hover:bg-purple-700 transition-colors duration-300 flex items-center justify-center gap-2"
            disabled={!product.inStock}
          >
            <ShoppingCart className="h-4 w-4" />
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        </CardFooter>
      </Card>
    );
  }
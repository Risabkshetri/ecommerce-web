export interface Product {
    _id: string;
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
    inStock: boolean;
    colorOptions: string[];
    createdAt: string;
    updatedAt: string;
  }
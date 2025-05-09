import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/products';


export interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    description?: string;
    inStock: boolean;
    colorOptions?: string[];
}


// Function to create a new product
export const createProduct = async (productData:Product) => {
    try {
        const response = await axios.post(`${BASE_URL}/create_products`, productData);
        return response.data;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};

// Function to fetch all products
export const getAllProducts = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/get_all_products`);
        return response.data;
    } catch (error) {
        console.error('Error fetching all products:', error);
        throw error;
    }
};

// Function to fetch a product by ID
export const getProductById = async (id:string) => {
    try {
        const response = await axios.get(`${BASE_URL}/get_product/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching product with ID ${id}:`, error);
        throw error;
    }
};

// Function to update a product by ID
export interface ProductUpdateData {
    name?: string;
    price?: number;
    image?: string;
    description?: string;
    inStock?: boolean;
    colorOptions?: string[];
}

export const updateProduct = async (id: string, updatedData: ProductUpdateData): Promise<Product> => {
    try {
        const response = await axios.put<Product>(`${BASE_URL}/update_product/${id}`, updatedData);
        return response.data;
    } catch (error) {
        console.error(`Error updating product with ID ${id}:`, error);
        throw error;
    }
};

// Function to delete a product by ID
export interface DeleteProductResponse {
    success: boolean;
    message: string;
}

export const deleteProduct = async (id: string): Promise<DeleteProductResponse> => {
    try {
        const response = await axios.delete<DeleteProductResponse>(`${BASE_URL}/delete_product/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting product with ID ${id}:`, error);
        throw error;
    }
};
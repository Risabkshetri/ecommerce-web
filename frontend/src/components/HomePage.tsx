'use client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Search } from "lucide-react"
import { useState, useEffect } from "react"
import { getAllProducts } from "../../utils/api/products"
import { useRouter } from "next/navigation"
import ProductCard from "@/components/ProductCard"
import { Product } from "@/types/products"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [featuredCategories, setFeaturedCategories] = useState<{name: string, image: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await getAllProducts();
        setAllProducts(data || []);
        
        // Get top 5 products for recommendations carousel
        const topProducts = [...data].slice(0, 5);
        setRecommendedProducts(topProducts);
        
        // Get last 3 products for featured categories
        // We're using product data for categories here, adapting the fields
        const lastThreeProducts = [...data].slice(-3);
        const categories = lastThreeProducts.map(product => ({
          name: product.name,
          image: product.image
        }));
        setFeaturedCategories(categories);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleClick = () => {
    router.push('/products');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Search Bar */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative flex-grow">
          <Input 
            placeholder="Search for products..." 
            className="pl-10 pr-4 py-2 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <Button>Search</Button>
      </div>

      {/* Hero Section */}
      <Card className="my-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white overflow-hidden">
        <CardContent className="py-16 text-center relative">
          <h1 className="text-4xl font-bold mb-4">Welcome to Electro Electronics</h1>
          <p className="mb-6 max-w-lg mx-auto">Discover premium products tailored to your preferences with our AI-powered recommendations</p>
          <Button 
            onClick={handleClick}
            variant="secondary" 
            size="lg"
            className="font-medium hover:bg-white hover:text-purple-600 transition-colors duration-300"
          >
            Explore Collection
          </Button>
        </CardContent>
      </Card>

      {/* Featured Categories Carousel */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Featured Categories</h2>
        <Button variant="link" className="text-purple-600 hover:text-purple-800 transition-colors duration-300">
          View All Categories
        </Button>
      </div>
      
      <Carousel className="mb-12">
        <CarouselContent>
          {isLoading ? (
            <div className="flex justify-center w-full p-8">
              <p>Loading categories...</p>
            </div>
          ) : featuredCategories.length > 0 ? (
            featuredCategories.map((category, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 p-2">
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
                  <div className="relative">
                    <CardContent className="p-0">
                      <div className="overflow-hidden">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-48 object-cover transition-transform duration-500 ease-out hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="justify-between items-center bg-white bg-opacity-95">
                      <h3 className="font-medium">{category.name}</h3>
                      <Button 
                        variant="ghost" 
                        className="text-purple-600 hover:bg-purple-50 transition-colors duration-300"
                      >
                        Browse
                      </Button>
                    </CardFooter>
                  </div>
                </Card>
              </CarouselItem>
            ))
          ) : (
            <div className="flex justify-center w-full p-8">
              <p>No categories found</p>
            </div>
          )}
        </CarouselContent>
        <CarouselPrevious className="left-0" />
        <CarouselNext className="right-0" />
      </Carousel>

      {/* AI-Powered Recommendations */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Recommended for You</h2>
        <Button 
          onClick={handleClick} 
          variant="link" 
          className="text-purple-600 hover:text-purple-800 transition-colors duration-300"
        >
          View All
        </Button>
      </div>
      
      <Carousel className="mb-12">
        <CarouselContent>
          {isLoading ? (
            <div className="flex justify-center w-full p-8">
              <p>Loading recommendations...</p>
            </div>
          ) : recommendedProducts.length > 0 ? (
            recommendedProducts.map((product) => (
              <CarouselItem key={product._id} className="md:basis-1/2 lg:basis-1/3 p-2">
                <ProductCard product={product} />
              </CarouselItem>
            ))
          ) : (
            <div className="flex justify-center w-full p-8">
              <p>No recommendations found</p>
            </div>
          )}
        </CarouselContent>
        <CarouselPrevious className="left-0" />
        <CarouselNext className="right-0" />
      </Carousel>

      {/* Special Offers */}
      <Alert className="mb-8 border-purple-200 bg-purple-50">
        <AlertTitle className="text-purple-700 font-medium">Limited Time Offer!</AlertTitle>
        <AlertDescription className="text-purple-600">
          Get 20% off on all electronics until April 20th! Use code: <span className="font-bold">TECH20</span>
        </AlertDescription>
      </Alert>

      {/* Newsletter Signup */}
      <Card className="mb-12 border-t-4 border-t-purple-500">
        <CardHeader>
          <CardTitle>Stay Connected</CardTitle>
          <CardDescription>Sign up for our newsletter to receive personalized recommendations and exclusive offers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-col sm:flex-row">
            <Input 
              placeholder="Enter your email" 
              className="flex-grow focus:ring-2 focus:ring-purple-300 focus:border-purple-500" 
            />
            <Button 
              className="bg-purple-600 hover:bg-purple-700 transition-colors duration-300"
            >
              Subscribe
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <Separator className="my-8" />
      <footer className="py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-4">About Us</h3>
            <p className="text-gray-500 text-sm">Electro Electronics offers the latest technology with AI-powered recommendations tailored for your needs.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-500 hover:text-purple-600 transition-colors duration-300">Shop All</a></li>
              <li><a href="#" className="text-gray-500 hover:text-purple-600 transition-colors duration-300">Your Account</a></li>
              <li><a href="#" className="text-gray-500 hover:text-purple-600 transition-colors duration-300">Shipping Policy</a></li>
              <li><a href="#" className="text-gray-500 hover:text-purple-600 transition-colors duration-300">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-purple-600 transition-colors duration-300">Facebook</a>
              <a href="#" className="text-gray-500 hover:text-purple-600 transition-colors duration-300">Twitter</a>
              <a href="#" className="text-gray-500 hover:text-purple-600 transition-colors duration-300">Instagram</a>
            </div>
          </div>
        </div>
        <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
          <p>&copy; 2023 Electro Electronics Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

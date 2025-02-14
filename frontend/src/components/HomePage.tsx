import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"


const featuredCategories = [
  { name: "Gaming Laptop", image: "/images/gaming-laptop.jpg" },
  { name: "Iphone 16", image: "/images/iphone16.jpg" },
  { name: "Samsung S25 Ultra", image: "/images/samsungultra.jpg" },
]

const recommendedProducts = [
  { name: "Smartphone X", price: 599, image: "/images/smartphonex.png" },
  { name: "Laptop Pro", price: 1299, image: "/images/laptoppro.png" },
  { name: "Wireless Earbuds", price: 129, image: "/images/earbuds.png" },
  { name: "Smart Watch", price: 199, image: "/images/smartwatch.png" },
]

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <Card className="my-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <CardContent className="py-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to AI-Powered Shopping</h1>
          <p className="mb-6">Discover products tailored just for you</p>
          <Button variant="secondary" size="lg">Shop Now</Button>
        </CardContent>
      </Card>

      {/* Featured Categories */}
      <h2 className="text-2xl font-semibold mb-4">Featured Categories</h2>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-12">
        {featuredCategories.map((category) => (
          <Card key={category.name}>
            <CardContent className="p-0">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-48 object-cover transition-transform duration-300 ease-in-out hover:scale-105 hover:opacity-90"
                loading="lazy"
              />
            </CardContent>
            <CardFooter className="justify-center">
              <Button variant="ghost">{category.name}</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* AI-Powered Recommendations */}
      <h2 className="text-2xl font-semibold mb-4">Recommended for You</h2>
      <Carousel className="mb-12">
        <CarouselContent>
          {recommendedProducts.map((product) => (
            <CarouselItem key={product.name} className="md:basis-1/2 lg:basis-1/3">
              <Card>
                <CardContent className="p-0">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-48 object-contain transition-transform duration-300 ease-in-out hover:scale-105 hover:opacity-90"
                    loading="lazy"
                  />
                </CardContent>
                <CardFooter className="flex-col items-start">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p>${product.price}</p>
                  <Button className="mt-2">Add to Cart</Button>
                </CardFooter>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      {/* Special Offers */}
      <Alert className="mb-8">
        <AlertTitle>Special Offer!</AlertTitle>
        <AlertDescription>
          Get 20% off on all electronics today! Use code: TECH20
        </AlertDescription>
      </Alert>

      {/* Newsletter Signup */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Stay Updated</CardTitle>
          <CardDescription>Sign up for our newsletter to receive personalized offers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input placeholder="Enter your email" className="flex-grow" />
            <Button>Subscribe</Button>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <Separator className="my-8" />
      <footer className="text-center text-sm text-gray-500">
        <p>&copy; 2023 AI-Powered E-commerce. All rights reserved by Electro Electronics Store</p>
      </footer>
    </div>
  )
}

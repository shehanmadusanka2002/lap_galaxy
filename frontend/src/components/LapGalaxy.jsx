import { useState, useEffect } from 'react';
import { Search, ShoppingCart, Heart, ArrowLeft, ArrowRight, Star, ChevronDown, Menu, X } from 'lucide-react';

// Mock database data (this would come from your actual database)
const mockLaptop = {
    id: 1,
    brand: 'Dell',
    model: 'XPS 15',
    price: 1999.99,
    originalPrice: 2499.99,
    rating: 4.5,
    reviews: 120,
    processor: 'Intel Core i7-10750H',
    ram: '16GB DDR4',
    storage: '512GB SSD',
    display: '15.6" FHD+ (1920 x 1200)',
    graphics: 'NVIDIA GeForce GTX 1650 Ti',
    os: 'Windows 10 Pro',
    images: [
        '/images/laptop1.jpg',
        '/images/laptop2.jpg',
        '/images/laptop3.jpg'
    ],
    availability: 'In Stock'
};

export default function LaptopProductPage() {
  const [laptop, setLaptop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Simulating fetching data from database
  useEffect(() => {
    // In a real application, you would fetch data from your API here
    fetch('http://localhost:8080/api/products').then(res => res.json()).then(data => setLaptop(data))
    
    // Using mock data for demonstration
    setTimeout(() => {
      setLaptop(mockLaptop);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl font-bold text-amber-500">LAPGALAXY</span>
              </div>
              <div className="hidden md:block ml-10">
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-600 hover:text-amber-500 px-3 py-2 rounded-md font-medium">HOME</a>
                  <a href="#" className="text-gray-600 hover:text-amber-500 px-3 py-2 rounded-md font-medium">LAPTOPS</a>
                  <a href="#" className="text-gray-600 hover:text-amber-500 px-3 py-2 rounded-md font-medium">DESKTOPS</a>
                  <a href="#" className="text-gray-600 hover:text-amber-500 px-3 py-2 rounded-md font-medium">GAMING</a>
                  <a href="#" className="text-gray-600 hover:text-amber-500 px-3 py-2 rounded-md font-medium">ACCESSORIES</a>
                  <a href="#" className="text-gray-600 hover:text-amber-500 px-3 py-2 rounded-md font-medium">OFFERS</a>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-64 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button className="absolute right-2 top-2 text-gray-600">
                  <Search size={20} />
                </button>
              </div>
              <button className="relative text-gray-600 hover:text-amber-500">
                <ShoppingCart size={24} />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">0</span>
              </button>
              
            </div>
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 hover:text-amber-500"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-amber-500">HOME</a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-amber-500">LAPTOPS</a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-amber-500">DESKTOPS</a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-amber-500">GAMING</a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-amber-500">ACCESSORIES</a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-amber-500">OFFERS</a>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="px-4 space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button className="absolute right-2 top-2 text-gray-600">
                    <Search size={20} />
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <button className="relative text-gray-600 hover:text-amber-500">
                    <ShoppingCart size={24} />
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">0</span>
                  </button>
                  <span className="text-gray-600 font-medium">+94 112 584 406</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Images */}
            <div>
              <div className="mb-4 relative">
                <img 
                  src={laptop.images[mainImage]} 
                  alt={`${laptop.brand} ${laptop.model}`} 
                  className="w-full h-64 md:h-96 object-contain rounded-lg bg-gray-100"
                />
                <button 
                  onClick={() => setMainImage(prev => (prev === 0 ? laptop.images.length - 1 : prev - 1))}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md text-gray-600 hover:text-amber-500"
                >
                  <ArrowLeft size={20} />
                </button>
                <button 
                  onClick={() => setMainImage(prev => (prev === laptop.images.length - 1 ? 0 : prev + 1))}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md text-gray-600 hover:text-amber-500"
                >
                  <ArrowRight size={20} />
                </button>
              </div>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {laptop.images.map((img, index) => (
                  <button 
                    key={index}
                    onClick={() => setMainImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-md border-2 ${mainImage === index ? 'border-amber-500' : 'border-gray-200'}`}
                  >
                    <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{laptop.brand} {laptop.model}</h1>
              <div className="mt-2 flex items-center">
                <div className="flex text-amber-500">
                  {Array(5).fill(0).map((_, i) => (
                    <Star 
                      key={i} 
                      size={18} 
                      fill={i < Math.floor(laptop.rating) ? "#F59E0B" : "none"} 
                      className={i < Math.floor(laptop.rating) ? "text-amber-500" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-500">{laptop.reviews} reviews</span>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-3xl font-bold text-gray-900">Rs {laptop.price.toLocaleString()}</span>
                {laptop.originalPrice > laptop.price && (
                  <span className="ml-3 text-lg text-gray-500 line-through">Rs {laptop.originalPrice.toLocaleString()}</span>
                )}
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-semibold flex justify-center text-orange-600">Key Specifications</h3>
                <ul className="mt-2 space-y-2 border-solid-     border-2 border-gray-200 p-4 rounded-lg">
                  <li className="flex">
                    <span className="w-32 text-gray-500">Processor:</span>
                    <span className="flex-1 font-medium">{laptop.processor}</span>
                  </li>
                  <li className="flex">
                    <span className="w-32 text-gray-500">RAM:</span>
                    <span className="flex-1 font-medium">{laptop.ram}</span>
                  </li>
                  <li className="flex">
                    <span className="w-32 text-gray-500">Storage:</span>
                    <span className="flex-1 font-medium">{laptop.storage}</span>
                  </li>
                  <li className="flex">
                    <span className="w-32 text-gray-500">Display:</span>
                    <span className="flex-1 font-medium">{laptop.display}</span>
                  </li>
                  <li className="flex">
                    <span className="w-32 text-gray-500">Graphics:</span>
                    <span className="flex-1 font-medium">{laptop.graphics}</span>
                  </li>
                  <li className="flex">
                    <span className="w-32 text-gray-500">OS:</span>
                    <span className="flex-1 font-medium">{laptop.os}</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6">
                <div className="flex items-center mb-4">
                  <span className="mr-3 text-gray-700">Availability:</span>
                  <span className={`font-medium ${laptop.availability === "In Stock" ? "text-green-600" : "text-red-600"}`}>
                    {laptop.availability}
                  </span>
                </div>
                <div className="flex items-center mb-6">
                  <span className="mr-3 text-gray-700">Quantity:</span>
                  <div className="inline-flex items-center border border-gray-300 rounded-md">
                    <button 
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      className="px-3 py-1 text-gray-600 hover:text-amber-500 border-r border-gray-300"
                    >
                      -
                    </button>
                    <span className="px-4 py-1">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(prev => prev + 1)}
                      className="px-3 py-1 text-gray-600 hover:text-amber-500 border-l border-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center">
                    <ShoppingCart size={20} className="mr-2" />
                    Add to Cart
                  </button>
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg">
                    <Heart size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Product Description and Specifications */}
          <div className="mt-12">
            <div className="border-b border-gray-200">
              <div className="flex space-x-8">
                <button className="border-b-2 border-amber-500 text-amber-500 font-medium py-2 px-1">Description</button>
                <button className="text-gray-500 hover:text-amber-500 font-medium py-2 px-1">Specifications</button>
                <button className="text-gray-500 hover:text-amber-500 font-medium py-2 px-1">Reviews</button>
              </div>
            </div>
            <div className="mt-8 prose max-w-none">
              <p className="text-gray-700">
                The {laptop.brand} {laptop.model} is a powerful gaming laptop designed for gamers and content creators alike. 
                Featuring the {laptop.processor} processor, {laptop.ram} memory, and {laptop.graphics} graphics, 
                this laptop delivers exceptional performance for both gaming and productivity tasks.
              </p>
              <p className="text-gray-700 mt-4">
                The {laptop.display} display ensures smooth gameplay and vivid visuals, while the {laptop.storage} 
                provides ample space for your games, applications, and files. The robust cooling system keeps 
                the laptop running at optimal temperatures even during intense gaming sessions.
              </p>
              <p className="text-gray-700 mt-4">
                With a premium build quality, customizable RGB keyboard, and extensive connectivity options, 
                the {laptop.brand} {laptop.model} is the perfect choice for gamers seeking performance without compromise.
              </p>
            </div>
          </div>
        </div>
      </div>

      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">LAPGALAXY</h3>
              <p className="text-gray-300">Your trusted partner for premium laptops and computer accessories.</p>
              <div className="mt-4 flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Home</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Products</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Gaming Laptops</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Business Laptops</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Graphics Cards</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Monitors</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <ul className="space-y-2 text-gray-300">
                <li>123 Main Street, Colombo 07</li>
                <li>+94 112 584 406</li>
                <li>info@lapgalaxy.lk</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} LAPGALAXY. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
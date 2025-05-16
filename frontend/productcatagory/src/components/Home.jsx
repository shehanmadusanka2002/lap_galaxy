//import { useState} from 'react';
import { Search, ShoppingCart, Heart, ArrowLeft, ArrowRight, Star, ChevronDown, Menu, X, Home } from 'lucide-react';
//import axios from 'axios';
import ProductList from './ProductList';
import NavBar from './NavBar';
import Hero from './Hero'; // Adjust path if needed 
import Footer from './Footer'; // Adjust path if needed
 // Adjust path if needed

// Mock database data (this would come from your actual database)


export default function LaptopProductPage() {
 
  return (

    <div className="bg-gray-50 min-h-screen max-w-screen transition-colors duration-300 dark:bg-gray-900">
      {/* Navigation Bar */}
      
      <NavBar />


      {/* Hero Section */}
      <main className="p-8 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300">
      
      <Hero />
      <ProductList />
      
      {/* Footer */}
      <Footer />
      </main>
    </div>
  
  );
}


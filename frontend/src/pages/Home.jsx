import ProductList from './ProductList';
import NavBar from '../components/NavBar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';

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


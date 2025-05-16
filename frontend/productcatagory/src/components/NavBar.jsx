import React, { useState, useRef, useEffect } from "react";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import DarkMode from "./DarkMode"; // Adjust path

const NavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  const navLinks = ["HOME", "LAPTOPS", "DESKTOPS", "GAMING", "ACCESSORIES", "OFFERS"];

  useEffect(() => {
    // Close search results when clicking outside
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setShowResults(true);
    
    try {
      // Using the findByBrandContainingIgnoreCase endpoint
      const response = await fetch(`http://localhost:8080/api/product/search?brand=${encodeURIComponent(searchQuery)}`);    
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        console.error("Search failed");
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error during search:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 transition-all">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-3xl font-extrabold text-amber-500 tracking-tight">LAPGALAXY</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 ml-10">
            {navLinks.map((item) => (
              <a
                key={item}
                href="#"
                className="text-gray-700 dark:text-gray-300 font-medium hover:text-amber-500 transition duration-300"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Right Side Items */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            <div className="relative" ref={searchRef}>
              <input
                type="text"
                placeholder="Search laptop brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-64 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button 
                onClick={handleSearch}
                className="absolute right-3 top-2.5 text-gray-600 dark:text-gray-300 hover:text-amber-500"
                disabled={isSearching}
              >
                <Search size={18} />
              </button>
              
              {/* Search Results Dropdown */}
              {showResults && searchResults.length > 0 && (
                <div className="absolute mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                  {searchResults.map((product) => (
                    <a 
                      key={product.id} 
                      href={`/product/${product.id}`}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    >
                      {product.imageUrl && (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name} 
                          className="w-10 h-10 object-cover mr-3"
                        />
                      )}
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-amber-500">${product.price}</div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
              
              {showResults && searchResults.length === 0 && !isSearching && (
                <div className="absolute mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10 p-3 text-center text-sm text-gray-500 dark:text-gray-400">
                  No products found
                </div>
              )}
            </div>

            {/* Dark Mode */}
            <DarkMode />

            {/* Cart */}
            <button className="relative text-gray-700 dark:text-gray-300 hover:text-amber-500 transition">
              <ShoppingCart size={22} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">0</span>
            </button>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-700 dark:text-gray-300">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 py-4 space-y-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-2">
            {navLinks.map((item) => (
              <a
                key={item}
                href="#"
                className="block text-base font-medium text-gray-700 dark:text-gray-300 hover:text-amber-500 transition"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Mobile Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search laptop brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button 
              onClick={handleSearch}
              className="absolute right-3 top-2.5 text-gray-600 dark:text-gray-300 hover:text-amber-500"
              disabled={isSearching}
            >
              <Search size={18} />
            </button>
            
            {/* Mobile Search Results */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                {searchResults.map((product) => (
                  <a 
                    key={product.id} 
                    href={`/product/${product.id}`}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  >
                    {product.imageUrl && (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="w-10 h-10 object-cover mr-3"
                      />
                    )}
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-amber-500">${product.price}</div>
                    </div>
                  </a>
                ))}
              </div>
            )}
            
            {showResults && searchResults.length === 0 && !isSearching && (
              <div className="absolute mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10 p-3 text-center text-sm text-gray-500 dark:text-gray-400">
                No products found
              </div>
            )}
          </div>

          {/* Mobile Bottom */}
          <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
            <button className="relative text-gray-700 dark:text-gray-300 hover:text-amber-500 transition">
              <ShoppingCart size={22} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">0</span>
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">+94 112 584 406</span>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
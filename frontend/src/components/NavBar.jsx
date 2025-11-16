import React, { useState, useRef, useEffect } from "react";
import { 
  Search, ShoppingCart, Menu, X, User, LogOut, ChevronDown, 
  Laptop, Monitor, Gamepad2, Headphones, Keyboard, MousePointer,
  Tag, TrendingUp, Gift, MapPin, Phone, Mail, Shield, Clock,
  Zap, Heart, Bell, Settings, Package
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import DarkMode from "./DarkMode";
import { isAuthenticated, getCurrentUser, logout, isAdmin } from "../services/api";
import { cartAPI } from "../services/cartService";

const NavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCategoriesMenu, setShowCategoriesMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const categoriesRef = useRef(null);
  const navigate = useNavigate();
  
  const isLoggedIn = isAuthenticated();
  const currentUser = getCurrentUser();
  const userIsAdmin = isAdmin();

  const categories = [
    { name: "Laptops", icon: Laptop, subcategories: ["Business Laptops", "Gaming Laptops", "Ultrabooks", "2-in-1 Laptops"] },
    { name: "Desktops", icon: Monitor, subcategories: ["Gaming PCs", "Workstations", "All-in-One", "Mini PCs"] },
    { name: "Gaming", icon: Gamepad2, subcategories: ["Gaming Laptops", "Gaming PCs", "Gaming Chairs", "VR Headsets"] },
    { name: "Accessories", icon: Headphones, subcategories: ["Keyboards", "Mice", "Headphones", "Webcams"] },
    { name: "Components", icon: Settings, subcategories: ["RAM", "SSDs", "Graphics Cards", "Processors"] },
    { name: "Peripherals", icon: Keyboard, subcategories: ["Monitors", "Speakers", "Printers", "Scanners"] },
  ];

  const quickLinks = [
    { name: "Deals", icon: Tag, path: "/deals" },
    { name: "New Arrivals", icon: Zap, path: "/new-arrivals" },
    { name: "Best Sellers", icon: TrendingUp, path: "/best-sellers" },
    { name: "Offers", icon: Gift, path: "/offers" },
  ];

  // Fetch cart count
  const fetchCartCount = async () => {
    try {
      const cartData = await cartAPI.getCart();
      if (cartData && cartData.items) {
        const totalItems = cartData.items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalItems);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
      setCartCount(0);
    }
  };

  useEffect(() => {
    // Fetch cart count on mount and when user logs in
    fetchCartCount();

    // Listen for cart updates
    const handleCartUpdate = () => {
      fetchCartCount();
    };
    window.addEventListener('cartUpdated', handleCartUpdate);

    // Set up interval to refresh cart count every 30 seconds
    const interval = setInterval(fetchCartCount, 30000);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      clearInterval(interval);
    };
  }, [isLoggedIn]);

  useEffect(() => {
    // Close dropdowns when clicking outside
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
        setShowCategoriesMenu(false);
      }
    };

    // Handle scroll for navbar shadow
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Promotional Top Bar */}
      <div className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-1">
                <MapPin size={14} />
                <span>Sri Lanka</span>
              </div>
              <div className="flex items-center space-x-1">
                <Phone size={14} />
                <span>+94 112 584 406</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail size={14} />
                <span>support@lapgalaxy.lk</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 mx-auto md:mx-0">
              <Zap size={16} className="text-yellow-300" />
              <span className="font-semibold">Free Shipping on Orders Over Rs. 50,000!</span>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              <Shield size={14} />
              <span>Secure Payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className={`w-full bg-white dark:bg-gray-900 sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-lg' : 'shadow-md'}`}>
        <nav className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Laptop className="text-white" size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  LAPGALAXY
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Your Tech Universe</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              <Link
                to="/"
                className="px-4 py-2 text-gray-700 dark:text-gray-300 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition duration-300"
              >
                Home
              </Link>
              
              {/* Categories Dropdown */}
              <div className="relative" ref={categoriesRef}>
                <button
                  onClick={() => setShowCategoriesMenu(!showCategoriesMenu)}
                  className="flex items-center space-x-1 px-4 py-2 text-gray-700 dark:text-gray-300 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition duration-300"
                >
                  <span>Categories</span>
                  <ChevronDown size={18} className={`transition-transform duration-200 ${showCategoriesMenu ? 'rotate-180' : ''}`} />
                </button>
                
                {showCategoriesMenu && (
                  <div className="absolute left-0 mt-2 w-[600px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl z-50 overflow-hidden">
                    <div className="grid grid-cols-2 gap-0">
                      {categories.map((category, index) => {
                        const IconComponent = category.icon;
                        return (
                          <div
                            key={index}
                            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer border-b border-r border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors duration-200"
                          >
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                                <IconComponent className="text-white" size={18} />
                              </div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">{category.name}</h3>
                            </div>
                            <ul className="ml-11 space-y-1">
                              {category.subcategories.map((sub, idx) => (
                                <li key={idx}>
                                  <a
                                    href="#"
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                                  >
                                    {sub}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {quickLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="flex items-center space-x-1 px-4 py-2 text-gray-700 dark:text-gray-300 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition duration-300"
                  >
                    <IconComponent size={16} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right Side Items */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Search */}
              <div className="relative" ref={searchRef}>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-80 px-4 py-2.5 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <button 
                  onClick={handleSearch}
                  className="absolute right-3 top-3 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  disabled={isSearching}
                >
                  <Search size={20} />
                </button>
                
                {/* Search Results Dropdown */}
                {showResults && searchResults.length > 0 && (
                  <div className="absolute mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl z-10 max-h-96 overflow-y-auto">
                    {searchResults.map((product) => (
                      <Link 
                        key={product.id} 
                        to={`/product/${product.id}`}
                        onClick={() => setShowResults(false)}
                        className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition"
                      >
                        {product.imageUrl && (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            className="w-12 h-12 object-cover rounded mr-3"
                          />
                        )}
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-white">{product.name}</div>
                          <div className="text-indigo-600 dark:text-indigo-400 font-semibold">Rs. {product.price?.toLocaleString()}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                
                {showResults && searchResults.length === 0 && !isSearching && (
                  <div className="absolute mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-10 p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No products found
                  </div>
                )}
              </div>

              {/* Dark Mode */}
              <DarkMode />

              {/* Wishlist */}
              <button 
                onClick={() => navigate('/wishlist')}
                className="relative text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition"
              >
                <Heart size={24} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button 
                onClick={() => navigate('/cart')}
                className="relative text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Notifications */}
              {isLoggedIn && (
                <button className="relative text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  <Bell size={24} />
                  <span className="absolute -top-1 -right-1 bg-red-500 w-2.5 h-2.5 rounded-full"></span>
                </button>
              )}

              {/* Login/Register or User Menu */}
              {!isLoggedIn ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate('/login')}
                    className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-md hover:shadow-lg"
                  >
                    Register
                  </button>
                </div>
              ) : (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                      <User size={18} className="text-white" />
                    </div>
                    <span className="text-sm font-medium">{currentUser?.username || 'User'}</span>
                    <ChevronDown size={16} className={`transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl z-10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-700">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{currentUser?.username}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{currentUser?.email}</p>
                        {userIsAdmin && (
                          <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded">
                            Admin
                          </span>
                        )}
                      </div>
                      
                      <div className="py-1">
                        {userIsAdmin ? (
                          // Admin Menu
                          <Link
                            to="/admin"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center space-x-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                          >
                            <Shield size={16} />
                            <span>Admin Dashboard</span>
                          </Link>
                        ) : (
                          // Regular User Menu
                          <>
                            <Link
                              to="/orders"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center space-x-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                            >
                              <Package size={16} />
                              <span>My Orders</span>
                            </Link>
                            <Link
                              to="/wishlist"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center space-x-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                            >
                              <Heart size={16} />
                              <span>Wishlist</span>
                            </Link>
                            <Link
                              to="/settings"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center space-x-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                            >
                              <Settings size={16} />
                              <span>Settings</span>
                            </Link>
                          </>
                        )}
                      </div>
                      
                      <div className="border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                        >
                          <LogOut size={16} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Toggle */}
            <div className="lg:hidden flex items-center space-x-3">
              <button 
                onClick={() => navigate('/cart')}
                className="relative text-gray-700 dark:text-gray-300"
              >
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                    {cartCount}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="text-gray-700 dark:text-gray-300"
              >
                {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl">
            {/* Mobile Search */}
            <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button 
                  onClick={handleSearch}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-indigo-600"
                  disabled={isSearching}
                >
                  <Search size={20} />
                </button>
                
                {/* Mobile Search Results */}
                {showResults && searchResults.length > 0 && (
                  <div className="absolute mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-10 max-h-60 overflow-y-auto">
                    {searchResults.map((product) => (
                      <Link 
                        key={product.id} 
                        to={`/product/${product.id}`}
                        onClick={() => {
                          setShowResults(false);
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                      >
                        {product.imageUrl && (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            className="w-12 h-12 object-cover rounded mr-3"
                          />
                        )}
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-indigo-600 dark:text-indigo-400 font-semibold">Rs. {product.price?.toLocaleString()}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                
                {showResults && searchResults.length === 0 && !isSearching && (
                  <div className="absolute mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-10 p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No products found
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <div className="px-4 py-3 space-y-1 border-b border-gray-200 dark:border-gray-700">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition"
              >
                Home
              </Link>
              
              {quickLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-2.5 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition"
                  >
                    <IconComponent size={18} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Categories */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Categories
              </h3>
              <div className="space-y-1">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={category.name}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="text-white" size={18} />
                      </div>
                      <span>{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Login/Register or User Menu */}
            <div className="px-4 py-4">
              {!isLoggedIn ? (
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={() => {
                      navigate('/login');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      navigate('/register');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 text-base font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-md"
                  >
                    Register
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                        <User size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{currentUser?.username}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{currentUser?.email}</p>
                      </div>
                    </div>
                    {userIsAdmin && (
                      <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded">
                        Admin
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    {userIsAdmin ? (
                      // Admin Menu
                      <Link
                        to="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition"
                      >
                        <Shield size={18} />
                        <span>Admin Dashboard</span>
                      </Link>
                    ) : (
                      // Regular User Menu
                      <>
                        <Link
                          to="/orders"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition"
                        >
                          <Package size={18} />
                          <span>My Orders</span>
                        </Link>
                        <Link
                          to="/wishlist"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition"
                        >
                          <Heart size={18} />
                          <span>Wishlist</span>
                        </Link>
                        <Link
                          to="/settings"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition"
                        >
                          <Settings size={18} />
                          <span>Settings</span>
                        </Link>
                      </>
                    )}
                  </div>
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-base font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition shadow-md"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Bottom Info */}
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <Phone size={14} />
                  <span>+94 112 584 406</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail size={14} />
                  <span>support@lapgalaxy.lk</span>
                </div>
                <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
                  <Clock size={14} />
                  <span>Mon-Sat: 9AM - 7PM</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default NavBar;
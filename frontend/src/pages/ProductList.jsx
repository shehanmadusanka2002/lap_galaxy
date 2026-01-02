import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { ArrowLeft, ArrowRight, Star, ShoppingCart, Eye, Heart, Truck, Award, TrendingUp, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cartAPI } from '../services/cartService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://16.170.168.84:32050/api';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [wishlist, setWishlist] = useState([]);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const categories = ['All', 'Laptops', 'Gaming', 'Business', 'Budget', 'Ultrabook', 'Accessories'];

  useEffect(() => {
    axios.get(`${API_BASE_URL}/product/all`)
      .then((response) => {
        setProducts(response.data);
        setFilteredProducts(response.data);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === selectedCategory));
    }
  }, [selectedCategory, products]);

  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddToCart = async (productId, productName) => {
    try {
      await cartAPI.addToCart(productId, 1);
      // Dispatch custom event to update cart count in navbar
      window.dispatchEvent(new Event('cartUpdated'));
      alert(`${productName} added to cart successfully! 🛒`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error.response?.status === 401) {
        alert('Please login to add items to cart');
      } else {
        alert('Failed to add item to cart. Please try again.');
      }
    }
  };
  

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = 300;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 dark:text-white mb-1 sm:mb-2">
            අපේ නිෂ්පාදන / Our Products
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Quality laptops at best prices • තත්ත්ව සහිත Laptops හොඳම මිලට
          </p>
        </div>
        <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400 flex items-center gap-2">
          <Package size={18} className="text-indigo-600" />
          <span className="font-semibold text-indigo-600">{filteredProducts.length}</span> 
          <span>Available</span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 shadow-md hover:shadow-lg ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white transform scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
              }`}
            >
              {category === 'All' && '🏠 '}
              {category === 'Laptops' && '💻 '}
              {category === 'Gaming' && '🎮 '}
              {category === 'Business' && '💼 '}
              {category === 'Budget' && '💰 '}
              {category === 'Ultrabook' && '⚡ '}
              {category === 'Accessories' && '🎧 '}
              {category}
              {category !== 'All' && (
                <span className="ml-2 text-xs bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full">
                  {products.filter(p => p.category === category).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Arrows - Hidden on mobile */}
      <div className="hidden md:block absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
        <button
          onClick={() => scroll('left')}
          className="bg-white dark:bg-gray-700 p-2 lg:p-3 rounded-full shadow-lg hover:bg-indigo-600 hover:text-white transition-all duration-300"
        >
          <ArrowLeft size={20} className="lg:w-6 lg:h-6" />
        </button>
      </div>

      <div className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
        <button
          onClick={() => scroll('right')}
          className="bg-white dark:bg-gray-700 p-2 lg:p-3 rounded-full shadow-lg hover:bg-indigo-600 hover:text-white transition-all duration-300"
        >
          <ArrowRight size={20} className="lg:w-6 lg:h-6" />
        </button>
      </div>

      {/* Product Cards - Responsive Grid/Scroll */}
      <div
        ref={scrollRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:gap-6 gap-4 lg:overflow-x-auto lg:scrollbar-hide px-2 sm:px-4 lg:px-6 py-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
          <div
            key={product.id}
            className="w-full sm:w-auto lg:min-w-[280px] lg:max-w-[280px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md hover:shadow-2xl lg:flex-shrink-0 transform transition-all duration-300 hover:-translate-y-2 relative group"
          >
            {/* Image Container */}
            <div className="relative overflow-hidden rounded-t-xl">
              <img
                src={product.imageUrl || product.imagePath || `data:${product.imageType};base64,${product.imageBase64}` || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="280" height="224"%3E%3Crect fill="%23ddd" width="280" height="224"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E'}
                alt={product.name}
                className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="280" height="224"%3E%3Crect fill="%23ddd" width="280" height="224"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                }}
              />
              
              {/* Condition Badge - Simple */}
              {product.condition && (
                <div className="absolute top-2 left-2">
                  <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full shadow-lg ${
                    product.condition === 'NEW' 
                      ? 'bg-green-500 text-white' 
                      : product.condition === 'REFURBISHED'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-500 text-white'
                  }`}>
                    {product.condition === 'NEW' ? '🆕 New' : 
                     product.condition === 'REFURBISHED' ? '🔧 Refurbished' : 
                     '📦 Used'}
                  </span>
                </div>
              )}

              {/* Stock Status Badge */}
              {!product.productAvailable && (
                <div className="absolute top-2 right-2">
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    Out of Stock
                  </span>
                </div>
              )}

              {/* Quick View Button */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                <button
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="opacity-0 group-hover:opacity-100 bg-white text-gray-800 px-4 py-2 rounded-lg font-medium shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-300 flex items-center gap-2"
                >
                  <Eye size={18} />
                  View Details
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4 space-y-3">
              {/* Brand */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-900 dark:text-indigo-300 px-3 py-1 rounded-full">
                  {product.brand}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {product.category}
                </span>
              </div>

              {/* Product Name */}
              <h2 
                className="text-base font-bold text-gray-800 dark:text-white line-clamp-2 min-h-[48px] hover:text-indigo-600 cursor-pointer transition-colors"
                onClick={() => navigate(`/product/${product.id}`)}
                title={product.name}
              >
                {product.name}
              </h2>

              {/* Description - Short */}
              {product.description && (
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                  {product.description}
                </p>
              )}

              {/* Warranty */}
              {product.warranty && (
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <Award size={14} className="text-blue-500" />
                  <span>{product.warranty}</span>
                </div>
              )}

              {/* Price Section - Simplified */}
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    Rs. {Number(product.price).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Stock Status */}
              <div className="flex items-center justify-between text-sm">
                {product.productAvailable && product.stockQuantity > 0 ? (
                  <div className="flex items-center gap-2">
                    <Package size={16} className="text-green-600" />
                    <span className="text-green-600 font-medium">
                      {product.stockQuantity} in stock
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Package size={16} className="text-red-600" />
                    <span className="text-red-600 font-medium">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button 
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Eye size={16} />
                  විස්තර බලන්න
                </button>
                <button 
                  onClick={() => handleAddToCart(product.id, product.name)}
                  disabled={!product.productAvailable || product.stockQuantity === 0}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white p-2.5 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Add to Cart"
                >
                  <ShoppingCart size={18} />
                </button>
              </div>
            </div>
          </div>
        ))
        ) : (
          <div className="col-span-full text-center py-16 px-4">
            <div className="max-w-md mx-auto">
              <Package size={80} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                නිෂ්පාදන නැත / No Products Found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {selectedCategory === 'All' 
                  ? 'No products available at the moment' 
                  : `No products found in ${selectedCategory} category`}
              </p>
              <button
                onClick={() => setSelectedCategory('All')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300"
              >
                View All Categories
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View All Button */}
      <div className="flex justify-center mt-6 sm:mt-8 px-4">
        <button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 sm:px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2">
          View All Products
          <ArrowRight size={20} />
        </button>
      </div>
    </section>
  );
};

export default ProductList;

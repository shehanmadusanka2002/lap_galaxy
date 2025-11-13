import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { ArrowLeft, ArrowRight, Star, ShoppingCart, Eye, Heart, Truck, Award, TrendingUp, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8080/api/product/all')
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);

  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
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
    <section className="max-w-7xl mx-auto px-4 py-12 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-2">
            Explore Our Products
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover amazing deals on premium laptops
          </p>
        </div>
        <div className="text-gray-600 dark:text-gray-400">
          <span className="font-semibold text-indigo-600">{products.length}</span> Products Available
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
        <button
          onClick={() => scroll('left')}
          className="bg-white dark:bg-gray-700 p-3 rounded-full shadow-lg hover:bg-indigo-600 hover:text-white transition-all duration-300"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
        <button
          onClick={() => scroll('right')}
          className="bg-white dark:bg-gray-700 p-3 rounded-full shadow-lg hover:bg-indigo-600 hover:text-white transition-all duration-300"
        >
          <ArrowRight size={24} />
        </button>
      </div>

      {/* Product Cards - Daraz Style */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide px-6 py-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="min-w-[280px] max-w-[280px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md hover:shadow-2xl flex-shrink-0 transform transition-all duration-300 hover:-translate-y-2 relative group"
          >
            {/* Image Container */}
            <div className="relative overflow-hidden rounded-t-xl">
              <img
                src={`data:${product.imageType};base64,${product.imageBase64}`}
                alt={product.name}
                className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              
              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {product.discountPercentage > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md">
                    -{product.discountPercentage}%
                  </span>
                )}
                {product.featured && (
                  <span className="bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded-md shadow-md flex items-center gap-1">
                    <Award size={12} />
                    Featured
                  </span>
                )}
                {product.bestSeller && (
                  <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md flex items-center gap-1">
                    <TrendingUp size={12} />
                    Best Seller
                  </span>
                )}
              </div>

              {/* Free Shipping Badge */}
              {product.freeShipping && (
                <div className="absolute top-2 right-2">
                  <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md flex items-center gap-1">
                    <Truck size={12} />
                    Free Ship
                  </span>
                </div>
              )}

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute bottom-2 right-2 p-2 rounded-full shadow-lg transition-all duration-300 ${
                  wishlist.includes(product.id)
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-red-500 hover:text-white'
                }`}
              >
                <Heart size={18} fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} />
              </button>

              {/* Quick View Button */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                <button
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="opacity-0 group-hover:opacity-100 bg-white text-gray-800 px-4 py-2 rounded-lg font-medium shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-300 flex items-center gap-2"
                >
                  <Eye size={18} />
                  Quick View
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4 space-y-2">
              {/* Brand & Category */}
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="font-medium text-indigo-600">{product.brand}</span>
                <span>•</span>
                <span>{product.category}</span>
              </div>

              {/* Product Name */}
              <h2 
                className="text-base font-bold text-gray-800 dark:text-white line-clamp-2 min-h-[48px] hover:text-indigo-600 cursor-pointer transition-colors"
                onClick={() => navigate(`/product/${product.id}`)}
                title={product.name}
              >
                {product.name}
              </h2>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {product.rating}
                  </span>
                  {product.reviewCount > 0 && (
                    <span className="text-xs text-gray-500">
                      ({product.reviewCount})
                    </span>
                  )}
                </div>
              )}

              {/* Price Section */}
              <div className="pt-2">
                {product.discountPercentage > 0 && product.originalPrice ? (
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-orange-600">
                        Rs. {product.price}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 line-through">
                        Rs. {product.originalPrice}
                      </span>
                      <span className="text-xs text-red-600 font-semibold bg-red-100 px-2 py-0.5 rounded">
                        Save Rs. {(product.originalPrice - product.price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="text-2xl font-bold text-orange-600">
                    Rs. {product.price}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 text-sm">
                {product.inStock ? (
                  <>
                    <Package size={16} className="text-green-600" />
                    <span className="text-green-600 font-medium">In Stock</span>
                    {product.stockQuantity && product.stockQuantity < 10 && (
                      <span className="text-xs text-red-600">
                        Only {product.stockQuantity} left!
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <Package size={16} className="text-red-600" />
                    <span className="text-red-600 font-medium">Out of Stock</span>
                  </>
                )}
              </div>

              {/* Condition Badge */}
              {product.condition && (
                <div>
                  <span className={`inline-block text-xs px-2 py-1 rounded ${
                    product.condition === 'NEW' 
                      ? 'bg-blue-100 text-blue-700' 
                      : product.condition === 'REFURBISHED'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {product.condition}
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-3">
                <button 
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Eye size={16} />
                  View Details
                </button>
                <button 
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white p-2.5 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                  title="Add to Cart"
                >
                  <ShoppingCart size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="flex justify-center mt-8">
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
          View All Products
          <ArrowRight size={20} />
        </button>
      </div>
    </section>
  );
};

export default ProductList;

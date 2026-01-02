import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, ShoppingCart, Zap, Package, ChevronRight, Shield
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cartAPI } from "../services/cartService";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const productId = window.location.pathname.split("/").pop();
        const response = await fetch(`${API_BASE_URL}/product/${productId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, []);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.stockQuantity) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stockQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      await cartAPI.addToCart(product.id, quantity);
      
      window.dispatchEvent(new Event('cartUpdated'));
      alert(`එකතු කරන ලදී / Added ${quantity} items to cart!`);
      
      if (window.confirm('කරත්තයට යන්නද? / Go to cart?')) {
        navigate('/cart');
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert(err.response?.data?.error || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    try {
      setAddingToCart(true);
      await cartAPI.addToCart(product.id, quantity);
      window.dispatchEvent(new Event('cartUpdated'));
      navigate('/cart');
    } catch (err) {
      console.error('Error:', err);
      alert(err.response?.data?.error || 'Failed to proceed');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleGoBack = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">පැටවීම / Loading...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <NavBar />
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
          <div className="text-center max-w-md">
            <Package size={64} className="text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              නිෂ්පාදනය හමු නොවීය / Product Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error || "The product you're looking for doesn't exist."}
            </p>
            <button
              onClick={handleGoBack}
              className="px-6 py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md transition duration-300 font-medium"
            >
              <ArrowLeft className="inline mr-2" size={18} />
              ආපසු යන්න / Go Back
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Breadcrumb */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <button onClick={() => navigate('/')} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                මුල් පිටුව / Home
              </button>
              <ChevronRight size={16} className="mx-2" />
              <span className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">{product.category}</span>
              <ChevronRight size={16} className="mx-2" />
              <span className="text-gray-900 dark:text-white font-medium truncate max-w-xs">{product.name}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Image */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="relative bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden aspect-square flex items-center justify-center mb-4">
                <img
                  src={product.imageUrl || product.imagePath || `data:${product.imageType};base64,${product.imageBase64}`}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain p-4"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23ddd" width="400" height="400"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="30" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                  }}
                />
                
                {/* Condition Badge */}
                {product.condition && (
                  <div className="absolute top-4 left-4">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                      product.condition === 'NEW' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-orange-500 text-white'
                    }`}>
                      {product.condition === 'NEW' ? '🆕 අලුත් / New' : '♻️ භාවිතා කළ / Used'}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons - Desktop */}
              <div className="hidden lg:block space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart || !product.productAvailable || product.stockQuantity === 0}
                  className="w-full flex items-center justify-center bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  <ShoppingCart className="mr-2" size={20} />
                  {addingToCart ? 'එකතු කරමින් / Adding...' : 'කරත්තයට එක් කරන්න / Add to Cart'}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={addingToCart || !product.productAvailable || product.stockQuantity === 0}
                  className="w-full flex items-center justify-center bg-orange-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  <Zap className="mr-2" size={20} />
                  දැන් මිලදී ගන්න / Buy Now
                </button>
              </div>
            </div>

            {/* Right Column - Product Info */}
            <div className="space-y-6">
              {/* Product Title & Basic Info */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {product.name}
                </h1>

                <div className="flex flex-wrap gap-4 text-sm mb-4">
                  <div className="flex items-center">
                    <span className="text-gray-600 dark:text-gray-400">වෙළඳ නාමය / Brand:</span>
                    <span className="ml-2 font-semibold text-indigo-600 dark:text-indigo-400">{product.brand}</span>
                  </div>
                  <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                  <div className="flex items-center">
                    <span className="text-gray-600 dark:text-gray-400">වර්ගය / Category:</span>
                    <span className="ml-2 font-semibold text-gray-900 dark:text-white">{product.category}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">මිල / Price:</p>
                  <p className="text-4xl font-bold text-orange-600 dark:text-orange-400">
                    රු. {product.price?.toLocaleString()}
                  </p>
                </div>

                {/* Stock Status */}
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <Package size={18} className="mr-2 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">ස්ටොක් ප්‍රමාණය / Stock:</span>
                  </div>
                  <span className={`font-bold text-sm ${
                    product.stockQuantity > 50 ? 'text-green-600' : 
                    product.stockQuantity > 10 ? 'text-orange-600' : 'text-red-600'
                  }`}>
                    {product.stockQuantity > 0 ? `${product.stockQuantity} ඇත / Available` : 'අවසන් / Out of Stock'}
                  </span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">ප්‍රමාණය / Quantity</h3>
                <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden w-fit">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="px-5 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stockQuantity}
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-20 px-4 py-3 text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-x-2 border-gray-300 dark:border-gray-600 focus:outline-none text-lg font-semibold"
                  />
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stockQuantity}
                    className="px-5 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Warranty */}
              {product.warranty && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                  <div className="flex items-start">
                    <Shield size={24} className="text-purple-600 dark:text-purple-400 mr-3 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        වගකීම / Warranty
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">{product.warranty}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              {product.description && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    විස්තරය / Description
                  </h3>
                  <div className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {product.description.split('\n').map((line, index) => (
                      <p key={index} className="mb-2">{line}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Specifications */}
              {product.specifications && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    විශේෂාංග / Specifications
                  </h3>
                  <div className="space-y-2">
                    {product.specifications.split('\n').map((spec, index) => {
                      const trimmedSpec = spec.trim();
                      if (!trimmedSpec) return null;
                      
                      const hasBullet = trimmedSpec.startsWith('•') || trimmedSpec.startsWith('-') || trimmedSpec.startsWith('*');
                      
                      return (
                        <div key={index} className="flex items-start text-gray-700 dark:text-gray-300">
                          <span className="text-indigo-600 dark:text-indigo-400 mr-3 font-bold text-lg">
                            {hasBullet ? '' : '•'}
                          </span>
                          <span className="leading-relaxed">
                            {hasBullet ? trimmedSpec.substring(1).trim() : trimmedSpec}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Fixed Bottom Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 shadow-2xl z-40">
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || !product.productAvailable || product.stockQuantity === 0}
              className="flex-1 flex items-center justify-center bg-indigo-600 text-white py-3 px-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-sm"
            >
              <ShoppingCart className="mr-1" size={18} />
              කරත්තයට / Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={addingToCart || !product.productAvailable || product.stockQuantity === 0}
              className="flex-1 flex items-center justify-center bg-orange-500 text-white py-3 px-3 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-sm"
            >
              <Zap className="mr-1" size={18} />
              මිලදී ගන්න / Buy
            </button>
          </div>
        </div>
        
        {/* Spacer for mobile fixed bar */}
        <div className="lg:hidden h-20"></div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetails;

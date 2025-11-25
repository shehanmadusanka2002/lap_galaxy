import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, ShoppingCart, Star, Heart, Share2, Truck, 
  Shield, RefreshCw, Package, Check, Zap, Tag, Clock,
  Award, TrendingUp, MessageCircle, MapPin, Store, ChevronRight,
  CreditCard, BadgeCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cartAPI } from "../services/cartService";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const productId = window.location.pathname.split("/").pop();
        const response = await fetch(`http://localhost:8080/api/product/${productId}`);
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

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // TODO: Implement wishlist API
  };

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      await cartAPI.addToCart(product.id, quantity);
      
      // Dispatch cart update event
      window.dispatchEvent(new Event('cartUpdated'));
      
      // Show success message
      alert(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart!`);
      
      // Ask if user wants to view cart
      if (window.confirm('Go to cart?')) {
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard!');
    }
  };

  const handleGoBack = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Loading product details...</p>
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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <div className="text-center bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg max-w-md">
            <Package size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error || "Sorry, we couldn't find the product you're looking for."}
            </p>
            <button
              onClick={handleGoBack}
              className="px-6 py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md transition duration-300 font-medium"
            >
              Go Back
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
                Home
              </button>
              <ChevronRight size={16} className="mx-2" />
              <span className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">{product.category}</span>
              <ChevronRight size={16} className="mx-2" />
              <span className="text-gray-900 dark:text-white font-medium truncate max-w-xs">{product.name}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Image Gallery */}
            <div className="lg:col-span-5">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm sticky top-20">
                {/* Main Image */}
                <div className="relative mb-4 bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden aspect-square flex items-center justify-center">
                  <img
                    src={product.imageUrl || product.imagePath || `data:${product.imageType};base64,${product.imageBase64}`}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain p-4"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23ddd" width="400" height="400"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="30" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 space-y-2">
                    {product.featured && (
                      <span className="block bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                        ⭐ Featured
                      </span>
                    )}
                    {product.bestSeller && (
                      <span className="block bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                        🔥 Best Seller
                      </span>
                    )}
                    {product.discountPercentage && product.discountPercentage > 0 && (
                      <span className="block bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                        -{product.discountPercentage}% OFF
                      </span>
                    )}
                  </div>

                  {/* Wishlist & Share */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button
                      onClick={toggleWishlist}
                      className={`p-2.5 rounded-full shadow-lg transition-all ${
                        isWishlisted 
                          ? 'bg-red-500 text-white' 
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20'
                      }`}
                    >
                      <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-2.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
                    >
                      <Share2 size={20} />
                    </button>
                  </div>
                </div>

                {/* Action Buttons - Desktop */}
                <div className="hidden lg:block space-y-3">
                  <div className="flex gap-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={addingToCart || !product.productAvailable || product.stockQuantity === 0}
                      className="flex-1 flex items-center justify-center bg-indigo-100 text-indigo-700 py-3 px-4 rounded-lg font-semibold hover:bg-indigo-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="mr-2" size={20} />
                      {addingToCart ? 'Adding...' : 'Add to Cart'}
                    </button>
                    <button
                      onClick={handleBuyNow}
                      disabled={addingToCart || !product.productAvailable || product.stockQuantity === 0}
                      className="flex-1 flex items-center justify-center bg-orange-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                    >
                      <Zap className="mr-2" size={20} />
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Product Info */}
            <div className="lg:col-span-7 space-y-6">
              {/* Product Title & Rating */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white pr-4">
                    {product.name}
                  </h1>
                </div>

                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <div className="flex text-yellow-400 mr-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          fill={i < Math.floor(product.rating || 4) ? "currentColor" : "none"}
                          className={i < Math.floor(product.rating || 4) ? "text-yellow-400" : "text-gray-300"}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{product.rating || 4.0}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                      ({product.reviewCount || 0} reviews)
                    </span>
                  </div>
                  
                  <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                  
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <TrendingUp size={16} className="mr-1 text-green-500" />
                    <span className="font-medium text-gray-900 dark:text-white">1.2K</span>
                    <span className="ml-1">sold</span>
                  </div>
                </div>

                {/* Brand & SKU */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center">
                    <span className="text-gray-600 dark:text-gray-400">Brand:</span>
                    <span className="ml-2 font-medium text-indigo-600 dark:text-indigo-400">{product.brand}</span>
                  </div>
                  {product.sku && (
                    <>
                      <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                      <div className="flex items-center">
                        <span className="text-gray-600 dark:text-gray-400">SKU:</span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-white">{product.sku}</span>
                      </div>
                    </>
                  )}
                  {product.condition && (
                    <>
                      <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        product.condition === 'NEW' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                      }`}>
                        {product.condition}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Price Section */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl p-6 shadow-sm border-2 border-orange-200 dark:border-orange-800">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold text-orange-600 dark:text-orange-400">
                    Rs. {product.price?.toLocaleString()}
                  </span>
                  {product.originalPrice && product.discountPercentage > 0 && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        Rs. {product.originalPrice?.toLocaleString()}
                      </span>
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        -{product.discountPercentage}%
                      </span>
                    </>
                  )}
                </div>
                {product.originalPrice && product.discountPercentage > 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You save: Rs. {(product.originalPrice - product.price)?.toLocaleString()}
                  </p>
                )}
                
                {/* Shipping Cost Calculation */}
                <div className="mt-4 pt-4 border-t border-orange-200 dark:border-orange-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Truck size={18} className="text-gray-600 dark:text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Shipping Cost:
                      </span>
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {product.freeShipping ? (
                        <span className="text-green-600 dark:text-green-400">FREE</span>
                      ) : (
                        `Rs. ${(product.shippingCost || 250)?.toLocaleString()}`
                      )}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-t border-orange-200 dark:border-orange-800">
                    <span className="text-base font-semibold text-gray-900 dark:text-white">
                      Total (Qty: {quantity}):
                    </span>
                    <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      Rs. {(
                        (product.price * quantity) + 
                        (product.freeShipping ? 0 : (product.shippingCost || 250))
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery & Services */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Delivery & Services</h3>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <MapPin size={20} className="text-indigo-600 dark:text-indigo-400 mr-3" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Deliver to</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Colombo - Select your location</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-start p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Truck size={20} className="text-green-600 dark:text-green-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {product.freeShipping ? 'Free Delivery' : 'Standard Delivery'}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {product.freeShipping ? 'On all orders' : `Rs. ${product.shippingCost || 250}`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <RefreshCw size={20} className="text-blue-600 dark:text-blue-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">7 Days Returns</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Change of mind</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Shield size={20} className="text-purple-600 dark:text-purple-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Warranty</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {product.warranty || '1 Year Brand Warranty'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <BadgeCheck size={20} className="text-indigo-600 dark:text-indigo-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Authentic</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">100% Original</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quantity & Stock */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Quantity</h3>
                  <div className="flex items-center text-sm">
                    <Package size={16} className="mr-1 text-gray-500" />
                    <span className={`font-medium ${
                      product.stockQuantity > 50 ? 'text-green-600' : 
                      product.stockQuantity > 10 ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {product.stockQuantity > 0 ? `${product.stockQuantity} items available` : 'Out of Stock'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                    <button
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.stockQuantity}
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="w-20 px-3 py-2 text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-x-2 border-gray-300 dark:border-gray-600 focus:outline-none"
                    />
                    <button
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stockQuantity}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      +
                    </button>
                  </div>
                  
                  {product.minOrderQuantity && (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Min order: {product.minOrderQuantity}
                    </span>
                  )}
                </div>
              </div>

              {/* Product Specifications */}
              {product.specifications && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Specifications</h3>
                  <div className="space-y-2">
                    {product.specifications.split('\n').map((spec, index) => {
                      const trimmedSpec = spec.trim();
                      if (!trimmedSpec) return null;
                      
                      // Check if the line already has a bullet point
                      const hasBullet = trimmedSpec.startsWith('•') || trimmedSpec.startsWith('-') || trimmedSpec.startsWith('*');
                      
                      return (
                        <div key={index} className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                          <span className="text-indigo-600 dark:text-indigo-400 mr-2 font-bold">
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

              {/* Description */}
              {product.description && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Product Description</h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {product.description.split('\n').map((line, index) => (
                      <p key={index} className="mb-2">{line}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Details */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Additional Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {product.color && (
                    <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Color:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{product.color}</span>
                    </div>
                  )}
                  {product.weight && (
                    <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Weight:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{product.weight} kg</span>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Dimensions:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{product.dimensions}</span>
                    </div>
                  )}
                  {product.manufacturer && (
                    <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Manufacturer:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{product.manufacturer}</span>
                    </div>
                  )}
                  {product.origin && (
                    <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Origin:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{product.origin}</span>
                    </div>
                  )}
                  {product.releaseDate && (
                    <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Release Date:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {new Date(product.releaseDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Fixed Bottom Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 shadow-2xl z-40">
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || !product.productAvailable || product.stockQuantity === 0}
              className="flex-1 flex items-center justify-center bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              <ShoppingCart className="mr-2" size={20} />
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={addingToCart || !product.productAvailable || product.stockQuantity === 0}
              className="flex-1 flex items-center justify-center bg-orange-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              <Zap className="mr-2" size={20} />
              Buy Now
            </button>
          </div>
        </div>
        
        {/* Spacer for mobile fixed bar */}
        <div className="lg:hidden h-24"></div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetails;

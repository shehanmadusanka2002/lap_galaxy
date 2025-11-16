import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShoppingCart, Trash2, Plus, Minus, ArrowLeft, 
  ShoppingBag, Truck, CreditCard, AlertCircle 
} from "lucide-react";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { cartAPI } from "../services/cartService";

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingItems, setUpdatingItems] = useState({});
  const [selectedItems, setSelectedItems] = useState(new Set());

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    // Auto-select all items when cart loads
    if (cart && cart.items) {
      setSelectedItems(new Set(cart.items.map(item => item.id)));
    }
  }, [cart]);

  const loadCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const cartData = await cartAPI.getCart();
      setCart(cartData);
    } catch (err) {
      console.error('Error loading cart:', err);
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      setUpdatingItems(prev => ({ ...prev, [itemId]: true }));
      const updatedCart = await cartAPI.updateCartItem(cart.id, itemId, newQuantity);
      setCart(updatedCart);
    } catch (err) {
      console.error('Error updating quantity:', err);
      alert(err.response?.data?.error || 'Failed to update quantity');
    } finally {
      setUpdatingItems(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const removeItem = async (itemId) => {
    if (!window.confirm('Remove this item from cart?')) return;
    
    try {
      const updatedCart = await cartAPI.removeFromCart(cart.id, itemId);
      setCart(updatedCart);
    } catch (err) {
      console.error('Error removing item:', err);
      alert('Failed to remove item from cart');
    }
  };

  const clearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your cart?')) return;
    
    try {
      await cartAPI.clearCart(cart.id);
      setSelectedItems(new Set());
      loadCart();
    } catch (err) {
      console.error('Error clearing cart:', err);
      alert('Failed to clear cart');
    }
  };

  // Handle individual item selection
  const toggleItemSelection = (itemId) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Handle select all
  const toggleSelectAll = () => {
    if (selectedItems.size === cart.items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cart.items.map(item => item.id)));
    }
  };

  // Calculate totals for selected items only
  const calculateSelectedTotals = () => {
    if (!cart || !cart.items) return { subtotal: 0, itemCount: 0, shipping: 0, total: 0 };
    
    const selectedCartItems = cart.items.filter(item => selectedItems.has(item.id));
    const subtotal = selectedCartItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);
    const itemCount = selectedCartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    // Calculate shipping based on each product's shipping cost
    let shipping = 0;
    
    selectedCartItems.forEach(item => {
      // Check if product has free shipping
      const isFreeShipping = item.freeShipping === true;
      
      if (!isFreeShipping) {
        // Use product's shipping cost (convert to number) or default to 250
        const itemShippingCost = Number(item.shippingCost) || 250;
        shipping += itemShippingCost;
      }
    });
    
    // Optional: Apply free shipping if subtotal >= 500000 (Rs. 500,000)
    // You can remove this section if you don't want a free shipping threshold
    const FREE_SHIPPING_THRESHOLD = 500000;
    if (subtotal >= FREE_SHIPPING_THRESHOLD) {
      shipping = 0;
    }
    
    const total = subtotal + shipping;
    
    return { subtotal, itemCount, shipping, total };
  };

  const selectedTotals = calculateSelectedTotals();

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading cart...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <AlertCircle className="mx-auto h-16 w-16 text-red-500" />
            <p className="mt-4 text-xl text-red-600 font-semibold">{error}</p>
            <button
              onClick={loadCart}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const isEmpty = !cart || !cart.items || cart.items.length === 0;

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-6 lg:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
              <button
                onClick={() => navigate('/')}
                className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <ArrowLeft className="mr-1 sm:mr-2" size={16} />
                <span className="hidden sm:inline">Continue Shopping</span>
                <span className="sm:hidden">Back</span>
              </button>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <ShoppingCart className="mr-2 sm:mr-3" size={24} />
              Shopping Cart
            </h1>
          </div>

          {isEmpty ? (
            /* Empty Cart */
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
              <ShoppingBag className="mx-auto h-24 w-24 text-gray-400" />
              <h2 className="mt-6 text-2xl font-semibold text-gray-900 dark:text-white">
                Your cart is empty
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Add some products to get started!
              </p>
              <button
                onClick={() => navigate('/')}
                className="mt-6 px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            /* Cart with Items */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md">
                  <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={cart.items.length > 0 && selectedItems.size === cart.items.length}
                          onChange={toggleSelectAll}
                          className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                          SELECT ALL ({cart.totalItems} ITEM{cart.totalItems !== 1 ? 'S' : ''})
                        </h2>
                      </div>
                      <button
                        onClick={clearCart}
                        className="text-xs sm:text-sm text-red-600 hover:text-red-700 flex items-center"
                      >
                        <Trash2 size={14} className="sm:w-4 sm:h-4 mr-1" />
                        DELETE
                      </button>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {cart.items.map((item) => (
                      <div key={item.id} className="p-3 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                        <div className="flex items-start gap-3 sm:gap-4">
                          {/* Checkbox */}
                          <input
                            type="checkbox"
                            checked={selectedItems.has(item.id)}
                            onChange={() => toggleItemSelection(item.id)}
                            className="mt-1 w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          
                          {/* Product Image */}
                          <img
                            src={item.productImageUrl || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="14" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E'}
                            alt={item.productName}
                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg flex-shrink-0"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="14" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                            }}
                          />

                          <div className="flex-1 w-full">
                            <div className="flex justify-between items-start gap-2 mb-2">
                              {/* Product Info */}
                              <div className="flex-1 min-w-0">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                                  {item.productName}
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                  {item.productBrand}
                                </p>
                                <p className="mt-1 text-base sm:text-lg font-bold text-indigo-600">
                                  Rs. {item.unitPrice?.toLocaleString()}
                                </p>
                                {!item.inStock && (
                                  <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center">
                                    <AlertCircle size={12} className="sm:w-3.5 sm:h-3.5 mr-1" />
                                    Out of Stock
                                  </p>
                                )}
                              </div>

                              {/* Remove Button - Mobile */}
                              <button
                                onClick={() => removeItem(item.id)}
                                className="sm:hidden p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>

                            <div className="flex items-center justify-between gap-4 mt-3">
                              {/* Quantity Controls */}
                              <div className="flex items-center space-x-1 sm:space-x-2">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1 || updatingItems[item.id]}
                                  className="p-1.5 sm:p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="w-8 sm:w-12 text-center text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  disabled={item.quantity >= item.stockQuantity || updatingItems[item.id]}
                                  className="p-1.5 sm:p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>

                              {/* Subtotal */}
                              <div className="text-right">
                                <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                                  Rs. {item.subtotal?.toLocaleString()}
                                </p>
                              </div>

                              {/* Remove Button - Desktop */}
                              <button
                                onClick={() => removeItem(item.id)}
                                className="hidden sm:block p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md lg:sticky lg:top-8">
                  <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                      Order Summary
                    </h2>
                  </div>

                  <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                    <div className="flex justify-between text-sm sm:text-base text-gray-600 dark:text-gray-400">
                      <span>Subtotal ({selectedTotals.itemCount} items)</span>
                      <span className="font-semibold">Rs. {selectedTotals.subtotal.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between text-sm sm:text-base text-gray-600 dark:text-gray-400">
                      <span className="flex items-center">
                        <Truck size={14} className="sm:w-4 sm:h-4 mr-2" />
                        Shipping Fee
                      </span>
                      <span className="font-semibold">
                        {selectedTotals.shipping === 0 ? (
                          <span className="text-green-600">FREE</span>
                        ) : (
                          `Rs. ${selectedTotals.shipping.toLocaleString()}`
                        )}
                      </span>
                    </div>

                    {selectedTotals.subtotal > 0 && selectedTotals.subtotal < 500000 && (
                      <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-2 sm:p-3 rounded-lg">
                        Add Rs. {(500000 - selectedTotals.subtotal).toLocaleString()} more for FREE shipping!
                      </div>
                    )}

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3 sm:pt-4">
                      <div className="flex justify-between text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                        <span>Total</span>
                        <span className="text-orange-600 dark:text-orange-400">
                          Rs. {selectedTotals.total.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => selectedTotals.itemCount > 0 ? alert('Checkout functionality coming soon!') : alert('Please select at least one item')}
                      disabled={selectedTotals.itemCount === 0}
                      className="w-full py-3 sm:py-4 text-sm sm:text-base bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CreditCard size={18} />
                      <span>PROCEED TO CHECKOUT({selectedTotals.itemCount})</span>
                    </button>

                    <button
                      onClick={() => navigate('/')}
                      className="w-full py-2 sm:py-3 text-sm sm:text-base bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;

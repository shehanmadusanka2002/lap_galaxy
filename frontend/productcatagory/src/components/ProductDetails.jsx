import React, { useState, useEffect } from "react";
import { ArrowLeft, ShoppingCart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
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
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    navigate("/cart", {
      state: {
        product,
        quantity,
        totalPrice: product.price * quantity
      }
    });
  };

  const handleGoBack = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {error || "Sorry, we couldn't find the product you're looking for."}
        </p>
        <button
          onClick={handleGoBack}
          className="px-4 py-2 text-white bg-amber-500 hover:bg-amber-600 rounded-lg shadow-md transition duration-300"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-6xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-10 transition-all duration-300">
        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={handleGoBack}
            className="flex items-center text-sm text-white bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-lg shadow-md"
          >
            <ArrowLeft className="mr-2" size={18} />
            Go Back
          </button>
        </div>

        {/* Product Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Image */}
          <div className="flex items-center justify-center">
            <div className="w-full h-full overflow-hidden rounded-xl shadow-md group transition-transform">
              <img
                src={`data:${product.imageType};base64,${product.imageBase64}`}
                alt={product.name}
                className="w-full h-[300px] md:h-[400px] object-contain rounded-xl transform transition-transform duration-500 group-hover:rotate-6"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h1>
              <div className="flex items-center mb-4">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      fill={i < (product.rating || 4) ? "currentColor" : "none"}
                      className={i < (product.rating || 4) ? "text-amber-500" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  ({product.reviewCount || 0} reviews)
                </span>
              </div>

              <div className="text-2xl font-bold text-amber-500 mb-4">RS: {product.price}</div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
                <ul className="list-disc pl-6 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm text-gray-700 dark:text-gray-300 space-y-2">
                  {product.description
                    ?.split('\n')
                    .map((point, index) => (
                      <li key={index} className="leading-relaxed">
                        {point.trim()}
                      </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex items-center space-x-4 mt-4">
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-md font-medium transition"
              >
                <ShoppingCart size={18} className="mr-2" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

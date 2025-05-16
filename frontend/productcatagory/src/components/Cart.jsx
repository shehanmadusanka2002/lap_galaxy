// src/pages/Cart.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Cart = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { product, quantity, totalPrice } = state || {};

  if (!product) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl text-red-600 font-bold">No product data found!</h2>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-5xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        {/* Go Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center mb-6 text-sm text-white bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-lg shadow-md"
        >
          <ArrowLeft className="mr-2" size={18} />
          Back to Product
        </button>

        {/* Product Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse rounded-lg overflow-hidden">
            <thead className="bg-green-300 text-white">
              <tr>
                <th className="p-4 text-left">Image</th>
                <th className="p-4 text-left">Product Name</th>
                <th className="p-4 text-center">Unit Price</th>
                <th className="p-4 text-center">Quantity</th>
                <th className="p-4 text-center">Total Price</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">
              <tr className="border-b dark:border-gray-600">
                <td className="p-4">
                  <img
                    src={`data:${product.imageType};base64,${product.imageBase64}`}
                    alt={product.name}
                    className="w-20 h-20 object-contain rounded border border-gray-300 dark:border-gray-600"
                  />
                </td>
                <td className="p-4">{product.name}</td>
                <td className="p-4 text-center">RS {product.price}</td>
                <td className="p-4 text-center">{quantity}</td>
                <td className="p-4 text-center font-bold text-green-600">RS {totalPrice}</td>
              </tr>
            </tbody>
          </table>

            <div className="w-2/5 mt-6">
  <button
    className="flex items-end justify-end bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium transition"
  >
    Proceed to checkout
  </button>
</div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

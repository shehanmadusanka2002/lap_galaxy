import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const scrollRef = useRef(null); // reference to scrollable div
  const navigate = useNavigate();


  useEffect(() => {
    axios.get('http://localhost:8080/api/product/products')
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);
  

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
      <h1 className="text-4xl font-extrabold text-center mb-12 text-gray-800 dark:text-white">
        Explore Our Products
      </h1>

      {/* Arrows */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
        <button
          onClick={() => scroll('left')}
          className="bg-white dark:bg-gray-700 p-2 rounded-full shadow-md hover:text-amber-500"
        >
          <ArrowLeft />
        </button>
      </div>

      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
        <button
          onClick={() => scroll('right')}
          className="bg-white dark:bg-gray-700 p-2 rounded-full shadow-md hover:text-amber-500"
        >
          <ArrowRight />
        </button>
      </div>

      {/* Scrollable Product List */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide px-6 py-2"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="min-w-[250px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md flex-shrink-0 transform transition duration-300 hover:scale-105"
          >
            <img
              src={`data:${product.imageType};base64,${product.imageBase64}`}
              alt={product.name}
              className="w-full h-52 object-cover rounded-t-2xl"
            />
            <div className="p-4 space-y-2">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white truncate">{product.name}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{product.brand}</p>
              <div className="flex justify-between items-center pt-2">
                <span className={`text-sm font-medium ${product.productAvailable === "In Stock" ? "text-green-600" : "text-red-500"}`}>
                  {product.productAvailable}
                </span>
                <span className="text-xl font-bold text-amber-500">Rs. {product.price}</span>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => navigate(`/product/${product.id}`)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-xl text-sm">View</button>
                <button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2 px-3 rounded-xl text-sm">Cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductList;

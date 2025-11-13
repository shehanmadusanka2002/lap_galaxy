import React, { useState } from 'react';
import axios from 'axios';

const SearchByCategory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/products?category=${searchTerm}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Enter category"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border border-gray-400 p-2 rounded mr-2"
      />
      <button onClick={handleSearch} className="bg-blue-500 text-white p-2 rounded">Search</button>

      <ul className="mt-4">
        {products.map((product) => (
          <li key={product.id} className="border-b py-2">{product.name} - {product.category}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchByCategory;

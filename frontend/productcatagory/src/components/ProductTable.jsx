import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios.get('http://localhost:8080/api/product/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  };

  const handleDelete = (Id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      axios.delete(`http://localhost:8080/api/product/${Id}`)
        .then(() => {
          alert('Product deleted successfully!');
          fetchProducts();
        })
        .catch(error => {
          console.error('Error deleting product:', error);
          alert('Failed to delete the product.');
        });
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setUpdatedProduct({
      name: product.name,
      brand: product.brand,
      category: product.category,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity,
      productAvailable: product.productAvailable,
      releaseDate: product.releaseDate
    });
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct(prev => ({
      ...prev,
      [name]: name === "productAvailable" ? value === "true" : value
    }));
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:8080/api/product/${editingProduct.id}`, updatedProduct)
      .then(() => {
        alert('Product updated successfully!');
        setEditingProduct(null);
        fetchProducts();
      })
      .catch(error => {
        console.error('Error updating product:', error);
        alert('Failed to update product.');
      });
  };

  return (
    <div className="p-4 overflow-x-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Product Category</h1>
      <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3 border-b">Image</th>
            <th className="p-3 border-b">Name</th>
            <th className="p-3 border-b">Brand</th>
            <th className="p-3 border-b">Category</th>
            <th className="p-3 border-b">Description</th>
            <th className="p-3 border-b">Price</th>
            <th className="p-3 border-b">Stock</th>
            <th className="p-3 border-b">Availability</th>
            <th className="p-3 border-b">Release Date</th>
            <th className="p-3 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="p-3 border-b">
                {product.imageBase64 ? (
                  <img
                    src={`data:${product.imageType};base64,${product.imageBase64}`}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                ) : (
                  <span className="text-gray-400 italic">No Image</span>
                )}
              </td>
              <td className="p-3 border-b">{product.name}</td>
              <td className="p-3 border-b">{product.brand}</td>
              <td className="p-3 border-b">{product.category}</td>
              <td className="p-3 border-b">{product.description}</td>
              <td className="p-3 border-b text-green-600 font-semibold">Rs. {product.price}</td>
              <td className="p-3 border-b">{product.stockQuantity}</td>
              <td className="p-3 border-b">
                <span className={`px-2 py-1 rounded-full text-white text-xs ${product.productAvailable ? 'bg-green-500' : 'bg-red-500'}`}>
                  {product.productAvailable ? 'Available' : 'Out of Stock'}
                </span>
              </td>
              <td className="p-3 border-b text-gray-500">
                {product.releaseDate ? new Date(product.releaseDate).toLocaleDateString() : 'N/A'}
              </td>
              <td className="p-3 border-b space-x-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={updatedProduct.name}
                onChange={handleUpdateChange}
                className="w-full p-2 border rounded"
                placeholder="Product Name"
              />
              <input
                type="text"
                name="brand"
                value={updatedProduct.brand}
                onChange={handleUpdateChange}
                className="w-full p-2 border rounded"
                placeholder="Brand"
              />
              <input
                type="text"
                name="category"
                value={updatedProduct.category}
                onChange={handleUpdateChange}
                className="w-full p-2 border rounded"
                placeholder="Category"
              />
              <textarea
                name="description"
                value={updatedProduct.description}
                onChange={handleUpdateChange}
                className="w-full p-2 border rounded"
                placeholder="Description"
              />
              <input
                type="number"
                name="price"
                value={updatedProduct.price}
                onChange={handleUpdateChange}
                className="w-full p-2 border rounded"
                placeholder="Price"
              />
              <input
                type="number"
                name="stockQuantity"
                value={updatedProduct.stockQuantity}
                onChange={handleUpdateChange}
                className="w-full p-2 border rounded"
                placeholder="Stock Quantity"
              />
              <select
                name="productAvailable"
                value={updatedProduct.productAvailable}
                onChange={handleUpdateChange}
                className="w-full p-2 border rounded"
              >
                <option value="true">Available</option>
                <option value="false">Out of Stock</option>
              </select>
              <input
                type="date"
                name="releaseDate"
                value={updatedProduct.releaseDate?.slice(0, 10)}
                onChange={handleUpdateChange}
                className="w-full p-2 border rounded"
              />
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;

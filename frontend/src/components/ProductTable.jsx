import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, Star, Truck, Tag, TrendingUp, AlertCircle, Edit, Trash2, Eye, Grid, List, Shield, Lock } from 'lucide-react';
import { isAdmin } from '../services/api';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState({});
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const [selectedProduct, setSelectedProduct] = useState(null); // For viewing details
  const adminUser = isAdmin(); // Check if user is admin

  useEffect(() => {
    if (adminUser) {
      fetchProducts();
    }
  }, [adminUser]);

  const fetchProducts = () => {
    axios.get('http://localhost:8080/api/product/all')
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
    <div className="p-4">
      {/* Admin Access Check */}
      {!adminUser ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-8">
          <div className="bg-white rounded-full p-6 shadow-lg mb-6">
            <Lock size={64} className="text-red-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Access Denied</h2>
          <p className="text-gray-600 text-center max-w-md mb-6">
            This page is restricted to administrators only. You need admin privileges to view and manage products.
          </p>
          <div className="flex items-center gap-2 bg-red-100 text-red-700 px-6 py-3 rounded-lg">
            <Shield size={20} />
            <span className="font-semibold">Admin Access Required</span>
          </div>
        </div>
      ) : (
        <>
          {/* Header with View Toggle */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
              <p className="text-gray-600 mt-1">Total Products: <span className="font-semibold text-indigo-600">{products.length}</span></p>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex gap-2 bg-gray-200 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                  viewMode === 'cards' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-300'
                }`}
              >
                <Grid size={18} />
                Cards
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                  viewMode === 'table' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-300'
                }`}
              >
                <List size={18} />
                Table
              </button>
            </div>
          </div>

          {/* Cards View */}
          {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <div 
              key={product.id} 
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-indigo-400"
            >
              {/* Product Image */}
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                {product.imageBase64 ? (
                  <img
                    src={`data:${product.imageType};base64,${product.imageBase64}`}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Package size={64} className="text-gray-400" />
                  </div>
                )}
                
                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.featured && (
                    <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                      <Star size={12} />
                      Featured
                    </span>
                  )}
                  {product.bestSeller && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                      <TrendingUp size={12} />
                      Best Seller
                    </span>
                  )}
                  {product.freeShipping && (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                      <Truck size={12} />
                      Free Ship
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div className="absolute top-2 right-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    product.inStock 
                      ? 'bg-green-500 text-white' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>

              {/* Product Details */}
              <div className="p-4">
                {/* Title */}
                <h3 className="font-bold text-lg text-gray-800 mb-1 truncate" title={product.name}>
                  {product.name}
                </h3>
                
                {/* Brand & Category */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <span className="font-medium">{product.brand}</span>
                  <span>•</span>
                  <span className="text-indigo-600">{product.category}</span>
                </div>

                {/* SKU & Model */}
                {(product.sku || product.model) && (
                  <div className="text-xs text-gray-500 mb-2">
                    {product.sku && <div>SKU: {product.sku}</div>}
                    {product.model && <div>Model: {product.model}</div>}
                  </div>
                )}

                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center gap-1 mb-2">
                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold text-gray-800">{product.rating}</span>
                    {product.reviewCount && (
                      <span className="text-sm text-gray-500">({product.reviewCount} reviews)</span>
                    )}
                  </div>
                )}

                {/* Price Section */}
                <div className="mb-3">
                  {product.discountPercentage && product.originalPrice ? (
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-green-600">
                          Rs. {product.price}
                        </span>
                        <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-semibold">
                          -{product.discountPercentage}%
                        </span>
                      </div>
                      <span className="text-sm text-gray-500 line-through">
                        Rs. {product.originalPrice}
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold text-green-600">
                      Rs. {product.price}
                    </span>
                  )}
                </div>

                {/* Stock Quantity */}
                <div className="flex items-center gap-2 text-sm mb-3">
                  <Package size={16} className="text-gray-400" />
                  <span className="text-gray-600">
                    Stock: <span className="font-semibold">{product.stockQuantity}</span> units
                  </span>
                </div>

                {/* Condition */}
                {product.condition && (
                  <div className="mb-3">
                    <span className={`text-xs px-2 py-1 rounded ${
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
                <div className="flex gap-2 pt-3 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="flex-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Image</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Product</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">SKU/Model</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Price</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Stock</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Rating</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-3">
                    {product.imageBase64 ? (
                      <img
                        src={`data:${product.imageType};base64,${product.imageBase64}`}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Package size={24} className="text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="font-semibold text-gray-800">{product.name}</div>
                    <div className="text-sm text-gray-600">{product.brand} • {product.category}</div>
                    {product.condition && (
                      <span className={`inline-block text-xs px-2 py-1 rounded mt-1 ${
                        product.condition === 'NEW' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {product.condition}
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                    {product.sku && <div>SKU: {product.sku}</div>}
                    {product.model && <div>Model: {product.model}</div>}
                    {!product.sku && !product.model && <span className="text-gray-400">-</span>}
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-green-600">Rs. {product.price}</div>
                    {product.discountPercentage && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500 line-through">Rs. {product.originalPrice}</span>
                        <span className="text-xs text-red-600 font-semibold">-{product.discountPercentage}%</span>
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    <span className={`font-semibold ${
                      product.stockQuantity > 50 ? 'text-green-600' : 
                      product.stockQuantity > 10 ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {product.stockQuantity}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-col gap-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold inline-block ${
                        product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {product.inStock ? 'In Stock' : 'Out'}
                      </span>
                      {product.featured && (
                        <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-semibold">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    {product.rating ? (
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        <span className="font-semibold">{product.rating}</span>
                        {product.reviewCount && (
                          <span className="text-xs text-gray-500">({product.reviewCount})</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">No rating</span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 p-2 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(product)}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Product Details</h2>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Image */}
                <div>
                  {selectedProduct.imageBase64 ? (
                    <img
                      src={`data:${selectedProduct.imageType};base64,${selectedProduct.imageBase64}`}
                      alt={selectedProduct.name}
                      className="w-full h-auto rounded-lg shadow-lg"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Package size={64} className="text-gray-400" />
                    </div>
                  )}
                  
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {selectedProduct.featured && (
                      <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        ⭐ Featured
                      </span>
                    )}
                    {selectedProduct.bestSeller && (
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        🔥 Best Seller
                      </span>
                    )}
                    {selectedProduct.freeShipping && (
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        🚚 Free Shipping
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{selectedProduct.name}</h3>
                    <p className="text-gray-600 mt-1">{selectedProduct.brand} • {selectedProduct.category}</p>
                  </div>

                  {/* Price */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    {selectedProduct.discountPercentage && selectedProduct.originalPrice ? (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="text-3xl font-bold text-green-600">Rs. {selectedProduct.price}</span>
                          <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full font-semibold">
                            -{selectedProduct.discountPercentage}% OFF
                          </span>
                        </div>
                        <span className="text-gray-500 line-through">Original: Rs. {selectedProduct.originalPrice}</span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold text-green-600">Rs. {selectedProduct.price}</span>
                    )}
                  </div>

                  {/* Stock & Availability */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">Stock Quantity</div>
                      <div className="text-2xl font-bold text-gray-800">{selectedProduct.stockQuantity}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">Status</div>
                      <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold ${
                        selectedProduct.inStock ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                        {selectedProduct.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>

                  {/* SKU & Model */}
                  {(selectedProduct.sku || selectedProduct.model) && (
                    <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                      {selectedProduct.sku && (
                        <div><span className="font-semibold">SKU:</span> {selectedProduct.sku}</div>
                      )}
                      {selectedProduct.model && (
                        <div><span className="font-semibold">Model:</span> {selectedProduct.model}</div>
                      )}
                    </div>
                  )}

                  {/* Rating */}
                  {selectedProduct.rating && (
                    <div className="flex items-center gap-2 bg-yellow-50 p-4 rounded-lg">
                      <Star size={24} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-2xl font-bold">{selectedProduct.rating}</span>
                      {selectedProduct.reviewCount && (
                        <span className="text-gray-600">({selectedProduct.reviewCount} reviews)</span>
                      )}
                    </div>
                  )}

                  {/* Description */}
                  {selectedProduct.description && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Description</h4>
                      <p className="text-gray-600">{selectedProduct.description}</p>
                    </div>
                  )}

                  {/* Additional Info */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {selectedProduct.condition && (
                      <div className="bg-gray-50 p-3 rounded">
                        <span className="text-gray-600">Condition:</span>
                        <span className="ml-2 font-semibold">{selectedProduct.condition}</span>
                      </div>
                    )}
                    {selectedProduct.warranty && (
                      <div className="bg-gray-50 p-3 rounded">
                        <span className="text-gray-600">Warranty:</span>
                        <span className="ml-2 font-semibold">{selectedProduct.warranty}</span>
                      </div>
                    )}
                    {selectedProduct.seller && (
                      <div className="bg-gray-50 p-3 rounded">
                        <span className="text-gray-600">Seller:</span>
                        <span className="ml-2 font-semibold">{selectedProduct.seller}</span>
                      </div>
                    )}
                    {selectedProduct.origin && (
                      <div className="bg-gray-50 p-3 rounded">
                        <span className="text-gray-600">Origin:</span>
                        <span className="ml-2 font-semibold">{selectedProduct.origin}</span>
                      </div>
                    )}
                  </div>

                  {/* Shipping */}
                  {(selectedProduct.shippingCost !== null || selectedProduct.freeShipping) && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">Shipping Information</h4>
                      {selectedProduct.freeShipping ? (
                        <p className="text-green-600 font-semibold">✅ Free Shipping Available</p>
                      ) : selectedProduct.shippingCost ? (
                        <p className="text-gray-700">Shipping Cost: Rs. {selectedProduct.shippingCost}</p>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex justify-end gap-3">
              <button
                onClick={() => setSelectedProduct(null)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleEdit(selectedProduct);
                  setSelectedProduct(null);
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Edit size={18} />
                Edit Product
              </button>
            </div>
          </div>
        </div>
      )}

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
      </>
      )}
    </div>
  );
};

export default ProductList;

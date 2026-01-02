import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, Star, Truck, Tag, TrendingUp, AlertCircle, Edit, Trash2, Eye, Grid, List, Shield, Lock } from 'lucide-react';
import { isAdmin } from '../services/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

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
    axios.get(`${API_BASE_URL}/product/all`)
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  };

  const handleDelete = (Id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const token = localStorage.getItem('token');
      axios.delete(`${API_BASE_URL}/product/delete/${Id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(() => {
          alert('Product deleted successfully!');
          fetchProducts();
        })
        .catch(error => {
          console.error('Error deleting product:', error);
          alert('Failed to delete the product. This product may be part of existing orders.');
        });
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setUpdatedProduct({
      name: product.name || '',
      brand: product.brand || '',
      category: product.category || '',
      description: product.description || '',
      price: product.price || '',
      stockQuantity: product.stockQuantity || 0,
      productAvailable: product.productAvailable ?? true,
      releaseDate: product.releaseDate || '',
      // Specifications
      sku: product.sku || '',
      model: product.model || '',
      specifications: product.specifications || '',
      warranty: product.warranty || '',
      condition: product.condition || 'NEW',
      // Pricing
      originalPrice: product.originalPrice || '',
      discountPercentage: product.discountPercentage || 0,
      shippingCost: product.shippingCost || '',
      freeShipping: product.freeShipping ?? false,
      // Details
      color: product.color || '',
      size: product.size || '',
      weight: product.weight || '',
      dimensions: product.dimensions || '',
      // Seller & Origin
      seller: product.seller || '',
      origin: product.origin || '',
      manufacturer: product.manufacturer || '',
      // Rating & Reviews
      rating: product.rating || '',
      reviewCount: product.reviewCount || 0,
      // Stock Management
      minOrderQuantity: product.minOrderQuantity || 1,
      maxOrderQuantity: product.maxOrderQuantity || '',
      featured: product.featured ?? false,
      bestSeller: product.bestSeller ?? false,
      // Tags & Keywords
      tags: product.tags || '',
      keywords: product.keywords || '',
      status: product.status || 'ACTIVE',
      // Image
      imageFile: null
    });
  };

  const handleUpdateChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      setUpdatedProduct(prev => ({
        ...prev,
        imageFile: files[0]
      }));
    } else if (type === 'checkbox') {
      setUpdatedProduct(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setUpdatedProduct(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    
    // Create FormData for multipart/form-data request
    const formData = new FormData();
    
    // Add all fields to FormData
    Object.keys(updatedProduct).forEach(key => {
      if (key === 'imageFile') {
        if (updatedProduct.imageFile) {
          formData.append('image', updatedProduct.imageFile); // Backend expects 'image' parameter
        }
      } else if (updatedProduct[key] !== null && updatedProduct[key] !== '' && updatedProduct[key] !== undefined) {
        formData.append(key, updatedProduct[key]);
      }
    });

    // Get token from localStorage
    const token = localStorage.getItem('token');

    axios.put(`${API_BASE_URL}/product/update-with-image/${editingProduct.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      },
    })
      .then(() => {
        alert('Product updated successfully!');
        setEditingProduct(null);
        fetchProducts();
      })
      .catch(error => {
        console.error('Error updating product:', error);
        alert('Failed to update product: ' + (error.response?.data?.message || error.message));
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
                {product.imageUrl || product.imagePath || product.imageBase64 ? (
                  <img
                    src={product.imageUrl || product.imagePath || `data:${product.imageType};base64,${product.imageBase64}`}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<div class="flex items-center justify-center h-full"><svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg></div>';
                    }}
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
                    {product.imageUrl || product.imagePath || product.imageBase64 ? (
                      <img
                        src={product.imageUrl || product.imagePath || `data:${product.imageType};base64,${product.imageBase64}`}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<div class="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg></div>';
                        }}
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
                  {selectedProduct.imageUrl || selectedProduct.imagePath || selectedProduct.imageBase64 ? (
                    <img
                      src={selectedProduct.imageUrl || selectedProduct.imagePath || `data:${selectedProduct.imageType};base64,${selectedProduct.imageBase64}`}
                      alt={selectedProduct.name}
                      className="w-full h-auto rounded-lg shadow-lg"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                      }}
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl my-8">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-xl flex justify-between items-center">
              <h2 className="text-2xl font-bold">Edit Product</h2>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-white hover:text-gray-200 text-3xl font-bold leading-none"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleUpdateSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Current Product Image */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-3">Current Product Image</h3>
                <div className="flex items-center gap-4">
                  {editingProduct.imageUrl || editingProduct.imagePath ? (
                    <img
                      src={editingProduct.imageUrl || editingProduct.imagePath}
                      alt={editingProduct.name}
                      className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Package size={48} className="text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload New Image (Optional)
                    </label>
                    <input
                      type="file"
                      name="imageFile"
                      accept="image/*"
                      onChange={handleUpdateChange}
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave empty to keep current image</p>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2">
                  <Package size={20} className="text-blue-600" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={updatedProduct.name}
                      onChange={handleUpdateChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Product Name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
                    <input
                      type="text"
                      name="brand"
                      value={updatedProduct.brand}
                      onChange={handleUpdateChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Brand"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <input
                      type="text"
                      name="category"
                      value={updatedProduct.category}
                      onChange={handleUpdateChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Category"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                    <input
                      type="text"
                      name="sku"
                      value={updatedProduct.sku}
                      onChange={handleUpdateChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="SKU"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                    <input
                      type="text"
                      name="model"
                      value={updatedProduct.model}
                      onChange={handleUpdateChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Model"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                    <select
                      name="condition"
                      value={updatedProduct.condition}
                      onChange={handleUpdateChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="NEW">New</option>
                      <option value="REFURBISHED">Refurbished</option>
                      <option value="USED">Used</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={updatedProduct.description}
                      onChange={handleUpdateChange}
                      rows="3"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Product description"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2">
                  <Tag size={20} className="text-green-600" />
                  Pricing Information
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> If you enter Original Price and Discount %, the Final Price will be auto-calculated. 
                    Otherwise, enter the Final Price directly.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Original Price
                      <span className="text-xs text-gray-500 ml-1">(before discount)</span>
                    </label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={updatedProduct.originalPrice}
                      onChange={handleUpdateChange}
                      step="0.01"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount %
                      <span className="text-xs text-gray-500 ml-1">(0-100)</span>
                    </label>
                    <input
                      type="number"
                      name="discountPercentage"
                      value={updatedProduct.discountPercentage}
                      onChange={handleUpdateChange}
                      min="0"
                      max="100"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Final Price *
                      <span className="text-xs text-gray-500 ml-1">(auto-calculated if discount set)</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={updatedProduct.price}
                      onChange={handleUpdateChange}
                      step="0.01"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Cost</label>
                    <input
                      type="number"
                      name="shippingCost"
                      value={updatedProduct.shippingCost}
                      onChange={handleUpdateChange}
                      step="0.01"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="freeShipping"
                      checked={updatedProduct.freeShipping}
                      onChange={handleUpdateChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Free Shipping</span>
                  </label>
                </div>
              </div>

              {/* Stock Management */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2">
                  <Package size={20} className="text-purple-600" />
                  Stock & Availability
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
                    <input
                      type="number"
                      name="stockQuantity"
                      value={updatedProduct.stockQuantity}
                      onChange={handleUpdateChange}
                      min="0"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Order Qty</label>
                    <input
                      type="number"
                      name="minOrderQuantity"
                      value={updatedProduct.minOrderQuantity}
                      onChange={handleUpdateChange}
                      min="1"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Order Qty</label>
                    <input
                      type="number"
                      name="maxOrderQuantity"
                      value={updatedProduct.maxOrderQuantity}
                      onChange={handleUpdateChange}
                      min="1"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Unlimited"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="productAvailable"
                      checked={updatedProduct.productAvailable}
                      onChange={handleUpdateChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Product Available</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={updatedProduct.featured}
                      onChange={handleUpdateChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Featured Product</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="bestSeller"
                      checked={updatedProduct.bestSeller}
                      onChange={handleUpdateChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Best Seller</span>
                  </label>
                </div>
              </div>

              {/* Product Details */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-lg text-gray-800 mb-4">Product Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                    <input
                      type="text"
                      name="color"
                      value={updatedProduct.color}
                      onChange={handleUpdateChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Color"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                    <input
                      type="text"
                      name="size"
                      value={updatedProduct.size}
                      onChange={handleUpdateChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Size"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                    <input
                      type="text"
                      name="weight"
                      value={updatedProduct.weight}
                      onChange={handleUpdateChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 1.5 kg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions</label>
                    <input
                      type="text"
                      name="dimensions"
                      value={updatedProduct.dimensions}
                      onChange={handleUpdateChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 10x20x30 cm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Warranty</label>
                    <input
                      type="text"
                      name="warranty"
                      value={updatedProduct.warranty}
                      onChange={handleUpdateChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 1 Year"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Release Date</label>
                    <input
                      type="date"
                      name="releaseDate"
                      value={updatedProduct.releaseDate?.slice(0, 10)}
                      onChange={handleUpdateChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specifications</label>
                    <textarea
                      name="specifications"
                      value={updatedProduct.specifications}
                      onChange={handleUpdateChange}
                      rows="2"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Technical specifications"
                    />
                  </div>
                </div>
              </div>

              {/* Seller & Origin */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-lg text-gray-800 mb-4">Seller & Origin</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Seller</label>
                    <input
                      type="text"
                      name="seller"
                      value={updatedProduct.seller}
                      onChange={handleUpdateChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Seller Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
                    <input
                      type="text"
                      name="origin"
                      value={updatedProduct.origin}
                      onChange={handleUpdateChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Country of Origin"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                    <input
                      type="text"
                      name="manufacturer"
                      value={updatedProduct.manufacturer}
                      onChange={handleUpdateChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Manufacturer"
                    />
                  </div>
                </div>
              </div>

              {/* Rating & Reviews */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2">
                  <Star size={20} className="text-yellow-500" />
                  Rating & Reviews
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating (0-5)</label>
                    <input
                      type="number"
                      name="rating"
                      value={updatedProduct.rating}
                      onChange={handleUpdateChange}
                      step="0.1"
                      min="0"
                      max="5"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Review Count</label>
                    <input
                      type="number"
                      name="reviewCount"
                      value={updatedProduct.reviewCount}
                      onChange={handleUpdateChange}
                      min="0"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Tags & Keywords */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-lg text-gray-800 mb-4">Tags & Metadata</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                    <input
                      type="text"
                      name="tags"
                      value={updatedProduct.tags}
                      onChange={handleUpdateChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="gaming, laptop, high-performance"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
                    <input
                      type="text"
                      name="keywords"
                      value={updatedProduct.keywords}
                      onChange={handleUpdateChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="SEO keywords"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      name="status"
                      value={updatedProduct.status}
                      onChange={handleUpdateChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                      <option value="DISCONTINUED">Discontinued</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t-2 border-gray-200">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <Edit size={18} />
                  Update Product
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

import { useState } from 'react';
import axios from 'axios';

function ProductCreate() {
  // Simple form for small laptop shop - only essential fields
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand: '',
    price: '',
    category: '',
    productAvailable: true,
    stockQuantity: 1,
    specifications: '',
    warranty: '',
    condition: 'NEW'
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Check if file is JPEG
      if (!['image/jpeg', 'image/jpg'].includes(file.type)) {
        setMessage('Only JPEG/JPG files are allowed');
        setSelectedFile(null);
        setPreviewUrl('');
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      
      setMessage('');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      const productFormData = new FormData();
      
      // Append all product fields (only non-empty values for optional fields)
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          productFormData.append(key, value);
        }
      });
      
      // Append image if selected
      if (selectedFile) {
        productFormData.append('image', selectedFile);
      }
      
      // Use basic endpoint for simple product creation
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
      const endpoint = `${API_BASE_URL}/product/with-image`;
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      // Send request to create product with image
      const response = await axios.post(
        endpoint,
        productFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': token ? `Bearer ${token}` : ''
          },
        }
      );
      
      // Reset form to initial state
      setFormData({
        name: '',
        description: '',
        brand: '',
        price: '',
        category: '',
        productAvailable: true,
        stockQuantity: 1,
        specifications: '',
        warranty: '',
        condition: 'NEW'
      });
      setSelectedFile(null);
      setPreviewUrl('');
      
      setMessage('Product created successfully!');
      console.log('Response:', response.data);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
      
    } catch (error) {
      console.error('Error creating product:', error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Failed to create product. Please try again.';
      setMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">නව නිෂ්පාදනයක් එකතු කරන්න</h2>
      <p className="text-center text-gray-600 mb-6">Add New Laptop Product</p>
      
      {message && (
        <div className={`p-4 mb-6 rounded-lg ${message.includes('successfully') ? 'bg-green-100 text-green-700 border border-green-400' : 'bg-red-100 text-red-700 border border-red-400'}`}>
          <p className="font-semibold">{message}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Product Image Upload - Prominent */}
        <div className="mb-6 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
          <label className="block text-gray-700 mb-3 font-semibold text-lg" htmlFor="image">
            📷 නිෂ්පාදන පින්තූරය / Product Image
          </label>
          
          {previewUrl && (
            <div className="mb-4">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-64 mx-auto rounded-lg shadow-md border border-gray-200"
              />
            </div>
          )}
          
          <input
            type="file"
            id="image"
            accept="image/jpeg,image/jpg"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          />
          <p className="text-xs text-gray-500 mt-2">JPEG/JPG only • Max size: 5MB</p>
        </div>

        {/* Basic Product Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Product Name */}
          <div>
            <label className="block text-gray-700 mb-2 font-semibold" htmlFor="name">
              නිෂ්පාදන නම / Product Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              required
              placeholder="උදා: Dell Latitude 5420"
            />
          </div>
          
          {/* Brand */}
          <div>
            <label className="block text-gray-700 mb-2 font-semibold" htmlFor="brand">
              සන්නාමය / Brand *
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              required
              placeholder="උදා: Dell, HP, Lenovo"
            />
          </div>
          
          {/* Price */}
          <div>
            <label className="block text-gray-700 mb-2 font-semibold" htmlFor="price">
              මිල (රු.) / Price (RS) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              required
              placeholder="උදා: 125000"
            />
          </div>
          
          {/* Category */}
          <div>
            <label className="block text-gray-700 mb-2 font-semibold" htmlFor="category">
              වර්ගය / Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              required
            >
              <option value="">Select කරන්න</option>
              <option value="Laptops">💻 Laptops</option>
              <option value="Gaming">🎮 Gaming Laptops</option>
              <option value="Business">💼 Business Laptops</option>
              <option value="Budget">💰 Budget Laptops</option>
              <option value="Ultrabook">⚡ Ultrabooks</option>
              <option value="Accessories">🎧 Accessories</option>
            </select>
          </div>
          
          {/* Stock Quantity */}
          <div>
            <label className="block text-gray-700 mb-2 font-semibold" htmlFor="stockQuantity">
              තොග ප්‍රමාණය / Stock Quantity *
            </label>
            <input
              type="number"
              id="stockQuantity"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleInputChange}
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              required
              placeholder="උදා: 5"
            />
          </div>
          
          {/* Condition */}
          <div>
            <label className="block text-gray-700 mb-2 font-semibold" htmlFor="condition">
              තත්වය / Condition *
            </label>
            <select
              id="condition"
              name="condition"
              value={formData.condition}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            >
              <option value="NEW">🆕 New - අලුත්</option>
              <option value="USED">📦 Used - භාවිතා කළ</option>
              <option value="REFURBISHED">🔧 Refurbished</option>
            </select>
          </div>
        </div>
        
        {/* Description */}
        <div>
          <label className="block text-gray-700 mb-2 font-semibold" htmlFor="description">
            විස්තරය / Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            required
            placeholder="නිෂ්පාදනය ගැන විස්තර කරන්න... (උදා: Core i5 10th Gen, 8GB RAM, 256GB SSD)"
          ></textarea>
        </div>
        
        {/* Specifications */}
        <div>
          <label className="block text-gray-700 mb-2 font-semibold" htmlFor="specifications">
            පිරිවිතර / Specifications (Optional)
          </label>
          <textarea
            id="specifications"
            name="specifications"
            value={formData.specifications}
            onChange={handleInputChange}
            rows="5"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="උදාහරණය:&#10;• Processor: Intel Core i5 10th Gen&#10;• RAM: 8GB DDR4&#10;• Storage: 256GB SSD&#10;• Display: 15.6&quot; FHD&#10;• Graphics: Intel UHD"
          ></textarea>
          <p className="text-sm text-gray-500 mt-1">ප්‍රධාන පිරිවිතර මෙතන ලියන්න</p>
        </div>
        
        {/* Warranty */}
        <div>
          <label className="block text-gray-700 mb-2 font-semibold" htmlFor="warranty">
            වගකීම / Warranty (Optional)
          </label>
          <input
            type="text"
            id="warranty"
            name="warranty"
            value={formData.warranty}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="උදා: 1 Year International Warranty"
          />
        </div>
        
        {/* Availability Checkbox */}
        <div className="flex items-center bg-blue-50 p-4 rounded-lg">
          <input
            type="checkbox"
            name="productAvailable"
            id="productAvailable"
            checked={formData.productAvailable}
            onChange={handleInputChange}
            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="productAvailable" className="ml-3 text-gray-700 font-semibold cursor-pointer">
            ✅ මෙම නිෂ්පාදනය ලබා ගත හැකිය / Product is Available for Sale
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg text-lg font-semibold"
          >
            {isLoading ? '⏳ Adding Product...' : '✅ නිෂ්පාදනය එකතු කරන්න / Add Product'}
          </button>
          
          <button
            type="button"
            onClick={() => {
              setFormData({
                name: '',
                description: '',
                brand: '',
                price: '',
                category: '',
                productAvailable: true,
                stockQuantity: 1,
                specifications: '',
                warranty: '',
                condition: 'NEW'
              });
              setSelectedFile(null);
              setPreviewUrl('');
              setMessage('');
            }}
            className="px-6 py-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300 font-semibold"
          >
            🔄 Clear
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductCreate;

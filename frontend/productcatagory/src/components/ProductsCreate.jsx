import { useState } from 'react';
import axios from 'axios';

function ProductCreate() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand: '',
    price: '',
    category: '',
    releaseDate: '',
    productAvailable: true,
    stockQuantity: 1
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
      
      // Append all product fields
      Object.entries(formData).forEach(([key, value]) => {
        productFormData.append(key, value);
      });
      
      // Append image if selected
      if (selectedFile) {
        productFormData.append('image', selectedFile);
      }
      
      // Send request to create product with image
      const response = await axios.post(
        'http://localhost:8080/api/product/with-image',
        productFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        brand: '',
        price: '',
        category: '',
        releaseDate: '',
        productAvailable: true,
        stockQuantity: 1
      });
      setSelectedFile(null);
      setPreviewUrl('');
      
      setMessage('Product created successfully!');
      console.log('Response:', response.data);
      
    } catch (error) {
      console.error('Error creating product:', error);
      setMessage('Failed to create product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Create New Product</h2>
      
      {message && (
        <div className={`p-3 mb-4 rounded-md ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product Name */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="name">
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          {/* Brand */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="brand">
              Brand *
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          {/* Price */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="price">
              Price *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          {/* Category */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="category">
              Category *
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          {/* Release Date */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="releaseDate">
              Release Date
            </label>
            <input
              type="date"
              id="releaseDate"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Stock Quantity */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="stockQuantity">
              Stock Quantity *
            </label>
            <input
              type="number"
              id="stockQuantity"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleInputChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        
        {/* Description - Full width */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="description">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>
        
        {/* Availability Checkbox */}
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="productAvailable"
              checked={formData.productAvailable}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-gray-700">Product Available</span>
          </label>
        </div>
        
        {/* Image Upload */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="image">
            Product Image (JPEG only)
          </label>
          <input
            type="file"
            id="image"
            accept=".jpg,.jpeg"
            onChange={handleFileChange}
            className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">Only JPEG/JPG files are accepted</p>
        </div>
        
        {/* Image Preview */}
        {previewUrl && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Image Preview:</label>
            <div className="border border-gray-300 rounded-md p-2">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-40 mx-auto"
              />
            </div>
          </div>
        )}
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Creating...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
}

export default ProductCreate;
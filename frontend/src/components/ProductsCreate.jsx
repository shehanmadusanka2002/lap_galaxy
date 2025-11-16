import { useState } from 'react';
import axios from 'axios';

function ProductCreate() {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const [formData, setFormData] = useState({
    // Basic fields
    name: '',
    description: '',
    brand: '',
    price: '',
    category: '',
    releaseDate: '',
    productAvailable: true,
    stockQuantity: 1,
    
    // Advanced industrial fields
    sku: '',
    model: '',
    specifications: '• \n• \n• \n• \n• ',
    warranty: '',
    condition: 'NEW',
    originalPrice: '',
    discountPercentage: '',
    shippingCost: '',
    freeShipping: false,
    color: '',
    size: '',
    weight: '',
    dimensions: '',
    seller: '',
    origin: '',
    manufacturer: '',
    rating: '',
    reviewCount: '',
    minOrderQuantity: '1',
    maxOrderQuantity: '',
    featured: false,
    bestSeller: false,
    tags: '',
    keywords: '',
    status: 'ACTIVE'
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
      
      // Use advanced endpoint if advanced fields are being used
      const endpoint = showAdvanced 
        ? 'http://localhost:8080/api/product/create-advanced'
        : 'http://localhost:8080/api/product/with-image';
      
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
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        brand: '',
        price: '',
        category: '',
        releaseDate: '',
        productAvailable: true,
        stockQuantity: 1,
        sku: '',
        model: '',
        specifications: '',
        warranty: '',
        condition: 'NEW',
        originalPrice: '',
        discountPercentage: '',
        shippingCost: '',
        freeShipping: false,
        color: '',
        size: '',
        weight: '',
        dimensions: '',
        seller: '',
        origin: '',
        manufacturer: '',
        rating: '',
        reviewCount: '',
        minOrderQuantity: '1',
        maxOrderQuantity: '',
        featured: false,
        bestSeller: false,
        tags: '',
        keywords: '',
        status: 'ACTIVE'
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
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Create New Product</h2>
      
      {/* Toggle Advanced Fields Button */}
      <div className="mb-6 text-center">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 shadow-md"
        >
          {showAdvanced ? '📋 Show Basic Fields Only' : '🚀 Show Industrial Fields (Daraz-like)'}
        </button>
        <p className="text-sm text-gray-500 mt-2">
          {showAdvanced ? 'Using advanced endpoint with 40+ fields' : 'Using basic product creation'}
        </p>
      </div>
      
      {message && (
        <div className={`p-4 mb-6 rounded-lg ${message.includes('successfully') ? 'bg-green-100 text-green-700 border border-green-400' : 'bg-red-100 text-red-700 border border-red-400'}`}>
          <p className="font-semibold">{message}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* BASIC FIELDS */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">📦 Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Product Name */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium" htmlFor="name">
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
                placeholder="e.g., Dell XPS 15"
              />
            </div>
            
            {/* Brand */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium" htmlFor="brand">
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
                placeholder="e.g., Dell"
              />
            </div>
            
            {/* Price */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium" htmlFor="price">
                Price (RS) *
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
                placeholder="1499.99"
              />
            </div>
            
            {/* Category */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium" htmlFor="category">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Category</option>
                <option value="Laptops">Laptops</option>
                <option value="Desktops">Desktops</option>
                <option value="Accessories">Accessories</option>
                <option value="Components">Components</option>
                <option value="Peripherals">Peripherals</option>
                <option value="Gaming">Gaming</option>
              </select>
            </div>
            
            {/* Release Date */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium" htmlFor="releaseDate">
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
              <label className="block text-gray-700 mb-2 font-medium" htmlFor="stockQuantity">
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
                placeholder="100"
              />
            </div>
          </div>
          
          {/* Description - Full width */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium" htmlFor="description">
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
              placeholder="Detailed product description..."
            ></textarea>
          </div>
          
          {/* Availability Checkbox */}
          <div className="mb-4 flex items-center space-x-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="productAvailable"
                checked={formData.productAvailable}
                onChange={handleInputChange}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-gray-700 font-medium">✅ Product Available</span>
            </label>
          </div>
        </div>

        {/* ADVANCED FIELDS - Only show if showAdvanced is true */}
        {showAdvanced && (
          <>
            {/* Product Specifications */}
            <div className="mb-8 bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">🔧 Product Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium" htmlFor="sku">
                    SKU (Stock Keeping Unit)
                  </label>
                  <input
                    type="text"
                    id="sku"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="DELL-XPS15-001"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2 font-medium" htmlFor="model">
                    Model Number
                  </label>
                  <input
                    type="text"
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="XPS 15 9530"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2 font-medium" htmlFor="condition">
                    Condition
                  </label>
                  <select
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="NEW">NEW</option>
                    <option value="REFURBISHED">REFURBISHED</option>
                    <option value="USED">USED</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2 font-medium" htmlFor="specifications">
                    Technical Specifications
                    <span className="text-sm text-gray-500 ml-2">(One spec per line, use bullet points)</span>
                  </label>
                  <textarea
                    id="specifications"
                    name="specifications"
                    value={formData.specifications}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`• Processor: Intel Core i7-13700H
• RAM: 32GB DDR5
• Storage: 1TB NVMe SSD
• Display: 15.6" OLED 4K
• Graphics: NVIDIA RTX 4060 8GB`}
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Tip: Start each line with • or - for bullet points
                  </p>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2 font-medium" htmlFor="warranty">
                    Warranty
                  </label>
                  <input
                    type="text"
                    id="warranty"
                    name="warranty"
                    value={formData.warranty}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="3 years international warranty"
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Discounts */}
            <div className="mb-8 bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">💰 Pricing & Discounts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium" htmlFor="originalPrice">
                    Original Price ($)
                  </label>
                  <input
                    type="number"
                    id="originalPrice"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1799.99"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2 font-medium" htmlFor="discountPercentage">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    id="discountPercentage"
                    name="discountPercentage"
                    value={formData.discountPercentage}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="15"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2 font-medium" htmlFor="shippingCost">
                    Shipping Cost ($)
                  </label>
                  <input
                    type="number"
                    id="shippingCost"
                    name="shippingCost"
                    value={formData.shippingCost}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
                
                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer mt-6">
                    <input
                      type="checkbox"
                      name="freeShipping"
                      checked={formData.freeShipping}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-gray-700 font-medium">🚚 Free Shipping</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="mb-8 bg-yellow-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">📏 Product Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium" htmlFor="color">
                    Color
                  </label>
                  <input
                    type="text"
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Platinum Silver"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2 font-medium" htmlFor="size">
                    Size
                  </label>
                  <input
                    type="text"
                    id="size"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="15.6 inch"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2 font-medium" htmlFor="weight">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1.8"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2 font-medium" htmlFor="dimensions">
                    Dimensions
                  </label>
                  <input
                    type="text"
                    id="dimensions"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="345 x 235 x 18 mm"
                  />
                </div>
              </div>
            </div>

            {/* Seller & Origin */}
            <div className="mb-8 bg-purple-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">🏭 Seller & Origin</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium" htmlFor="seller">
                    Seller Name
                  </label>
                  <input
                    type="text"
                    id="seller"
                    name="seller"
                    value={formData.seller}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="LapGalaxy Official"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2 font-medium" htmlFor="origin">
                    Country of Origin
                  </label>
                  <input
                    type="text"
                    id="origin"
                    name="origin"
                    value={formData.origin}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="USA"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2 font-medium" htmlFor="manufacturer">
                    Manufacturer
                  </label>
                  <input
                    type="text"
                    id="manufacturer"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Dell Inc."
                  />
                </div>
              </div>
            </div>

            {/* Rating & Reviews */}
            <div className="mb-8 bg-pink-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">⭐ Rating & Reviews</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium" htmlFor="rating">
                    Average Rating (0-5)
                  </label>
                  <input
                    type="number"
                    id="rating"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    min="0"
                    max="5"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="4.5"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2 font-medium" htmlFor="reviewCount">
                    Number of Reviews
                  </label>
                  <input
                    type="number"
                    id="reviewCount"
                    name="reviewCount"
                    value={formData.reviewCount}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="120"
                  />
                </div>
              </div>
            </div>

            {/* Stock Management */}
            <div className="mb-8 bg-indigo-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">📦 Stock Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium" htmlFor="minOrderQuantity">
                    Min Order Quantity
                  </label>
                  <input
                    type="number"
                    id="minOrderQuantity"
                    name="minOrderQuantity"
                    value={formData.minOrderQuantity}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2 font-medium" htmlFor="maxOrderQuantity">
                    Max Order Quantity
                  </label>
                  <input
                    type="number"
                    id="maxOrderQuantity"
                    name="maxOrderQuantity"
                    value={formData.maxOrderQuantity}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="10"
                  />
                </div>
                
                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer mt-6">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-gray-700 font-medium">⭐ Featured Product</span>
                  </label>
                </div>
                
                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer mt-6">
                    <input
                      type="checkbox"
                      name="bestSeller"
                      checked={formData.bestSeller}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-gray-700 font-medium">🔥 Best Seller</span>
                  </label>
                </div>
              </div>
            </div>

            {/* SEO & Search */}
            <div className="mb-8 bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">🔍 SEO & Search</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium" htmlFor="tags">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="laptop, premium, dell, professional, workstation"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2 font-medium" htmlFor="keywords">
                    SEO Keywords
                  </label>
                  <input
                    type="text"
                    id="keywords"
                    name="keywords"
                    value={formData.keywords}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="dell xps laptop professional workstation business"
                  />
                </div>
              </div>
            </div>

            {/* Product Status */}
            <div className="mb-8 bg-red-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">📊 Product Status</h3>
              <div>
                <label className="block text-gray-700 mb-2 font-medium" htmlFor="status">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="OUT_OF_STOCK">OUT OF STOCK</option>
                  <option value="DISCONTINUED">DISCONTINUED</option>
                </select>
              </div>
            </div>
          </>
        )}
        
        {/* Image Upload */}
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">📸 Product Image</h3>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium" htmlFor="image">
              Upload Product Image (JPEG only)
            </label>
            <input
              type="file"
              id="image"
              accept=".jpg,.jpeg"
              onChange={handleFileChange}
              className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="mt-2 text-sm text-gray-500">📌 Only JPEG/JPG files are accepted for consistency</p>
          </div>
          
          {/* Image Preview */}
          {previewUrl && (
            <div className="mt-4">
              <label className="block text-gray-700 mb-2 font-medium">Image Preview:</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-64 mx-auto rounded-lg shadow-md"
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Submit Button */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 shadow-lg ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'transform hover:scale-105'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Product...
              </span>
            ) : (
              showAdvanced ? '🚀 Create Advanced Product (40+ Fields)' : '✅ Create Product'
            )}
          </button>
          
          <button
            type="button"
            onClick={() => {
              if (confirm('Are you sure you want to reset the form?')) {
                setFormData({
                  name: '',
                  description: '',
                  brand: '',
                  price: '',
                  category: '',
                  releaseDate: '',
                  productAvailable: true,
                  stockQuantity: 1,
                  sku: '',
                  model: '',
                  specifications: '',
                  warranty: '',
                  condition: 'NEW',
                  originalPrice: '',
                  discountPercentage: '',
                  shippingCost: '',
                  freeShipping: false,
                  color: '',
                  size: '',
                  weight: '',
                  dimensions: '',
                  seller: '',
                  origin: '',
                  manufacturer: '',
                  rating: '',
                  reviewCount: '',
                  minOrderQuantity: '1',
                  maxOrderQuantity: '',
                  featured: false,
                  bestSeller: false,
                  tags: '',
                  keywords: '',
                  status: 'ACTIVE'
                });
                setSelectedFile(null);
                setPreviewUrl('');
                setMessage('');
              }
            }}
            className="px-8 py-3 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-300 shadow-lg transform hover:scale-105"
          >
            🔄 Reset Form
          </button>
        </div>
      </form>
      
      {/* Field Count Info */}
      <div className="mt-6 p-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg text-center">
        <p className="text-sm text-gray-700">
          {showAdvanced ? (
            <span className="font-semibold">
              ✨ Using <span className="text-purple-700">Industrial Mode</span>: 40+ fields including SKU, ratings, shipping, SEO & more!
            </span>
          ) : (
            <span className="font-semibold">
              📋 Using <span className="text-blue-700">Basic Mode</span>: Essential product fields only
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

export default ProductCreate;
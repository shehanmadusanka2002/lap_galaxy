import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, Trash2, Eye, EyeOff, Edit2, Plus, Save, X } from 'lucide-react';
import { isAdmin } from '../services/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://16.170.168.84:32050/api';

const HeroManagement = () => {
  const [heroImages, setHeroImages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    buttonText: '',
    buttonLink: '',
    displayOrder: 0,
    active: true
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const adminUser = isAdmin();

  useEffect(() => {
    if (adminUser) {
      fetchHeroImages();
    }
  }, [adminUser]);

  const fetchHeroImages = () => {
    const token = localStorage.getItem('token');
    axios.get(`${API_BASE_URL}/hero/all`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(response => setHeroImages(response.data))
      .catch(error => console.error('Error fetching hero images:', error));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('buttonText', formData.buttonText);
    data.append('buttonLink', formData.buttonLink);
    data.append('displayOrder', formData.displayOrder);
    data.append('active', formData.active);
    
    if (selectedFile) {
      data.append('image', selectedFile);
    }

    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/hero/${editingId}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });
        setMessage('Hero image updated successfully!');
      } else {
        await axios.post(`${API_BASE_URL}/hero/upload`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });
        setMessage('Hero image uploaded successfully!');
      }
      
      resetForm();
      fetchHeroImages();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.error || error.message));
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (hero) => {
    setEditingId(hero.id);
    setFormData({
      title: hero.title || '',
      description: hero.description || '',
      buttonText: hero.buttonText || '',
      buttonLink: hero.buttonLink || '',
      displayOrder: hero.displayOrder || 0,
      active: hero.active
    });
    setPreviewUrl(hero.imageBase64 ? `data:${hero.imageType};base64,${hero.imageBase64}` : '');
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this hero image?')) {
      const token = localStorage.getItem('token');
      try {
        await axios.delete(`${API_BASE_URL}/hero/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setMessage('Hero image deleted successfully!');
        fetchHeroImages();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Error deleting hero image');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  const toggleActive = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch(`${API_BASE_URL}/hero/${id}/toggle`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchHeroImages();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      buttonText: '',
      buttonLink: '',
      displayOrder: 0,
      active: true
    });
    setSelectedFile(null);
    setPreviewUrl('');
    setEditingId(null);
    setShowForm(false);
  };

  if (!adminUser) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600">Admin privileges required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Hero Image Management</h1>
          <p className="text-gray-600 mt-1">Manage homepage hero slider images</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg flex items-center gap-2 transition-all"
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          {showForm ? 'Cancel' : 'Add New Hero'}
        </button>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`p-4 rounded-lg mb-6 ${
          message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {message}
        </div>
      )}

      {/* Upload Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold mb-6">
            {editingId ? 'Edit Hero Image' : 'Add New Hero Image'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Premium Laptops Sale"
                />
              </div>

              {/* Button Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Button Text
                </label>
                <input
                  type="text"
                  name="buttonText"
                  value={formData.buttonText}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Shop Now"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Hero image description..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Button Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Button Link
                </label>
                <input
                  type="text"
                  name="buttonLink"
                  value={formData.buttonLink}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., /products"
                />
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  name="displayOrder"
                  value={formData.displayOrder}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Active Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <label className="flex items-center space-x-3 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <span className="font-medium">Active</span>
                </label>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hero Image {editingId ? '(Leave empty to keep current)' : '*'}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required={!editingId}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Image Preview */}
            {previewUrl && (
              <div className="border border-gray-300 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview</p>
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    {editingId ? 'Updating...' : 'Uploading...'}
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    {editingId ? 'Update Hero' : 'Upload Hero'}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Hero Images List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {heroImages.map((hero) => (
          <div
            key={hero.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-all"
          >
            <div className="relative h-48">
              <img
                src={`data:${hero.imageType};base64,${hero.imageBase64}`}
                alt={hero.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  hero.active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                }`}>
                  {hero.active ? 'Active' : 'Inactive'}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500 text-white">
                  Order: {hero.displayOrder}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-800 mb-2">{hero.title}</h3>
              {hero.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{hero.description}</p>
              )}
              
              <div className="flex gap-2">
                <button
                  onClick={() => toggleActive(hero.id)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
                  title={hero.active ? 'Deactivate' : 'Activate'}
                >
                  {hero.active ? <EyeOff size={16} /> : <Eye size={16} />}
                  {hero.active ? 'Hide' : 'Show'}
                </button>
                <button
                  onClick={() => handleEdit(hero)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
                >
                  <Edit2 size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(hero.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {heroImages.length === 0 && !showForm && (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <Upload size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Hero Images Yet</h3>
          <p className="text-gray-600 mb-6">Upload your first hero image to get started</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Add Hero Image
          </button>
        </div>
      )}
    </div>
  );
};

export default HeroManagement;

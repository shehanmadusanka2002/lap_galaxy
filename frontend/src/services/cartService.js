import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Get or create session ID for guest users
export const getSessionId = () => {
  let sessionId = localStorage.getItem('guestSessionId');
  if (!sessionId) {
    sessionId = 'guest_' + Math.random().toString(36).substring(2) + Date.now();
    localStorage.setItem('guestSessionId', sessionId);
  }
  return sessionId;
};

// Cart API functions
export const cartAPI = {
  /**
   * Add item to cart
   */
  addToCart: async (productId, quantity = 1) => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const data = {
        productId,
        quantity,
        sessionId: !token ? getSessionId() : undefined
      };
      
      console.log('Adding to cart:', data);
      
      const response = await axios.post(`${API_BASE_URL}/cart/add`, data, { headers });
      return response.data;
    } catch (error) {
      console.error('Cart API Error:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Get cart
   */
  getCart: async () => {
    const token = localStorage.getItem('token');
    const headers = {};
    const params = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      params.sessionId = getSessionId();
    }
    
    const response = await axios.get(`${API_BASE_URL}/cart`, { headers, params });
    return response.data;
  },

  /**
   * Update cart item quantity
   */
  updateCartItem: async (cartId, itemId, quantity) => {
    const token = localStorage.getItem('token');
    const headers = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await axios.put(
      `${API_BASE_URL}/cart/${cartId}/items/${itemId}?quantity=${quantity}`,
      {},
      { headers }
    );
    return response.data;
  },

  /**
   * Remove item from cart
   */
  removeFromCart: async (cartId, itemId) => {
    const token = localStorage.getItem('token');
    const headers = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await axios.delete(
      `${API_BASE_URL}/cart/${cartId}/items/${itemId}`,
      { headers }
    );
    return response.data;
  },

  /**
   * Clear cart
   */
  clearCart: async (cartId) => {
    const token = localStorage.getItem('token');
    const headers = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await axios.delete(
      `${API_BASE_URL}/cart/${cartId}/clear`,
      { headers }
    );
    return response.data;
  },

  /**
   * Merge guest cart with user cart after login
   */
  mergeCart: async () => {
    const token = localStorage.getItem('token');
    const sessionId = getSessionId();
    
    if (!token) {
      throw new Error('Authentication required to merge cart');
    }
    
    const response = await axios.post(
      `${API_BASE_URL}/cart/merge?sessionId=${sessionId}`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  }
};

export default cartAPI;

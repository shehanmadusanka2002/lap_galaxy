import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://16.170.168.84:32050/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const orderAPI = {
  createOrder: async (orderData) => {
    const response = await axios.post(
      `${API_BASE_URL}/orders`,
      orderData,
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  getAllOrders: async (status = null) => {
    const url = status 
      ? `${API_BASE_URL}/orders?status=${status}`
      : `${API_BASE_URL}/orders`;
    const response = await axios.get(url, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  getOrderById: async (orderId) => {
    const response = await axios.get(
      `${API_BASE_URL}/orders/${orderId}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  getOrderByNumber: async (orderNumber) => {
    const response = await axios.get(
      `${API_BASE_URL}/orders/number/${orderNumber}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  getUserOrders: async () => {
    const response = await axios.get(
      `${API_BASE_URL}/orders/my-orders`,
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await axios.patch(
      `${API_BASE_URL}/orders/${orderId}/status`,
      { status },
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  addOrderNotes: async (orderId, notes) => {
    const response = await axios.patch(
      `${API_BASE_URL}/orders/${orderId}/notes`,
      { notes },
      { headers: getAuthHeader() }
    );
    return response.data;
  }
};

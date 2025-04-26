import axios from 'axios';

const API_URL = 'http://localhost:8080';

// Configure axios with auth token
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const registerProduct = async (productData) => {
  try {
    const response = await api.post('/api/products', productData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to register product' };
  }
};

export const getProduct = async (productId) => {
  try {
    const response = await api.get(`/api/products/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to get product details' };
  }
};

export const initiateTransfer = async (productId, newOwnerUsername) => {
  try {
    const response = await api.post(`/api/products/${productId}/transfer`, {
      new_owner_username: newOwnerUsername,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to initiate transfer' };
  }
};

export const confirmTransfer = async (productId) => {
  try {
    const response = await api.post(`/api/products/${productId}/transfer/confirm`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to confirm transfer' };
  }
};

export const getProductQR = async (productId) => {
  try {
    const response = await api.get(`/api/products/${productId}/qr`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to generate QR code' };
  }
};

export const getPublicProductInfo = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/api/products/public/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to get public product info' };
  }
};

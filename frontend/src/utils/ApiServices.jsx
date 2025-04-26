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

export const createProductEvent = async (productId, eventData) => {
  try {
    const response = await api.post(`/api/products/${productId}/events`, eventData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to create event' };
  }
};

export const getPendingTransfers = async () => {
  try {
    const response = await api.get('/api/transfers/pending');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch pending transfers' };
  }
};

export const getUserProducts = async () => {
  try {
    const response = await api.get('/api/user/products');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch user products' };
  }
};

export const getContractPDF = async (contractId) => {
  try {
    // Using responseType blob to handle PDF data
    const response = await api.get(`/api/contracts/${contractId}/pdf`, {
      responseType: 'blob'
    });
    
    // Return blob data and create a local URL for the PDF
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    
    return { blob, url };
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch contract PDF' };
  }
};

export const getContractIPFSLink = async (contractId) => {
  try {
    const response = await api.get(`/api/contracts/${contractId}/ipfs`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch contract IPFS link' };
  }
};

export const regenerateContractPDF = async (contractId) => {
  try {
    const response = await api.post(`/api/contracts/${contractId}/regenerate`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to regenerate contract PDF' };
  }
};

export const getUserInfo = async () => {
  try {
    const response = await api.get('/api/user/info');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch user info' };
  }
};

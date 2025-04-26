import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaExclamationCircle, FaCheckCircle, FaExchangeAlt, FaFileContract } from 'react-icons/fa';
import Navbar from '../../components/ui/Navbar';
import { confirmTransfer } from '../../utils/ApiServices';
import { format } from 'date-fns';

const ConfirmTransfer = () => {
  const navigate = useNavigate();
  
  // States for transfer confirmation
  const [productId, setProductId] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [pendingTransferExists, setPendingTransferExists] = useState(false);
  
  // State for transfer search
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  
  // Check for pending transfers on page load
  useEffect(() => {
    // Verify user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { state: { from: '/confirm-transfer' } });
      return;
    }
    
    // Check URL for productId
    const params = new URLSearchParams(window.location.search);
    const urlProductId = params.get('productId');
    if (urlProductId) {
      setProductId(urlProductId);
      checkPendingTransfer(urlProductId);
    }
  }, [navigate]);
  
  // Check if a product has a pending transfer for the current user
  const checkPendingTransfer = async (id) => {
    if (!id?.trim()) {
      setSearchError('Please enter a product ID');
      return;
    }
    
    setIsSearching(true);
    setSearchError(null);
    setError(null);
    
    try {
      // We'll make a lightweight request to check if a transfer exists
      // This is a mock since the API doesn't have an explicit endpoint to check
      // In a real implementation, you might add an API endpoint for this check
      const response = await fetch(`http://localhost:8080/api/products/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to check product status');
      }
      
      // In a real implementation, the backend would indicate if there's a pending transfer
      // For now, we'll just assume there is one if we can access the product
      setPendingTransferExists(true);
      
    } catch (err) {
      setSearchError('Failed to find a pending transfer for this product');
      setPendingTransferExists(false);
    } finally {
      setIsSearching(false);
    }
  };
  
  // Handle transfer confirmation
  const handleConfirmTransfer = async (e) => {
    e.preventDefault();
    
    if (!productId?.trim()) {
      setError('Product ID is required');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      const response = await confirmTransfer(productId.trim());
      setSuccess({
        message: response.message,
        contract: response.contract
      });
      
      // Reset form
      setPendingTransferExists(false);
      
      // Auto-navigate after successful confirmation
      setTimeout(() => {
        navigate(`/products/${productId}`);
      }, 3000);
      
    } catch (err) {
      setError(err.error || 'Failed to confirm transfer');
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-20 pb-10">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="mr-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-3xl font-bold">Confirm Ownership Transfer</h1>
        </div>
        
        {success ? (
          <div className="p-8 bg-white/5 rounded-lg border border-white/10 max-w-lg mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <FaCheckCircle className="text-green-400 text-3xl" />
              </div>
              
              <h2 className="text-2xl font-bold mb-2">Transfer Confirmed!</h2>
              <p className="text-gray-300 mb-6">
                You are now the official owner of this product.
              </p>
              
              {success.contract && (
                <div className="w-full p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg mb-6">
                  <div className="flex items-center mb-2">
                    <FaFileContract className="text-blue-400 mr-2" />
                    <h3 className="font-medium">Ownership Contract Generated</h3>
                  </div>
                  <p className="text-sm text-gray-300">
                    Contract #{success.contract.contract_number}<br/>
                    Issued: {format(new Date(success.contract.issued_at), "MMMM d, yyyy")}
                  </p>
                </div>
              )}
              
              <p className="text-sm text-gray-400 mb-6">
                Redirecting to product details...
              </p>
              
              <button
                onClick={() => navigate(`/products/${productId}`)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                View Product Details
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-lg mx-auto">
            {/* Product ID Search Form */}
            <div className="p-6 bg-white/5 rounded-lg border border-white/10 mb-6">
              <h2 className="text-xl font-semibold mb-4">Enter Product ID</h2>
              <p className="text-gray-400 text-sm mb-4">
                Enter the ID of the product that has been transferred to you to confirm ownership.
              </p>
              
              <form onSubmit={(e) => { e.preventDefault(); checkPendingTransfer(productId); }} className="space-y-4">
                <div>
                  <label htmlFor="productId" className="block text-sm font-medium mb-2">
                    Product ID
                  </label>
                  <input
                    type="text"
                    id="productId"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    disabled={pendingTransferExists || isSearching}
                    placeholder="Enter the product ID"
                    className="w-full bg-white/10 border border-white/20 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {searchError && (
                    <p className="mt-1 text-sm text-red-400">{searchError}</p>
                  )}
                </div>
                
                {!pendingTransferExists && (
                  <button
                    type="submit"
                    disabled={isSearching || !productId.trim()}
                    className={`w-full py-3 px-4 rounded-lg flex justify-center items-center transition ${
                      isSearching || !productId.trim()
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                    }`}
                  >
                    {isSearching ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-t-transparent border-white mr-2"></div>
                        <span>Checking...</span>
                      </div>
                    ) : (
                      <span>Check for Pending Transfer</span>
                    )}
                  </button>
                )}
              </form>
            </div>
            
            {/* Transfer Confirmation */}
            {pendingTransferExists && (
              <div className="p-6 bg-white/5 rounded-lg border border-white/10">
                <h2 className="text-xl font-semibold mb-6">Confirm Ownership Transfer</h2>
                
                {error && (
                  <div className="p-4 mb-6 bg-red-900/30 border border-red-500/50 rounded-lg flex items-center gap-3">
                    <FaExclamationCircle className="text-red-400 text-xl flex-shrink-0" />
                    <p className="text-red-300">{error}</p>
                  </div>
                )}
                
                <div className="flex items-center p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg mb-6">
                  <div className="bg-blue-900/50 p-3 rounded-full mr-3">
                    <FaExchangeAlt className="text-blue-300" />
                  </div>
                  <div>
                    <p className="font-medium">Pending Transfer Found</p>
                    <p className="text-sm text-gray-400">
                      A product transfer is waiting for your confirmation.
                    </p>
                  </div>
                </div>
                
                <form onSubmit={handleConfirmTransfer}>
                  <p className="text-gray-300 mb-6">
                    By confirming this transfer, you will become the official owner of this product.
                    This action will be permanently recorded in the product's blockchain history.
                  </p>
                  
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full py-3 px-4 rounded-lg flex justify-center items-center transition ${
                      submitting
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700'
                    }`}
                  >
                    {submitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-t-transparent border-white mr-2"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <FaCheckCircle className="mr-2" />
                        <span>Confirm Ownership Transfer</span>
                      </div>
                    )}
                  </button>
                  
                  <p className="text-center text-xs text-gray-400 mt-4">
                    A digital ownership contract will be generated after confirmation.
                  </p>
                </form>
              </div>
            )}
            
            {/* Empty state - when no product ID entered */}
            {!pendingTransferExists && !isSearching && !searchError && (
              <div className="text-center p-6 bg-white/5 rounded-lg border border-white/10">
                <div className="w-16 h-16 bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaExchangeAlt className="text-blue-400 text-2xl" />
                </div>
                <h3 className="text-lg font-medium mb-2">Waiting for Product ID</h3>
                <p className="text-gray-400 text-sm">
                  Enter the product ID to check for pending transfers requiring your confirmation.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmTransfer;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaSearch } from 'react-icons/fa';
import Navbar from '../../components/ui/Navbar';
import { getProduct } from '../../utils/ApiServices';
import { format } from 'date-fns';

const ProductDetail = () => {
  const navigate = useNavigate();
  
  // Product ID input state
  const [productId, setProductId] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  
  // Product data state
  const [product, setProduct] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [productFound, setProductFound] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!productId.trim()) {
      setSearchError('Please enter a product ID');
      return;
    }

    // Check auth token
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { state: { from: '/product-search' } });
      return;
    }

    setLoading(true);
    setSearching(true);
    setSearchError('');
    setError(null);
    
    try {
      const response = await getProduct(productId.trim());
      setProduct(response.product);
      setHistory(response.history || []);
      setProductFound(true);
    } catch (err) {
      setError(err.error || 'Failed to load product details');
      setProductFound(false);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  // Format event data for display
  const formatEventData = (event) => {
    try {
      const data = JSON.parse(event.EventData);
      switch (event.EventType) {
        case 'registration':
          return 'Product registered by manufacturer';
        case 'ownership_transfer':
          return `Ownership transferred to ${data.new_owner_username || 'another user'}`;
        case 'repair':
          return `Repair: ${data.repair_details || 'No details available'}`;
        default:
          return 'Event recorded';
      }
    } catch (err) {
      return 'Event recorded';
    }
  };

  // Get event icon based on type
  const getEventIcon = (type) => {
    switch (type) {
      case 'registration':
        return <span className="bg-green-500 p-2 ml-0 rounded-full block"></span>;
      case 'ownership_transfer':
        return <span className="bg-blue-500 p-2 rounded-full block"></span>;
      case 'repair':
        return <span className="bg-yellow-500 p-2 rounded-full block"></span>;
      default:
        return <span className="bg-gray-500 p-2 rounded-full block"></span>;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-20 pb-10">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="mr-4 p-2 rounded-full bg-white/10 hover:bg-white/20"
          >
            <FaArrowLeft className="text-white" />
          </button>
          <h1 className="text-3xl font-bold">Product Search & Details</h1>
        </div>
        
        {/* Product ID Search Form */}
        <div className="p-6 bg-white/5 rounded-lg border border-white/10 mb-8">
          <h2 className="text-xl font-semibold mb-4">Search for a Product</h2>
          
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label htmlFor="productId" className="block text-sm font-medium mb-2">
                Product ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="productId"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  placeholder="Enter product ID"
                  className="w-full bg-white/10 border border-white/20 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {searchError && (
                <p className="mt-1 text-sm text-red-400">{searchError}</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={searching || !productId.trim()}
              className={`px-4 py-3 rounded-lg flex items-center justify-center ${
                searching || !productId.trim() 
                  ? 'bg-gray-700 text-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
              }`}
            >
              {searching ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-t-transparent border-current mr-2"></div>
                  <span>Searching...</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <FaSearch className="mr-2" />
                  <span>Search Product</span>
                </div>
              )}
            </button>
          </form>
        </div>
        
        {/* Product Details Section */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-900/30 border border-red-500 rounded-lg">
            <h2 className="text-xl font-medium text-red-400 mb-2">Error</h2>
            <p>{error}</p>
          </div>
        ) : product && productFound ? (
          <div className="space-y-8">
            {/* Product Info */}
            <div className="p-6 bg-white/5 rounded-lg border border-white/10">
              <div>
                <h2 className="text-2xl font-bold">{product?.ProductModel}</h2>
                <p className="text-gray-400 mt-1">{product?.Manufacturer}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-white/5 p-3 rounded border border-white/10">
                  <p className="text-sm text-gray-400">Serial Number</p>
                  <p className="font-mono font-medium">{product?.SerialNumber}</p>
                </div>
                <div className="bg-white/5 p-3 rounded border border-white/10">
                  <p className="text-sm text-gray-400">Registration Date</p>
                  <p className="font-medium">
                    {product?.CreatedAt && format(new Date(product.CreatedAt), "MMMM d, yyyy")}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Product History */}
            <div className="p-6 bg-white/5 rounded-lg border border-white/10">
              <h3 className="text-xl font-bold mb-6">Product History</h3>
              
              {history.length > 0 ? (
                <div className="relative pl-8 space-y-6">
                  {history.map((event, index) => (
                    <div key={event.ID} className="relative">
                      {index < history.length - 1 && (
                        <div className="absolute left-[8px] top-[20px] h-full w-[2px] bg-white/10"></div>
                      )}
                      
                      <div className="absolute left-0 top-1">
                        {getEventIcon(event.EventType)}
                      </div>
                      
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium capitalize">
                          {event.EventType.replace('_', ' ')}
                        </h4>
                        <span className="text-xs text-gray-400">
                          {format(new Date(event.CreatedAt), "MMM d, yyyy")}
                        </span>
                      </div>
                      
                      <p className="text-gray-300 mt-1 m-2">
                        {formatEventData(event)}
                      </p>
                      
                      {index === 0 && (
                        <div className="mt-1 text-xs text-green-400 flex items-center gap-1">
                          <FaCheckCircle /> Original registration verified
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No history available for this product.</p>
              )}
            </div>
            
            {/* Current Ownership */}
            <div className="p-6 bg-white/5 rounded-lg border border-white/10">
              <h3 className="text-xl font-bold mb-4">Current Ownership</h3>
              <div className="bg-white/5 p-4 rounded-lg">
                {history.some(event => event.EventType === 'ownership_transfer') ? (
                  <div>
                    <p className="text-sm text-gray-400">Current Owner</p>
                    <p className="text-lg font-medium">
                      {(() => {
                        // Find the most recent ownership transfer event
                        const transfers = history
                          .filter(e => e.EventType === 'ownership_transfer')
                          .sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));
                        
                        if (transfers.length > 0) {
                          try {
                            const data = JSON.parse(transfers[0].EventData);
                            return data.new_owner_username || 'Current Owner';
                          } catch {
                            return 'Current Owner';
                          }
                        }
                        return 'Original Manufacturer';
                      })()}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Since {(() => {
                        const transfers = history
                          .filter(e => e.EventType === 'ownership_transfer')
                          .sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));
                        
                        if (transfers.length > 0) {
                          return format(new Date(transfers[0].CreatedAt), "MMMM d, yyyy");
                        }
                        return '';
                      })()}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-400">Current Owner</p>
                    <p className="text-lg font-medium">Original Manufacturer</p>
                    <p className="text-sm text-gray-400 mt-2">No ownership transfers have occurred</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Product Specifications */}
            <div className="p-6 bg-white/5 rounded-lg border border-white/10">
              <h3 className="text-xl font-bold mb-4">Product Specifications</h3>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-gray-400">Model</span>
                  <span>{product?.ProductModel}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-gray-400">Manufacturer</span>
                  <span>{product?.Manufacturer}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-gray-400">Serial Number</span>
                  <span className="font-mono">{product?.SerialNumber}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-400">Registration Date</span>
                  <span>{product?.CreatedAt && format(new Date(product.CreatedAt), "MMM d, yyyy")}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          !loading && !searching && !productFound && (
            <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
              <FaSearch className="text-4xl opacity-50 mb-4" />
              <p className="text-xl">Enter a product ID and click Search to view product details</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ProductDetail;

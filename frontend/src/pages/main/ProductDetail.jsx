import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { getProduct } from '../../utils/ApiServices';
import { format } from 'date-fns';

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get product ID from URL params
  
  // Product data state
  const [product, setProduct] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch product data
    const fetchProductData = async () => {
      if (!id) {
        setError('No product ID provided');
        setLoading(false);
        return;
      }

      try {
        const response = await getProduct(id);
        setProduct(response.product);
        setHistory(response.history || []);
      } catch (err) {
        setError(err.error || 'Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]); 
  
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
      <div className="container mx-auto px-4 pt-20 pb-10">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="mr-4 p-2 rounded-full bg-white/10 hover:bg-white/20"
          >
            <FaArrowLeft className="text-white" />
          </button>
          <h1 className="text-3xl font-bold">Product Details</h1>
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
        ) : product ? (
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
          <div className="p-6 bg-white/5 rounded-lg border border-white/10 text-center">
            <p>No product found with the provided ID.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;

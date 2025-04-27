import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTools, FaExclamationCircle, FaCheckCircle, FaSearch } from 'react-icons/fa';
import { getProduct, createProductEvent } from '../../utils/ApiServices';
import { format } from 'date-fns';

const CreateProductEvent = () => {
  const navigate = useNavigate();

  // States for product search
  const [productId, setProductId] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  // States for product information
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [productFound, setProductFound] = useState(false);

  // States for form
  const [eventType, setEventType] = useState('repair');
  const [repairDetails, setRepairDetails] = useState('');
  const [partsUsed, setPartsUsed] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [success, setSuccess] = useState(false);

  // States for user info
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { state: { from: '/product-event' } });
      return;
    }
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      setUserRole(userData?.role);
    } catch (err) {
      console.error('Error parsing user data:', err);
    }
  }, [navigate]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!productId.trim()) {
      setSearchError('Please enter a product ID');
      return;
    }
    setLoading(true);
    setSearching(true);
    setSearchError('');
    setError(null);
    try {
      const response = await getProduct(productId.trim());
      setProduct(response.product);
      setProductFound(true);
    } catch (err) {
      setError(err.error || 'Failed to find product with the given ID');
      setProductFound(false);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eventType) {
      setFormError('Please select an event type');
      return;
    }
    if (eventType === 'repair' && !repairDetails.trim()) {
      setFormError('Please provide repair details');
      return;
    }
    if (eventType === 'repair' && userRole !== 'repair_shop') {
      setFormError('Only verified repair shops can log repair events');
      return;
    }
    setFormError(null);
    setSubmitting(true);
    try {
      let eventData = {};
      switch (eventType) {
        case 'repair':
          eventData = {
            repair_details: repairDetails,
            parts_used: partsUsed || 'None specified',
            timestamp: new Date().toISOString()
          };
          break;
        case 'inspection':
          eventData = {
            inspection_details: repairDetails,
            timestamp: new Date().toISOString()
          };
          break;
        case 'maintenance':
          eventData = {
            maintenance_details: repairDetails,
            timestamp: new Date().toISOString()
          };
          break;
        default:
          eventData = {
            details: repairDetails,
            timestamp: new Date().toISOString()
          };
      }
      const payload = {
        event_type: eventType,
        event_data: JSON.stringify(eventData)
      };
      await createProductEvent(productId, payload);
      setSuccess(true);
      setEventType('repair');
      setRepairDetails('');
      setPartsUsed('');
      setTimeout(() => {
        navigate(`/products/${productId}`);
      }, 2000);
    } catch (err) {
      setFormError(err.error || 'Failed to record event');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900/95 to-gray-800/90 text-gray-100 flex items-center justify-center relative">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900 to-gray-950"></div>
      <div className="fixed inset-0 -z-10 opacity-40">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute top-40 -left-20 w-60 h-60 bg-purple-600 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-40 right-20 w-60 h-60 bg-cyan-600 rounded-full filter blur-3xl opacity-20"></div>
      </div>

      <div className="w-full max-w-2xl flex items-center justify-center">
        <div className="overflow-hidden rounded-3xl border border-indigo-500/20 backdrop-blur-xl relative shadow-xl w-full bg-gradient-to-r from-blue-600/10 to-indigo-700/10">
          {/* Back Arrow */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute top-5 left-5 flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-blue-600/80 to-indigo-600/80 text-white hover:from-blue-700 hover:to-indigo-700 shadow transition-all duration-200 z-10"
          >
            <FaArrowLeft className="text-lg" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="relative p-10 pt-16">
            <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-lg">
              Record Product Event
            </h1>
            {/* Product ID Search Form */}
            <div className="mb-8">
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
                      className="w-full bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-blue-700/30 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 shadow-lg"
                      disabled={productFound && !error}
                    />
                  </div>
                  {searchError && (
                    <p className="mt-1 text-sm text-red-400">{searchError}</p>
                  )}
                </div>
                {!productFound && (
                  <button
                    type="submit"
                    disabled={searching || !productId.trim()}
                    className={`px-4 py-3 rounded-2xl flex items-center justify-center w-full ${
                      searching || !productId.trim()
                        ? 'bg-gray-700 text-gray-300 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
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
                        <span>Find Product</span>
                      </div>
                    )}
                  </button>
                )}
                {productFound && (
                  <button
                    type="button"
                    onClick={() => {
                      setProductFound(false);
                      setProduct(null);
                      setError(null);
                    }}
                    className="text-blue-400 hover:text-blue-300 transition text-sm"
                  >
                    Search for a different product
                  </button>
                )}
              </form>
            </div>
            {/* Loading & Error States */}
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="p-6 bg-red-900/30 border border-red-500 rounded-lg flex items-center gap-3 mb-8">
                <FaExclamationCircle className="text-red-400 text-xl" />
                <div>
                  <h2 className="text-xl font-medium text-red-400 mb-2">Error</h2>
                  <p>{error}</p>
                </div>
              </div>
            ) : null}
            {/* Product Information and Event Form */}
            {productFound && product && !loading && !error && (
              <div className="space-y-8">
                {/* Product Information */}
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10 mb-4">
                  <h2 className="text-xl font-semibold mb-4">Product Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Model</p>
                      <p className="font-semibold text-lg">{product?.ProductModel}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Manufacturer</p>
                      <p className="font-semibold">{product?.Manufacturer}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Serial Number</p>
                      <p className="font-mono">{product?.SerialNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Registration Date</p>
                      <p>{product?.CreatedAt && format(new Date(product.CreatedAt), "MMMM d, yyyy")}</p>
                    </div>
                  </div>
                </div>
                {/* Create Event Form */}
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                  <h2 className="text-xl font-semibold mb-6">Record New Event</h2>
                  {success ? (
                    <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg text-center">
                      <FaCheckCircle className="text-green-400 text-4xl mx-auto mb-2" />
                      <h3 className="text-lg font-medium text-green-400 mb-2">Event Recorded Successfully!</h3>
                      <p className="text-gray-300 mb-4">The event has been added to the product's history.</p>
                      <p className="text-sm text-gray-400">Redirecting to product details...</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {formError && (
                        <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center gap-3">
                          <FaExclamationCircle className="text-red-400 text-xl flex-shrink-0" />
                          <p className="text-red-300">{formError}</p>
                        </div>
                      )}
                      {/* Event Type Selection */}
                      <div>
                        <label htmlFor="eventType" className="block text-sm font-medium mb-2">
                          Event Type <span className="text-red-400">*</span>
                        </label>
                        <select
                          id="eventType"
                          value={eventType}
                          onChange={(e) => setEventType(e.target.value)}
                          className="w-full bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-blue-700/30 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                        >
                          <option value="repair" disabled={userRole !== 'repair_shop'}>Repair</option>
                          <option value="inspection">Inspection</option>
                          <option value="maintenance">Maintenance</option>
                          <option value="software_update">Software Update</option>
                          <option value="custom">Custom Event</option>
                        </select>
                        {userRole !== 'repair_shop' && eventType === 'repair' && (
                          <p className="mt-1 text-yellow-500 text-sm">
                            Note: Only verified repair shops can record repair events.
                          </p>
                        )}
                      </div>
                      {/* Event Details */}
                      <div>
                        <label htmlFor="repairDetails" className="block text-sm font-medium mb-2">
                          {eventType === 'repair' ? 'Repair Details' :
                            eventType === 'inspection' ? 'Inspection Details' :
                              eventType === 'maintenance' ? 'Maintenance Details' :
                                'Event Details'} <span className="text-red-400">*</span>
                        </label>
                        <textarea
                          id="repairDetails"
                          value={repairDetails}
                          onChange={(e) => setRepairDetails(e.target.value)}
                          rows={4}
                          className="w-full bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-blue-700/30 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 shadow-lg"
                          placeholder={eventType === 'repair' ? 'Describe repairs performed, issues fixed, etc.' :
                            eventType === 'inspection' ? 'Document inspection findings...' :
                              eventType === 'maintenance' ? 'Describe maintenance performed...' :
                                'Provide event details...'}
                          required
                        />
                      </div>
                      {/* Parts Used (Only for repair events) */}
                      {eventType === 'repair' && (
                        <div>
                          <label htmlFor="partsUsed" className="block text-sm font-medium mb-2">
                            Parts Used (Optional)
                          </label>
                          <input
                            type="text"
                            id="partsUsed"
                            value={partsUsed}
                            onChange={(e) => setPartsUsed(e.target.value)}
                            className="w-full bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-blue-700/30 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 shadow-lg"
                            placeholder="List parts used for repair (if any)"
                          />
                        </div>
                      )}
                      {/* Submit Button */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={submitting || (eventType === 'repair' && userRole !== 'repair_shop')}
                          className={`w-full py-3 px-4 rounded-2xl flex justify-center items-center transition ${
                            submitting || (eventType === 'repair' && userRole !== 'repair_shop')
                              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                          }`}
                        >
                          {submitting ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-5 w-5 border-2 border-t-transparent border-white mr-2"></div>
                              <span>Recording Event...</span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <FaTools className="mr-2" />
                              <span>Record Event</span>
                            </div>
                          )}
                        </button>
                      </div>
                      {/* Information Notice */}
                      <div className="text-center text-xs text-gray-400 mt-4">
                        <p>
                          Note: Events recorded become a permanent part of this product's blockchain history and cannot be modified or deleted.
                          This information will be visible to current and future owners of the product.
                        </p>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}
            {/* Empty State - No Product Selected */}
            {!loading && !error && !productFound && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="bg-white/5 p-8 rounded-2xl border border-white/10 max-w-md">
                  <FaSearch className="text-4xl text-gray-400 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold mb-2">Find a Product First</h2>
                  <p className="text-gray-400 mb-6">
                    Enter a valid product ID to find the product you want to add an event to.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Animations */}
      <style>
        {`
          .animate-fade-in { animation: fadeIn 0.7s; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(30px);} to { opacity: 1; transform: none; } }
          .animate-shake { animation: shake 0.4s; }
          @keyframes shake {
            10%, 90% { transform: translateX(-2px); }
            20%, 80% { transform: translateX(4px); }
            30%, 50%, 70% { transform: translateX(-8px); }
            40%, 60% { transform: translateX(8px); }
          }
        `}
      </style>
    </div>
  );
};

export default CreateProductEvent;

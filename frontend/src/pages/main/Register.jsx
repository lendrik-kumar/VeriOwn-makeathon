import React, { useState } from 'react';
import { registerProduct } from '../../utils/ApiServices';
import { FaTag, FaIndustry, FaMobileAlt, FaCheckCircle } from 'react-icons/fa';

const ProductForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    serial_number: '',
    manufacturer: '',
    model: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await registerProduct(formData);
      setLoading(false);
      setSuccess('Product registered successfully!');
      setFormData({
        serial_number: '',
        manufacturer: '',
        model: '',
      });
      if (onSuccess) onSuccess(response);
    } catch (err) {
      setError(err.error || 'An error occurred during product registration');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center relative">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-gray-900 to-gray-950"></div>
      <div className="fixed inset-0 -z-10 opacity-50">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute top-40 -left-20 w-60 h-60 bg-purple-600 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-40 right-20 w-60 h-60 bg-cyan-600 rounded-full filter blur-3xl opacity-20"></div>
      </div>

      <div className="w-full max-w-lg flex items-center justify-center">
        <div className="overflow-hidden rounded-2xl border border-gray-700/50 backdrop-blur-xl relative shadow-xl w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
          <div className="relative p-10">
            <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">
              Register New Product
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 border border-red-400 bg-red-100/80 text-red-700 rounded-md animate-shake">
                  {error}
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 p-4 border border-green-400 bg-green-100/80 text-green-700 rounded-md animate-fade-in">
                  <FaCheckCircle className="text-green-500" /> {success}
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label htmlFor="serial_number" className="block text-sm font-medium mb-1">
                    Serial Number
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaTag className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="serial_number"
                      name="serial_number"
                      value={formData.serial_number}
                      onChange={handleChange}
                      className="block w-full pl-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-black/40 text-white placeholder-gray-300 transition-all duration-200"
                      placeholder="Enter product serial number"
                      required
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="manufacturer" className="block text-sm font-medium mb-1">
                    Manufacturer
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaIndustry className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="manufacturer"
                      name="manufacturer"
                      value={formData.manufacturer}
                      onChange={handleChange}
                      className="block w-full pl-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-black/40 text-white placeholder-gray-300 transition-all duration-200"
                      placeholder="Enter manufacturer name"
                      required
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="model" className="block text-sm font-medium mb-1">
                    Model
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMobileAlt className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="model"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      className="block w-full pl-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-black/40 text-white placeholder-gray-300 transition-all duration-200"
                      placeholder="Enter product model"
                      required
                      autoComplete="off"
                    />
                  </div>
                </div>
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-lg flex justify-center items-center font-semibold transition-all duration-200 shadow-lg ${
                    loading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600'
                  }`}
                >
                  {loading ? (
                    <span className="animate-pulse">Registering...</span>
                  ) : (
                    'Register Product'
                  )}
                </button>
              </div>
            </form>
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

export default ProductForm;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTag, FaIndustry, FaMobileAlt, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import { registerProduct } from '../../utils/ApiServices';

const ProductForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    serial_number: '',
    manufacturer: '',
    model: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gradient-to-r from-gray-900/95 to-gray-800/90 text-gray-100 flex items-center justify-center relative">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900 to-gray-950"></div>
      <div className="fixed inset-0 -z-10 opacity-40">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute top-40 -left-20 w-60 h-60 bg-purple-600 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-40 right-20 w-60 h-60 bg-cyan-600 rounded-full filter blur-3xl opacity-20"></div>
      </div>

      <div className="w-full max-w-lg flex items-center justify-center">
        <div className="overflow-hidden rounded-3xl border border-indigo-500/20 backdrop-blur-xl relative shadow-xl w-full bg-gradient-to-r from-blue-600/10 to-indigo-700/10">
          {/* Back Arrow */}
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="absolute top-5 left-5 flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-blue-600/80 to-indigo-600/80 text-white hover:from-blue-700 hover:to-indigo-700 shadow transition-all duration-200 z-10"
          >
            <FaArrowLeft className="text-lg" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="relative p-10 pt-16">
            <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-lg">
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
              <div className="space-y-5">
                {/* Serial Number */}
                <div>
                  <label htmlFor="serial_number" className="block text-sm font-medium mb-1">
                    Serial Number
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                      <FaTag className="text-blue-400" />
                    </span>
                    <input
                      type="text"
                      id="serial_number"
                      name="serial_number"
                      value={formData.serial_number}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-4 py-3 rounded-2xl bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-blue-700/30 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white placeholder-gray-400 shadow-lg transition-all duration-200 outline-none"
                      placeholder="Enter product serial number"
                      required
                      autoComplete="off"
                    />
                  </div>
                </div>
                {/* Manufacturer */}
                <div>
                  <label htmlFor="manufacturer" className="block text-sm font-medium mb-1">
                    Manufacturer
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                      <FaIndustry className="text-purple-400" />
                    </span>
                    <input
                      type="text"
                      id="manufacturer"
                      name="manufacturer"
                      value={formData.manufacturer}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-4 py-3 rounded-2xl bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-purple-700/30 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-white placeholder-gray-400 shadow-lg transition-all duration-200 outline-none"
                      placeholder="Enter manufacturer name"
                      required
                      autoComplete="off"
                    />
                  </div>
                </div>
                {/* Model */}
                <div>
                  <label htmlFor="model" className="block text-sm font-medium mb-1">
                    Model
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                      <FaMobileAlt className="text-cyan-400" />
                    </span>
                    <input
                      type="text"
                      id="model"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-4 py-3 rounded-2xl bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-cyan-700/30 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-white placeholder-gray-400 shadow-lg transition-all duration-200 outline-none"
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
                  className={`w-full py-3 px-4 rounded-2xl flex justify-center items-center font-semibold transition-all duration-200 shadow-lg ${
                    loading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
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

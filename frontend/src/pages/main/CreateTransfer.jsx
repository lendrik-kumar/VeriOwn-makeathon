import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initiateTransfer } from '../../utils/ApiServices';
import { FaArrowRight, FaUser, FaHashtag, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';

const TransferInitiate = () => {
  const [productId, setProductId] = useState('');
  const [username, setUsername] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleTransfer = async () => {
    setMsg('');
    setLoading(true);
    try {
      const res = await initiateTransfer(productId, username);
      setMsg(res.message || 'Transfer initiated!');
    } catch (err) {
      setMsg(err.error || 'Error initiating transfer');
    }
    setLoading(false);
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
              Initiate Ownership Transfer
            </h2>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleTransfer();
              }}
              className="space-y-6"
            >
              {msg && (
                <div className={`flex items-center gap-2 p-4 border rounded-md animate-fade-in ${
                  msg.toLowerCase().includes('error')
                    ? 'border-red-400 bg-red-100/80 text-red-700'
                    : 'border-green-400 bg-green-100/80 text-green-700'
                }`}>
                  {!msg.toLowerCase().includes('error') && <FaCheckCircle className="text-green-500" />}
                  {msg}
                </div>
              )}
              <div className="space-y-5">
                {/* Product ID */}
                <div>
                  <label htmlFor="product_id" className="block text-sm font-medium mb-1">
                    Product ID
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                      <FaHashtag className="text-blue-400" />
                    </span>
                    <input
                      type="text"
                      id="product_id"
                      name="product_id"
                      value={productId}
                      onChange={e => setProductId(e.target.value)}
                      className="block w-full pl-12 pr-4 py-3 rounded-2xl bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-blue-700/30 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white placeholder-gray-400 shadow-lg transition-all duration-200 outline-none"
                      placeholder="Enter Product ID"
                      required
                      autoComplete="off"
                    />
                  </div>
                </div>
                {/* New Owner Username */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium mb-1">
                    New Owner Username
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                      <FaUser className="text-purple-400" />
                    </span>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className="block w-full pl-12 pr-4 py-3 rounded-2xl bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-purple-700/30 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-white placeholder-gray-400 shadow-lg transition-all duration-200 outline-none"
                      placeholder="Enter new owner's username"
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
                    <span className="animate-pulse">Processing...</span>
                  ) : (
                    <>Initiate Transfer <FaArrowRight className="ml-2" /></>
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
        `}
      </style>
    </div>
  );
};

export default TransferInitiate;

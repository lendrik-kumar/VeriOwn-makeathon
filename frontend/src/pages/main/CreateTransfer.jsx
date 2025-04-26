import React, { useState } from 'react';
import { initiateTransfer } from '../../utils/ApiServices';
import { FaArrowRight, FaUser, FaHashtag } from 'react-icons/fa';

const TransferInitiate = () => {
  const [productId, setProductId] = useState('');
  const [username, setUsername] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

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
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl flex flex-col gap-6 w-full max-w-lg border border-white/20 mt-24">
        <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Initiate Ownership Transfer
        </h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            handleTransfer();
          }}
          className="flex flex-col gap-4"
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaHashtag className="text-gray-400" />
            </div>
            <input
              className="block w-full pl-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-black/40 text-white placeholder-gray-300 transition-all duration-200"
              placeholder="Product ID"
              value={productId}
              onChange={e => setProductId(e.target.value)}
              autoComplete="off"
              required
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="text-gray-400" />
            </div>
            <input
              className="block w-full pl-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-black/40 text-white placeholder-gray-300 transition-all duration-200"
              placeholder="New Owner Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="off"
              required
            />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-black font-bold px-8 py-3 rounded-full shadow-lg transition-all duration-200"
            disabled={loading}
          >
            {loading ? 'Processing...' : <>Initiate Transfer <FaArrowRight /></>}
          </button>
          {msg && (
            <div className={`text-center mt-2 text-sm ${msg.toLowerCase().includes('error') ? 'text-red-400' : 'text-green-400'}`}>
              {msg}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default TransferInitiate;

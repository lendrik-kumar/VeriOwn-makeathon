import React, { useState } from 'react';
import { initiateTransfer } from '../../utils/ApiServices';

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
    <div className="bg-white/10 p-6 rounded-xl shadow flex flex-col gap-4 max-w-md mx-auto mt-12">
      <h2 className="text-xl font-bold mb-2">Initiate Ownership Transfer</h2>
      <input
        className="px-4 py-2 rounded-full border border-white/20 bg-black/30 text-white"
        placeholder="Product ID"
        value={productId}
        onChange={e => setProductId(e.target.value)}
      />
      <input
        className="px-4 py-2 rounded-full border border-white/20 bg-black/30 text-white"
        placeholder="New Owner Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <button
        className="bg-gradient-to-r from-green-400 to-blue-500 text-black font-bold px-6 py-2 rounded-full shadow hover:from-green-500 hover:to-blue-600 transition"
        onClick={handleTransfer}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Initiate Transfer'}
      </button>
      {msg && <div className="text-sm mt-2">{msg}</div>}
    </div>
  );
};

export default TransferInitiate;
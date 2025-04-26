import React, { useState, useEffect } from 'react';
import { getUserProducts } from '../../utils/ApiServices';
import { Link } from 'react-router-dom';
import { FaFileContract, FaSyncAlt, FaBoxOpen } from 'react-icons/fa';

const UserProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserProducts();
    // eslint-disable-next-line
  }, []);

  const fetchUserProducts = async () => {
    try {
      setLoading(true);
      const response = await getUserProducts();
      setProducts(response.products || []);
      setError(null);
    } catch (err) {
      setError(err.error || 'Failed to load your products');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <div className="w-full max-w-5xl mt-24">
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">
          My Products
        </h1>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center p-4 mb-6 bg-red-100/80 border border-red-400 text-red-700 rounded-md animate-shake">
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white/10 p-8 rounded-xl text-center shadow-lg">
            <FaBoxOpen className="mx-auto text-4xl mb-2 text-blue-400" />
            <p className="text-gray-200 mb-2">You don't have any registered products yet.</p>
            <Link
              to="/register-product"
              className="inline-block mt-2 px-6 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-black font-bold rounded-full shadow hover:from-green-500 hover:to-blue-600 transition"
            >
              Register a product
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 flex flex-col gap-3 animate-fade-in"
              >
                <h2 className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                  {product.model}
                </h2>
                <p className="text-sm text-gray-300">Manufacturer: {product.manufacturer}</p>
                <p className="text-sm text-gray-300">Serial Number: {product.serial_number}</p>
                <p className="text-sm text-gray-400">
                  Added: {new Date(product.created_at).toLocaleDateString()}
                </p>
                {product.contract && (
                  <div className="mt-2 p-3 rounded-lg bg-black/30 border border-blue-400/30">
                    <div className="flex items-center gap-2 text-blue-300 font-semibold">
                      <FaFileContract /> Contract #: {product.contract.contract_number}
                    </div>
                    {product.contract.ipfs_url && (
                      <a
                        href={product.contract.ipfs_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-1 text-blue-400 underline text-xs hover:text-blue-300"
                      >
                        View Ownership Certificate (IPFS)
                      </a>
                    )}
                  </div>
                )}
                <div className="mt-4 flex gap-2">
                  <Link
                    to={`/products/${product.id}`}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-black font-bold rounded-full shadow hover:from-green-500 hover:to-blue-600 transition text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-10 flex justify-center">
          <button
            onClick={fetchUserProducts}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-green-400 text-black font-bold rounded-full shadow hover:from-blue-600 hover:to-green-500 transition"
          >
            <FaSyncAlt className="animate-spin-slow" /> Refresh List
          </button>
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
          .animate-spin-slow { animation: spin 2s linear infinite; }
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}
      </style>
    </div>
  );
};

export default UserProducts;

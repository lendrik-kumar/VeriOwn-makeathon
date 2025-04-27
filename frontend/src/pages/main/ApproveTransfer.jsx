import React, { useState, useEffect } from 'react';
import { getPendingTransfers, confirmTransfer } from '../../utils/ApiServices'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaSyncAlt } from 'react-icons/fa';

const ApproveTransfer = () => {
  const [pendingTransfers, setPendingTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingIds, setProcessingIds] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingTransfers();
    // eslint-disable-next-line
  }, []);

  const fetchPendingTransfers = async () => {
    try {
      setLoading(true);
      const response = await getPendingTransfers();
      setPendingTransfers(response.pending_transfers || []);
      setError(null);
    } catch (err) {
      setError(err.error || 'Failed to load pending transfers');
      toast.error(err.error || 'Failed to load pending transfers');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmTransfer = async (productId) => {
    try {
      setProcessingIds(prev => new Set(prev).add(productId));
      await confirmTransfer(productId);
      toast.success('Transfer confirmed successfully');
      setPendingTransfers(prev =>
        prev.filter(transfer => transfer.ProductID.toString() !== productId.toString())
      );
    } catch (err) {
      toast.error(err.error || 'Failed to confirm transfer');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
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

      <div className="w-full max-w-4xl flex flex-col items-center justify-center">
        {/* Back Arrow */}
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="absolute top-5 left-5 flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 shadow transition-all duration-200 z-10"
        >
          <FaArrowLeft className="text-lg" />
          <span className="text-sm font-medium">Back</span>
        </button>
        <div className="mt-16 w-full">
          <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-lg">
            Pending Transfers
          </h1>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center p-4 mb-6 bg-red-100/80 border border-red-400 text-red-700 rounded-md animate-shake">
              {error}
            </div>
          ) : pendingTransfers.length === 0 ? (
            <div className="bg-white/10 p-8 rounded-xl text-center shadow-lg">
              <p className="text-gray-200 mb-2">No pending transfers found</p>
              <Link
                to="/dashboard"
                className="inline-block mt-2 px-6 py-2 bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white font-semibold rounded-lg shadow hover:from-blue-700 hover:to-indigo-700 transition"
              >
                Return to Dashboard
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white/10 border border-white/20 rounded-xl overflow-hidden shadow-xl">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600/10 to-indigo-700/10 text-gray-200">
                    <th className="py-3 px-4 text-left">Product</th>
                    <th className="py-3 px-4 text-left">Manufacturer</th>
                    <th className="py-3 px-4 text-left">Serial Number</th>
                    <th className="py-3 px-4 text-left">Current Owner</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingTransfers.map((transfer) => (
                    <tr key={transfer.ID} className="border-t border-white/10">
                      <td className="py-4 px-4">{transfer.ProductModel}</td>
                      <td className="py-4 px-4">{transfer.Manufacturer}</td>
                      <td className="py-4 px-4">{transfer.SerialNumber}</td>
                      <td className="py-4 px-4">{transfer.CurrentOwnerUsername}</td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleConfirmTransfer(transfer.ProductID)}
                          disabled={processingIds.has(transfer.ProductID)}
                          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow ${
                            processingIds.has(transfer.ProductID)
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white hover:from-blue-700 hover:to-indigo-700'
                          }`}
                        >
                          {processingIds.has(transfer.ProductID) ? 'Processing...' : 'Confirm Transfer'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-10 flex justify-center">
            <button
              onClick={fetchPendingTransfers}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white font-semibold rounded-lg shadow hover:from-blue-700 hover:to-indigo-700 transition"
            >
              <FaSyncAlt className="animate-spin-slow" /> Refresh
            </button>
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
          .animate-spin-slow { animation: spin 2s linear infinite; }
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}
      </style>
    </div>
  );
};

export default ApproveTransfer;

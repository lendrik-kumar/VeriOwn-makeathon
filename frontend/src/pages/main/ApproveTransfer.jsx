import React, { useState, useEffect } from 'react';
import { getPendingTransfers, confirmTransfer } from '../../utils/ApiServices'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ApproveTransfer = () => {
  const [pendingTransfers, setPendingTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingIds, setProcessingIds] = useState(new Set());

  useEffect(() => {
    fetchPendingTransfers();
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
      
      // Remove the confirmed transfer from the list
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Pending Transfers</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {pendingTransfers.length === 0 ? (
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <p className="text-gray-600">No pending transfers found</p>
          <Link to="/dashboard" className="text-blue-500 hover:underline mt-2 inline-block">
            Return to Dashboard
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 text-left">Product</th>
                <th className="py-3 px-4 text-left">Manufacturer</th>
                <th className="py-3 px-4 text-left">Serial Number</th>
                <th className="py-3 px-4 text-left">Current Owner</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingTransfers.map((transfer) => (
                <tr key={transfer.ID} className="border-t border-gray-200">
                  <td className="py-4 px-4">{transfer.ProductModel}</td>
                  <td className="py-4 px-4">{transfer.Manufacturer}</td>
                  <td className="py-4 px-4">{transfer.SerialNumber}</td>
                  <td className="py-4 px-4">{transfer.CurrentOwnerUsername}</td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleConfirmTransfer(transfer.ProductID)}
                      disabled={processingIds.has(transfer.ProductID)}
                      className={`px-4 py-2 rounded ${
                        processingIds.has(transfer.ProductID)
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-green-500 hover:bg-green-600 text-white'
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

      <div className="mt-6 flex justify-center">
        <button
          onClick={fetchPendingTransfers}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default ApproveTransfer;

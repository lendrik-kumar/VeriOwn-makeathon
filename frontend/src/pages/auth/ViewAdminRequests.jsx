import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ViewAdminRequests() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchPendingRequests();
  }, [navigate]);

  const fetchPendingRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/verifications/pending', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPendingRequests(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching pending requests:", err);
      setError(err.response?.data?.error || 'Failed to fetch pending requests. You might not have admin privileges.');
      setLoading(false);
    }
  };

  const handleVerification = async (userId, status) => {
    try {
      setProcessingId(userId);
      const token = localStorage.getItem('token');
      await axios.post(`/api/admin/verify-user/${userId}`, 
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      // Remove the processed request from the list
      setPendingRequests(pendingRequests.filter(request => request.ID !== userId));
      setProcessingId(null);
    } catch (err) {
      console.error("Error processing verification:", err);
      setError(err.response?.data?.error || 'Failed to process verification');
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#18181b] via-[#232136] to-[#0f0f13]">
        <div className="bg-[#18181b] p-8 rounded-xl shadow-2xl border border-[#393552] flex items-center">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mr-4"></div>
          <p className="text-white text-xl">Loading pending verifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#18181b] via-[#232136] to-[#0f0f13]">
        <div className="bg-[#18181b] p-8 rounded-xl shadow-2xl border border-red-500 max-w-lg">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-white mb-6">{error}</p>
          <div className="flex justify-between">
            <button 
              onClick={() => navigate('/login')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Back to Login
            </button>
            <button 
              onClick={() => fetchPendingRequests()}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18181b] via-[#232136] to-[#0f0f13] text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-white">Admin Dashboard</h1>
        <p className="text-gray-400 mb-8">Manage pending verification requests</p>

        {pendingRequests.length === 0 ? (
          <div className="bg-[#232136] rounded-xl p-8 text-center border border-[#393552]">
            <div className="bg-green-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-gray-200">All caught up!</h2>
            <p className="text-gray-400">There are no pending verification requests at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {pendingRequests.map((request) => (
              <div key={request.ID} className="bg-[#232136] rounded-xl overflow-hidden border border-[#393552]">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full mb-3 bg-yellow-500/20 text-yellow-300">
                        {request.role === "brand" ? "Brand" : "Repair Shop"}
                      </span>
                      <h2 className="text-2xl font-bold mb-1 text-white">{request.username}</h2>
                      <p className="text-gray-300 font-medium">{request.CompanyName}</p>
                    </div>
                    <span className="inline-block px-3 py-1 text-xs rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                      Pending Verification
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="space-y-4">
                      {request.role === "brand" ? (
                        <>
                          <div>
                            <p className="text-sm text-gray-500">Company Name</p>
                            <p className="font-medium text-gray-200">{request.CompanyName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Tax ID</p>
                            <p className="font-medium text-gray-200">{request.TaxID}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Official Domain</p>
                            <p className="font-medium text-gray-200">{request.OfficialDomain}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <p className="text-sm text-gray-500">Business Name</p>
                            <p className="font-medium text-gray-200">{request.CompanyName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Business License</p>
                            <p className="font-medium text-gray-200">{request.BusinessLicense}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Address</p>
                            <p className="font-medium text-gray-200">{request.LocationAddress}</p>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Contact Email</p>
                        <p className="font-medium text-gray-200">{request.ContactEmail}</p>
                      </div>
                      {request.role === "repair_shop" && (
                        <div>
                          <p className="text-sm text-gray-500">Certification</p>
                          <a 
                            href={request.CertificationProof} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-indigo-400 hover:text-indigo-300 hover:underline font-medium flex items-center"
                          >
                            View Certification Proof
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                            </svg>
                          </a>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-500">Registration Date</p>
                        <p className="font-medium text-gray-200">
                          {new Date(request.CreatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="p-5 bg-[#18181b] flex justify-end gap-3">
                  <button
                    onClick={() => handleVerification(request.ID, "rejected")}
                    disabled={processingId === request.ID}
                    className={`px-5 py-2 rounded-lg border border-red-500 text-red-400 hover:bg-red-500/20 font-medium ${
                      processingId === request.ID ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleVerification(request.ID, "verified")}
                    disabled={processingId === request.ID}
                    className={`px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium 
                      hover:shadow-lg hover:shadow-emerald-500/25 ${
                        processingId === request.ID ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                  >
                    {processingId === request.ID ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : "Approve"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewAdminRequests;

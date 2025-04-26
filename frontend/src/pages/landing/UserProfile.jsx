import React, { useEffect, useState } from 'react';
import { getUserInfo } from '../../utils/ApiServices';
import { FaUser, FaEnvelope, FaIdCard, FaBriefcase, FaCalendarAlt, FaShieldAlt } from 'react-icons/fa';

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const data = await getUserInfo();
        setUserInfo(data);
      } catch (err) {
        console.error('Failed to fetch user info:', err);
        setError('Failed to load user information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="h-16 w-16 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-8 rounded-lg text-center max-w-2xl mx-auto my-8">
        <h3 className="text-lg font-medium mb-2">Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <h1 className="text-3xl font-bold text-gray-100 mb-8 border-b border-gray-700 pb-4 flex items-center">
        <span className="p-3 rounded-full bg-blue-600/20 text-blue-400 mr-3"><FaUser /></span>
        User Profile
      </h1>

      {userInfo && (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 shadow-lg">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* User Avatar */}
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold uppercase">
                {userInfo.username ? userInfo.username[0] : '?'}
              </div>
              <h2 className="mt-4 text-2xl font-bold text-gray-100">{userInfo.username}</h2>
              <div className="mt-1 text-gray-400 text-sm">{userInfo.role || 'Regular User'}</div>
              {userInfo.verified && (
                <div className="mt-4 bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-xs font-medium border border-green-700/30 flex items-center">
                  <FaShieldAlt className="mr-1" /> Verified User
                </div>
              )}
            </div>
            
            {/* User Details */}
            <div className="w-full md:w-2/3">
              <h3 className="text-xl font-semibold text-gray-200 mb-4 pb-2 border-b border-gray-700">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-start mb-4">
                    <span className="p-2 rounded-md bg-purple-600/20 text-purple-400 mr-3">
                      <FaIdCard />
                    </span>
                    <div>
                      <div className="text-sm text-gray-400">User ID</div>
                      <div className="text-gray-200">{userInfo.id || 'N/A'}</div>
                    </div>
                  </div>

                  <div className="flex items-start mb-4">
                    <span className="p-2 rounded-md bg-blue-600/20 text-blue-400 mr-3">
                      <FaUser />
                    </span>
                    <div>
                      <div className="text-sm text-gray-400">Username</div>
                      <div className="text-gray-200">{userInfo.username || 'N/A'}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-start mb-4">
                    <span className="p-2 rounded-md bg-amber-600/20 text-amber-400 mr-3">
                      <FaBriefcase />
                    </span>
                    <div>
                      <div className="text-sm text-gray-400">Role</div>
                      <div className="text-gray-200">{userInfo.role || 'Regular User'}</div>
                    </div>
                  </div>

                  <div className="flex items-start mb-4">
                    <span className="p-2 rounded-md bg-emerald-600/20 text-emerald-400 mr-3">
                      <FaEnvelope />
                    </span>
                    <div>
                      <div className="text-sm text-gray-400">Email</div>
                      <div className="text-gray-200">{userInfo.email || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              {userInfo.created_at && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-gray-200 mb-4 pb-2 border-b border-gray-700">Account Information</h3>
                  <div className="flex items-start">
                    <span className="p-2 rounded-md bg-cyan-600/20 text-cyan-400 mr-3">
                      <FaCalendarAlt />
                    </span>
                    <div>
                      <div className="text-sm text-gray-400">Account Created</div>
                      <div className="text-gray-200">
                        {new Date(userInfo.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;

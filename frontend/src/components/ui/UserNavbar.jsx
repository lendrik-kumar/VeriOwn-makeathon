import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaExchangeAlt, FaBell, FaSignOutAlt, FaPlus, FaUser } from 'react-icons/fa';
import { getUserInfo, getPendingTransfers } from '../../utils/ApiServices';

const UserInfo = () => {
  const [user, setUser] = useState({ username: 'User' });
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    getUserInfo()
      .then((data) => {
        if (mounted && data.username) setUser(data);
      })
      .catch(() => {
        // fallback to localStorage or default
        const username = localStorage.getItem('username') || 'User';
        if (mounted) setUser({ username });
      });
    return () => { mounted = false; };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center gap-3 ml-6 bg-gray-800/70 px-4 py-2 rounded-full cursor-pointer hover:bg-gray-700/70 transition-all duration-300 border border-gray-700/50 backdrop-blur-sm"
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white text-lg uppercase shadow-md shadow-blue-500/20">
          {user.username[0]}
        </div>
        <span className="text-white font-medium pr-2">{user.username}</span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-xl bg-gray-800 border border-gray-700 overflow-hidden z-50 animate-fade-in-down">
          <div className="py-2">
            <Link to="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center">
              <FaUser className="mr-2" /> Your Profile
            </Link>
            <Link to="/settings" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">Settings</Link>
            <div className="border-t border-gray-700 my-1"></div>
            <button 
              onClick={handleLogout} 
              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 flex items-center"
            >
              <FaSignOutAlt className="mr-2" /> Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const navLinks = [
  {
    to: '/dashboard',
    icon: <FaTachometerAlt />,
    label: 'Dashboard',
  },
  {
    to: '/register-product',
    icon: <FaPlus />,
    label: 'Register Product',
  },
];

const NotificationBell = () => {
  const [pendingCount, setPendingCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const fetchPendingTransfers = async () => {
      try {
        const response = await getPendingTransfers();
        if (mounted) {
          const count = response?.pending_transfers?.length || 0;
          setPendingCount(count);
        }
      } catch (error) {
        console.error("Failed to fetch pending transfers:", error);
      }
    };
    
    fetchPendingTransfers();
    
    // Set up an interval to periodically check for new transfers
    const interval = setInterval(fetchPendingTransfers, 60000); // Check every minute
    
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleClick = () => {
    navigate('/approve-transfer');
  };

  return (
    <div className="relative cursor-pointer group" onClick={handleClick}>
      <div className="p-3 bg-gray-800/60 rounded-full group-hover:bg-gray-700/60 transition-colors duration-300 border border-gray-700/50">
        <FaBell className="text-gray-300 group-hover:text-white" />
      </div>
      {pendingCount > 0 && (
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-xs text-white font-bold">
          {pendingCount > 99 ? '99+' : pendingCount}
        </div>
      )}
    </div>
  );
};

const UserNavbar = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-72 w-[calc(100vw-18rem)] z-30 h-20 bg-gray-900/90 backdrop-blur-lg border-b border-indigo-500/20 flex items-center px-12 shadow-lg">
      <div className="flex-1">
        <div className="text-xl font-semibold text-gray-200">
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Veri</span>
          <span className="text-gray-100">Own</span>
          <span className="text-xs ml-2 bg-indigo-800/40 px-3 py-1 rounded-full text-indigo-200 uppercase tracking-wider border border-indigo-700/50">
            Blockchain Technology
          </span>
        </div>
      </div>
      <div className="flex gap-6 items-center">
        {/* Main Nav Links */}
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`relative overflow-hidden flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-300
              ${
                location.pathname === link.to
                  ? 'bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white shadow-lg shadow-blue-700/30'
                  : 'text-gray-300 hover:bg-gray-800/70 hover:text-white'
              }`}
          >
            <span className={`text-lg ${location.pathname === link.to ? 'text-blue-200' : ''}`}>{link.icon}</span>
            <span>{link.label}</span>
            {location.pathname === link.to && (
              <span className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-blue-400 to-indigo-300"></span>
            )}
          </Link>
        ))}
        
        <div className="h-10 w-px bg-gray-700/50 mx-2"></div>
        
        {/* Notification Bell - Now positioned before UserInfo */}
        <NotificationBell />
        
        <UserInfo />
      </div>
    </nav>
  );
};

export default UserNavbar;

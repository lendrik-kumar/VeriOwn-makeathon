import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaExchangeAlt, FaBell, FaSignOutAlt, FaPlus, FaUser } from 'react-icons/fa';
import { getUserInfo, getPendingTransfers } from '../../utils/ApiServices';

// User Info Dropdown
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
        className="flex items-center gap-3 ml-2 bg-gray-800/70 px-4 py-2 rounded-full cursor-pointer hover:bg-gray-700/80 transition-all duration-300 border border-gray-700/50 backdrop-blur-sm shadow"
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
        <div className="absolute right-0 mt-2 w-52 rounded-xl shadow-2xl bg-gray-900 border border-gray-700 overflow-hidden z-50 animate-fade-in-down">
          <div className="py-2">
            <Link to="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white flex items-center transition">
              <FaUser className="mr-2" /> Your Profile
            </Link>
            <Link to="/settings" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition">Settings</Link>
            <div className="border-t border-gray-700 my-1"></div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 transition flex items-center font-semibold rounded-md"
            >
              <FaSignOutAlt className="mr-2" /> Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Nav Links
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

// Notification Bell
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
        // Silent fail
      }
    };
    fetchPendingTransfers();
    const interval = setInterval(fetchPendingTransfers, 60000);
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
      <div className="p-3 bg-gray-800/60 rounded-full group-hover:bg-gray-700/60 transition-colors duration-300 border border-gray-700/50 shadow">
        <FaBell className="text-gray-300 group-hover:text-white" />
      </div>
      {pendingCount > 0 && (
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-xs text-white font-bold shadow">
          {pendingCount > 99 ? '99+' : pendingCount}
        </div>
      )}
    </div>
  );
};

const UserNavbar = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-72 w-[calc(100vw-18rem)] z-30 h-20 bg-gradient-to-r from-gray-900/95 to-gray-800/90 backdrop-blur-lg border-b border-indigo-500/20 flex items-center px-12 shadow-xl">
      <div className="flex-1">
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent select-none">
          {/* Optionally add a dashboard title here */}
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
        <NotificationBell />
        <UserInfo />
      </div>
      <style>
        {`
          .animate-fade-in-down { animation: fadeInDown 0.3s; }
          @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-10px);}
            to { opacity: 1; transform: none;}
          }
        `}
      </style>
    </nav>
  );
};

export default UserNavbar;

import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaExchangeAlt } from 'react-icons/fa';
import { getUserInfo } from '../../utils/ApiServices';

const UserInfo = () => {
  const [user, setUser] = useState({ username: 'User' });

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

  return (
    <div className="flex items-center gap-2 ml-6">
      <div className="w-9 h-9 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center font-bold text-black text-lg uppercase">
        {user.username[0]}
      </div>
      <span className="text-white font-semibold">{user.username}</span>
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
    to: '/approve-transfers',
    icon: <FaExchangeAlt />,
    label: 'Transfer Requests',
  },
];

const UserNavbar = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-72 w-[calc(100vw-18rem)] z-30 h-20 bg-black/80 border-b border-white/10 flex items-center px-12 shadow-lg">
      <div className="flex-1"></div>
      <div className="flex gap-10 items-center">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold text-lg transition
              ${
                location.pathname === link.to
                  ? 'bg-gradient-to-r from-green-400 to-blue-500 text-black shadow'
                  : 'text-white hover:bg-white/10'
              }`}
          >
            <span className="text-xl">{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
        <UserInfo />
      </div>
    </nav>
  );
};

export default UserNavbar;
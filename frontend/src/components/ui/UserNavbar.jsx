import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaExchangeAlt } from 'react-icons/fa';

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
      <div className="flex gap-10">
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
      </div>
    </nav>
  );
};

export default UserNavbar;
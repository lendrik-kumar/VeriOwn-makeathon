import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaSearch, FaExchangeAlt, FaHistory, FaListAlt, FaBoxOpen } from 'react-icons/fa';

const dashboard = () => {
  const navigate = useNavigate();

  const routes = [
    {
      label: 'Register Product',
      icon: <FaPlus />,
      to: '/register-product',
      color: 'from-green-400 to-blue-500'
    },
    {
      label: 'Get Product Info',
      icon: <FaSearch />,
      to: '/product-detail',
      color: 'from-blue-400 to-purple-500'
    },
    {
      label: 'Create Event',
      icon: <FaHistory />,
      to: '/create-event',
      color: 'from-yellow-400 to-pink-500'
    },
    {
      label: 'Initiate Transfer',
      icon: <FaExchangeAlt />,
      to: '/create-transfer',
      color: 'from-indigo-400 to-green-400'
    },
    {
      label: 'Approve Transfers',
      icon: <FaListAlt />,
      to: '/approve-transfer',
      color: 'from-pink-400 to-red-500'
    },
    {
      label: 'My Products',
      icon: <FaBoxOpen />,
      to: '/user-products',
      color: 'from-blue-400 to-green-400'
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-10">
      <h1 className="text-4xl font-bold mb-10 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">
        Dashboard
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-4xl">
        {routes.map((route) => (
          <button
            key={route.to}
            onClick={() => navigate(route.to)}
            className={`flex items-center gap-4 px-8 py-6 rounded-2xl shadow-xl bg-gradient-to-r ${route.color} text-white text-lg font-semibold hover:scale-105 transition-all duration-200`}
          >
            <span className="text-2xl">{route.icon}</span>
            {route.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default dashboard;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaSearch, FaExchangeAlt, FaHistory, FaListAlt, FaBoxOpen } from 'react-icons/fa';

const Dashboard = () => {
  const navigate = useNavigate();

  const routes = [
    {
      label: 'Register Product',
      description: 'Add new products to the blockchain',
      icon: <FaPlus />,
      to: '/register-product',
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'from-blue-400 to-blue-600',
      iconBg: 'bg-blue-500/20'
    },
    {
      label: 'Get Product Info',
      description: 'View detailed product information',
      icon: <FaSearch />,
      to: '/product-detail',
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'from-purple-400 to-purple-600',
      iconBg: 'bg-purple-500/20'
    },
    {
      label: 'Create Event',
      description: 'Record product events and history',
      icon: <FaHistory />,
      to: '/create-event',
      color: 'from-amber-500 to-amber-600',
      hoverColor: 'from-amber-400 to-amber-600',
      iconBg: 'bg-amber-500/20'
    },
    {
      label: 'Initiate Transfer',
      description: 'Transfer ownership to another user',
      icon: <FaExchangeAlt />,
      to: '/create-transfer',
      color: 'from-emerald-500 to-emerald-600',
      hoverColor: 'from-emerald-400 to-emerald-600',
      iconBg: 'bg-emerald-500/20'
    },
    {
      label: 'Approve Transfers',
      description: 'Review and confirm pending transfers',
      icon: <FaListAlt />,
      to: '/approve-transfer',
      color: 'from-rose-500 to-rose-600',
      hoverColor: 'from-rose-400 to-rose-600',
      iconBg: 'bg-rose-500/20'
    },
    {
      label: 'My Products',
      description: 'View all products you own',
      icon: <FaBoxOpen />,
      to: '/user-products',
      color: 'from-cyan-500 to-cyan-600',
      hoverColor: 'from-cyan-400 to-cyan-600',
      iconBg: 'bg-cyan-500/20'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-gray-900 to-gray-950"></div>
      <div className="fixed inset-0 -z-10 opacity-50">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute top-40 -left-20 w-60 h-60 bg-purple-600 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-40 right-20 w-60 h-60 bg-cyan-600 rounded-full filter blur-3xl opacity-20"></div>
      </div>
      
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700/50 sticky top-0 z-10 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            
          </h1>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-400">Connected to Blockchain</span>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome Banner */}
        <div className="mb-12 overflow-hidden rounded-2xl border border-gray-700/50 backdrop-blur-xl relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
          <div className="md:flex relative">
            <div className="p-8 md:p-10 md:w-2/3">
              <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">Welcome to VeriOwn</h2>
              <p className="text-gray-300 mb-8 text-lg max-w-2xl">
                Securely manage product ownership with the power of blockchain technology. 
                Our platform provides tamper-proof verification for all your valuable assets.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => navigate('/register-product')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg transition-all duration-300 shadow-lg shadow-blue-900/30 font-medium flex items-center gap-2"
                >
                  <FaPlus className="text-sm" /> Register New Product
                </button>
                <button 
                  onClick={() => navigate('/user-products')}
                  className="px-6 py-3 bg-gray-800/70 hover:bg-gray-700/70 border border-gray-600 text-gray-100 rounded-lg transition-all duration-300 shadow-lg shadow-gray-900/30 font-medium flex items-center gap-2"
                >
                  <FaBoxOpen className="text-sm" /> View My Products
                </button>
              </div>
            </div>
            <div className="hidden md:flex md:w-1/3 justify-center items-center overflow-hidden">
              <div className="relative w-full h-full">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48">
                  <div className="absolute inset-0 rounded-full bg-blue-600/30 animate-pulse duration-2000"></div>
                  <div className="absolute inset-2 rounded-full bg-blue-700/40"></div>
                  <div className="absolute inset-8 rounded-full bg-blue-500/20 animate-spin duration-10000"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Actions Section */}
        <h2 className="text-xl font-semibold text-gray-100 mb-6 pl-1 border-l-4 border-blue-500 pl-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((route) => (
            <div 
              key={route.to}
              onClick={() => navigate(route.to)}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl hover:scale-[1.02] transition-all duration-300 overflow-hidden group cursor-pointer shadow-lg"
            >
              <div className={`h-1 bg-gradient-to-r ${route.color}`}></div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <span className={`p-3 rounded-xl ${route.iconBg} mr-4 text-xl group-hover:scale-110 transition-transform duration-300`}>
                    {route.icon}
                  </span>
                  <h3 className="font-medium text-lg text-gray-100 group-hover:text-white transition-colors">{route.label}</h3>
                </div>
                <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">{route.description}</p>
                <div className="mt-4 flex justify-end">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r ${route.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="mt-16">
          <h2 className="text-xl font-semibold text-gray-100 mb-6 pl-1 border-l-4 border-purple-500 pl-4">Recent Activity</h2>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-lg">
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-700/50 flex items-center justify-center">
                <FaHistory className="text-2xl text-gray-400" />
              </div>
              <p className="text-gray-400 mb-2">Your recent activity will appear here</p>
              <button className="mt-3 px-6 py-2 rounded-full bg-gradient-to-r from-purple-600/30 to-purple-600/20 text-purple-300 hover:text-purple-200 border border-purple-500/30 transition-colors duration-300">
                View All Activity
              </button>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © 2025 VeriOwn. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <span className="text-gray-600 hover:text-gray-400 cursor-pointer text-sm">Privacy Policy</span>
              <span className="text-gray-600 hover:text-gray-400 cursor-pointer text-sm">Terms of Service</span>
              <span className="text-gray-600 hover:text-gray-400 cursor-pointer text-sm">Contact</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;

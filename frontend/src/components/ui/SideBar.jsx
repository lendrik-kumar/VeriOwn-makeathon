import React, { useEffect, useState } from 'react';
import { getUserProducts } from '../../utils/ApiServices';
import { Link, useNavigate } from 'react-router-dom';
import { FaBoxOpen, FaSignOutAlt, FaCube } from 'react-icons/fa';

const SideBar = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getUserProducts();
        setProducts(res.products || []);
      } catch {
        setProducts([]);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div className="h-screen w-72 bg-black border-r border-white/10 flex flex-col justify-between fixed left-0 top-0 z-40">
      {/* Top: Logo */}
      <div className="flex flex-col items-center py-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-3xl font-extrabold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent select-none">
            VeriOwn
          </span>
          <FaCube className="text-blue-400 text-2xl" />
        </Link>
      </div>
      {/* Middle: User Products */}
      <div className="flex-1 overflow-y-auto px-4">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">Your Products</h3>
        {loading ? (
          <div className="text-gray-400 text-center py-8">Loading...</div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center text-gray-400 py-8">
            <FaBoxOpen className="text-3xl mb-2" />
            <span>No products found</span>
          </div>
        ) : (
          <ul className="space-y-2">
            {products.map((product) => (
              <li key={product.id}>
                <Link
                  to={`/products/${product.id}`}
                  className="block px-4 py-2 rounded-lg bg-white/10 hover:bg-blue-500/20 transition text-gray-100 font-medium truncate"
                  title={product.model}
                >
                  {product.model} <span className="text-xs text-gray-400">({product.serial_number})</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Bottom: Logout */}
      <div className="p-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-green-400 text-black font-bold rounded-full shadow hover:from-blue-600 hover:to-green-500 transition"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
};

export default SideBar;
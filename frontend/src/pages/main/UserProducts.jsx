import React, { useState, useEffect } from 'react';
import { getUserProducts } from '../../utils/ApiServices';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const UserProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserProducts();
  }, []);

  const fetchUserProducts = async () => {
    try {
      setLoading(true);
      const response = await getUserProducts();
      setProducts(response.products || []);
      setError(null);
    } catch (err) {
      setError(err.error || 'Failed to load your products');
      toast.error(err.error || 'Failed to load your products');
    } finally {
      setLoading(false);
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
      <h1 className="text-2xl font-bold mb-6">My Products</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {products.length === 0 ? (
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <p className="text-gray-600">You don't have any registered products yet.</p>
          <Link to="/register-product" className="text-blue-500 hover:underline mt-2 inline-block">
            Register a product
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="p-5">
                <h2 className="text-xl font-bold text-gray-800">{product.model}</h2>
                <p className="text-sm text-gray-500">Manufacturer: {product.manufacturer}</p>
                <p className="text-sm text-gray-500">Serial Number: {product.serial_number}</p>
                <p className="text-sm text-gray-500">
                  Added: {new Date(product.created_at).toLocaleDateString()}
                </p>
                
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <h3 className="text-md font-semibold">Ownership Details</h3>
                  <p className="text-sm text-gray-600">
                    Acquired: {new Date(product.ownership_date).toLocaleDateString()}
                  </p>
                  {product.contract && (
                    <>
                      <p className="text-sm text-gray-600">Contract #: {product.contract.contract_number}</p>
                    </>
                  )}
                </div>

                <div className="mt-4">
                  <Link 
                    to={`/products/${product.id}`}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <button
          onClick={fetchUserProducts}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh List
        </button>
      </div>
    </div>
  );
};

export default UserProducts;

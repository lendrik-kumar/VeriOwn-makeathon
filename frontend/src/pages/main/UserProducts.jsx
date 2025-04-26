import React, { useState, useEffect } from 'react';
import { getUserProducts, getContractPDF, getContractIPFSLink, regenerateContractPDF } from '../../utils/ApiServices';
import { Link } from 'react-router-dom';
import { FaFileContract, FaSyncAlt, FaBoxOpen, FaQrcode } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { QRCodeSVG } from 'qrcode.react';

const UserProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingIds, setProcessingIds] = useState(new Set());
  const [showQRModal, setShowQRModal] = useState(false);
  const [currentQRProduct, setCurrentQRProduct] = useState(null);

  // Get the current origin (domain) for the QR code URL
  const origin = window.location.origin;

  useEffect(() => {
    fetchUserProducts();
    // eslint-disable-next-line
  }, []);

  const fetchUserProducts = async () => {
    try {
      setLoading(true);
      const response = await getUserProducts();
      setProducts(response.products || []);
      setError(null);
    } catch (err) {
      setError(err.error || 'Failed to load your products');
    } finally {
      setLoading(false);
    }
  };

  const handleViewPDF = async (contractId) => {
    try {
      setProcessingIds(prev => new Set(prev).add(contractId));
      const { url } = await getContractPDF(contractId);
      
      // Open PDF in a new tab
      window.open(url, '_blank');
    } catch (err) {
      toast.error(err.error || 'Failed to fetch contract PDF');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(contractId);
        return newSet;
      });
    }
  };

  const handleGetIPFSLink = async (contractId) => {
    try {
      setProcessingIds(prev => new Set(prev).add(`ipfs-${contractId}`));
      const response = await getContractIPFSLink(contractId);
      
      // If we have an IPFS gateway URL, open it in a new tab
      if (response.ipfs_url) {
        window.open(response.ipfs_url, '_blank');
      } else {
        toast.info('Contract is not yet stored on IPFS');
      }
    } catch (err) {
      toast.error(err.error || 'Failed to fetch IPFS link');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(`ipfs-${contractId}`);
        return newSet;
      });
    }
  };

  const handleRegeneratePDF = async (contractId) => {
    try {
      setProcessingIds(prev => new Set(prev).add(`regen-${contractId}`));
      await regenerateContractPDF(contractId);
      toast.success('Contract PDF regenerated successfully');
      
      // Refresh the product list to show updated contract info
      fetchUserProducts();
    } catch (err) {
      toast.error(err.error || 'Failed to regenerate contract PDF');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(`regen-${contractId}`);
        return newSet;
      });
    }
  };

  // Function to show QR code modal
  const handleShowQRCode = (product) => {
    setCurrentQRProduct(product);
    setShowQRModal(true);
  };

  // Function to download QR code
  const handleDownloadQR = () => {
    if (!currentQRProduct) return;
    
    // Get the SVG element
    const svgElement = document.getElementById('product-qr-code');
    if (!svgElement) {
      toast.error('Could not find QR code element');
      return;
    }
    
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions to match SVG
    canvas.width = svgElement.clientWidth;
    canvas.height = svgElement.clientHeight;
    
    // Create an image from the SVG
    const img = new Image();
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
      // Draw image on canvas
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      // Convert canvas to PNG
      try {
        const pngUrl = canvas.toDataURL('image/png');
        
        // Create download link
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `${currentQRProduct.model.replace(/\s+/g, '-')}_${currentQRProduct.serial_number}_verify.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        // Clean up
        URL.revokeObjectURL(svgUrl);
      } catch (err) {
        console.error('Error generating PNG:', err);
        toast.error('Failed to generate downloadable image');
      }
    };
    
    img.onerror = () => {
      console.error('Error loading SVG as image');
      toast.error('Failed to process QR code for download');
      URL.revokeObjectURL(svgUrl);
    };
    
    img.src = svgUrl;
  };

  // Close modal when clicking outside
  const handleModalBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowQRModal(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <div className="w-full max-w-5xl mt-24">
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">
          My Products
        </h1>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center p-4 mb-6 bg-red-100/80 border border-red-400 text-red-700 rounded-md animate-shake">
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white/10 p-8 rounded-xl text-center shadow-lg">
            <FaBoxOpen className="mx-auto text-4xl mb-2 text-blue-400" />
            <p className="text-gray-200 mb-2">You don't have any registered products yet.</p>
            <Link
              to="/register-product"
              className="inline-block mt-2 px-6 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-black font-bold rounded-full shadow hover:from-green-500 hover:to-blue-600 transition"
            >
              Register a product
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 flex flex-col gap-3 animate-fade-in"
              >
                <h2 className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                  {product.model}
                </h2>
                <p className="text-sm text-gray-300">Manufacturer: {product.manufacturer}</p>
                <p className="text-sm text-gray-300">Serial Number: {product.serial_number}</p>
                <p className="text-sm text-gray-400">
                  Added: {new Date(product.created_at).toLocaleDateString()}
                </p>
                
                {product.contract && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <h3 className="text-md font-semibold">Ownership Contract</h3>
                    <p className="text-sm text-gray-600">Contract #: {product.contract.contract_number}</p>
                    <p className="text-sm text-gray-600">
                      Transfer Date: {new Date(product.contract.transfer_date).toLocaleDateString()}
                    </p>
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        onClick={() => handleViewPDF(product.contract.id)}
                        disabled={processingIds.has(product.contract.id)}
                        className={`px-2 py-1 text-xs rounded ${
                          processingIds.has(product.contract.id)
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        {processingIds.has(product.contract.id) ? 'Loading...' : 'View PDF'}
                      </button>
                      
                      <button
                        onClick={() => handleGetIPFSLink(product.contract.id)}
                        disabled={processingIds.has(`ipfs-${product.contract.id}`)}
                        className={`px-2 py-1 text-xs rounded ${
                          processingIds.has(`ipfs-${product.contract.id}`)
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                      >
                        {processingIds.has(`ipfs-${product.contract.id}`) ? 'Loading...' : 'View on IPFS'}
                      </button>
                      
                      <button
                        onClick={() => handleRegeneratePDF(product.contract.id)}
                        disabled={processingIds.has(`regen-${product.contract.id}`)}
                        className={`px-2 py-1 text-xs rounded ${
                          processingIds.has(`regen-${product.contract.id}`)
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-amber-500 text-white hover:bg-amber-600'
                        }`}
                      >
                        {processingIds.has(`regen-${product.contract.id}`) ? 'Processing...' : 'Regenerate PDF'}
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Link 
                    to={`/products/${product.id}`}
                    className="px-4 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-black font-bold rounded-full shadow hover:from-green-500 hover:to-blue-600 transition text-center text-sm"
                  >
                    View Details
                  </Link>
                  
                  <button
                    onClick={() => handleShowQRCode(product)}
                    className="flex items-center justify-center gap-1 px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-500 text-white font-bold rounded-full shadow hover:from-purple-500 hover:to-pink-600 transition text-sm"
                  >
                    <FaQrcode /> QR Code
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-10 flex justify-center">
          <button
            onClick={fetchUserProducts}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-green-400 text-black font-bold rounded-full shadow hover:from-blue-600 hover:to-green-500 transition"
          >
            <FaSyncAlt className="animate-spin-slow" /> Refresh List
          </button>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && currentQRProduct && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={handleModalBackdropClick}
        >
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 max-w-md w-full">
            <h3 className="text-2xl font-bold text-center mb-2">Product QR Code</h3>
            <p className="text-center text-gray-300 mb-6">
              {currentQRProduct.manufacturer} {currentQRProduct.model}
            </p>
            
            <div className="flex justify-center bg-white p-6 rounded-lg mb-6">
              <QRCodeSVG 
                id="product-qr-code"
                value={`${origin}/verify/${currentQRProduct.id}`}
                size={250}
                level="H"
                includeMargin={true}
                imageSettings={{
                  src: "https://via.placeholder.com/40x40.png?text=VO",
                  x: undefined,
                  y: undefined,
                  height: 40,
                  width: 40,
                  excavate: true,
                }}
              />
            </div>
            
            <div className="text-center text-sm text-gray-400 mb-4">
              Scan this QR code to verify product authenticity and view product details
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setShowQRModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Close
              </button>
              <button
                onClick={handleDownloadQR}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-green-400 text-black font-bold rounded-lg hover:from-blue-600 hover:to-green-500 transition"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>
        {`
          .animate-fade-in { animation: fadeIn 0.7s; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(30px);} to { opacity: 1; transform: none; } }
          .animate-shake { animation: shake 0.4s; }
          @keyframes shake {
            10%, 90% { transform: translateX(-2px); }
            20%, 80% { transform: translateX(4px); }
            30%, 50%, 70% { transform: translateX(-8px); }
            40%, 60% { transform: translateX(8px); }
          }
          .animate-spin-slow { animation: spin 2s linear infinite; }
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}
      </style>
    </div>
  );
};

export default UserProducts;

import React from 'react';
import { FaFolder, FaChartBar, FaWallet, FaUsers, FaDownload, FaStar, FaHeart, FaBolt, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Add this import
import SplineModel from '../../components/splineModel';
import Navbar from '../../components/ui/Navbar'; // Import Navbar

const cards = [
  {
    color: 'bg-green-400/80',
    icon: <FaFolder size={32} />,
    title: 'File Manager',
    users: '5.2k',
    downloads: '9,04,012+',
    rating: 4.9,
    ratingIcon: <FaHeart className="text-black" />,
  },
  {
    color: 'bg-yellow-300/80',
    icon: <FaChartBar size={32} />,
    title: 'Analytics Data',
    users: '9.2k',
    downloads: '1,00,000+',
    rating: 5.0,
    ratingIcon: <FaStar className="text-black" />,
  },
  {
    color: 'bg-blue-400/80',
    icon: <FaWallet size={32} />,
    title: 'Wallet Feature',
    users: '4.8k',
    downloads: '70,800+',
    rating: 3.2,
    ratingIcon: <FaHeart className="text-black" />,
  },
];

const Landing = () => {
  const navigate = useNavigate(); // Add this line

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-black text-white">
      {/* Navbar */}
      <Navbar />
      {/* Add top padding to prevent overlap */}
      <div className="pt-16">
        {/* Background Spline Model */}
        <div className="absolute inset-0 z-0">
          <SplineModel />
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 p-8 flex flex-col items-center min-h-screen">
          {/* Heading */}
          <h1 className="text-5xl md:text-6xl font-bold text-center mb-6 leading-tight mt-0">
            Get the <span className="inline-flex items-center gap-2 text-green-400">
              <FaBolt className="inline-block" /> Application
            </span> you<br />
            Want for <span className="underline decoration-yellow-400">Growth</span>
          </h1>

          {/* Get Started Button */}
          <button
            className="mb-12 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-black font-bold px-8 py-3 rounded-full shadow-lg flex items-center gap-2 transition-all duration-200"
            onClick={() => navigate('/signup')}
          >
            Get Started <FaArrowRight />
          </button>

          {/* Spacer to push cards to bottom */}
          <div className="flex-grow" />

          {/* Explore Marketplace Title & Filters */}
          <div className="flex w-full max-w-6xl justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold"></h2>
            <div className="flex gap-2">
              <button className="bg-white/10 text-white px-4 py-1 rounded-full font-medium border border-white/20">Featured</button>
              <button className="bg-white/5 text-white px-4 py-1 rounded-full font-medium border border-white/10">Popular</button>
              <button className="ml-2 bg-white text-black rounded-full p-2 shadow"><FaArrowRight /></button>
            </div>
          </div>

          {/* Marketplace Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mb-8">
            {cards.map((card, idx) => (
              <div
                key={card.title}
                className={`p-6 rounded-2xl ${card.color} shadow-lg flex flex-col gap-4 min-h-[220px] relative`}
              >
                {/* Icon & Rating */}
                <div className="flex justify-between items-center mb-2">
                  <span className="bg-white/30 rounded-full p-2 text-black">{card.icon}</span>
                  <span className="flex items-center gap-1 bg-white/30 rounded-full px-3 py-1 text-black font-bold text-sm">
                    {card.ratingIcon} {card.rating}
                  </span>
                </div>
                <h2 className="text-xl font-semibold">{card.title}</h2>
                <div className="flex justify-between text-sm mt-2">
                  <span className="flex items-center gap-1">
                    <FaUsers className="inline-block" /> {card.users}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaDownload className="inline-block" /> {card.downloads}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <button className="bg-black/80 text-white font-semibold px-4 py-2 rounded-full">
                    Download APP
                  </button>
                  <button className="bg-white text-black font-semibold px-4 py-2 rounded-full flex items-center gap-1">
                    Get <FaArrowRight />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
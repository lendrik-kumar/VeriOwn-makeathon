import React from 'react';
import { FaFolder, FaChartBar, FaWallet, FaUsers, FaDownload, FaStar, FaHeart, FaBolt, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Add this import
import SplineModel from '../../components/splineModel';
import Navbar from '../../components/ui/Navbar'; // Import Navbar

const cards = [
  {
    color: 'bg-[#00CFF5]/20',
    icon: <FaFolder size={20} />,
    title: 'Focused on Consumer Benefits',
    users: 'Full product visibility through a decentralized warranty and history ledger — no lost receipts, no hidden issues, no hassle.',
    ratingIcon: <FaHeart className="text-black" />,
  },
  {
    color: 'bg-[#A259FF]/40', // Reduced opacity for translucency
    icon: <FaChartBar size={20} />,
    title: 'Straightforward',
    users: 'A decentralized ledger for tracking warranties, repairs, ownership, and service history — boosting trust, cutting fraud, and streamlining after-sales service.',
    ratingIcon: <FaStar className="text-black" />,
  },
  {
    color: 'bg-[#00F58C]/30', // Reduced opacity for translucency
    icon: <FaWallet size={20} />,
    title: 'Visionary ',
    users: 'A transparent, tamper-proof record of every products journey, empowering true ownership and trust through decentralized technology.',
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
          Explore the Future of <span className="inline-flex items-center gap-2 text-green-300 ">
              <FaBolt className="inline-block" /> Verification
            </span><br />
            with NFTs
          </h1>

          {/* Get Started Button */}
          <button
            className="mb-6 mt-20 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-black font-bold px-8 py-3 rounded-full shadow-lg flex items-center gap-2 transition-all duration-200"
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
                <div className="flex justify-between h-8 items-center mb-2">
                  <span className="bg-white/30 rounded-full p-2 text-black">{card.icon}</span>
                </div>
                <h2 className="text-xl font-semibold">{card.title}</h2>
                <div className="flex justify-between text-sm mt-2">
                  <span className="flex items-center gap-1">
                    <FaUsers className="inline-block" /> {card.users}
                  </span>
                  
                </div>
                <div className="flex justify-between items-center mt-4">
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

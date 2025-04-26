import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFolder, FaChartBar, FaWallet, FaUsers, FaStar, FaHeart, FaBolt, 
         FaArrowRight, FaShieldAlt, FaFingerprint, FaStream, FaCheckCircle, 
         FaChevronDown, FaGlobe, FaLock, FaCube } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import SplineModel from '../../components/splineModel';
import Navbar from '../../components/ui/Navbar';

// Feature cards
const cards = [
  {
    color: 'bg-gradient-to-br from-blue-900/40 to-green-900/40',
    icon: <FaFolder size={20} />,
    title: 'Consumer Benefits',
    users: 'Full product visibility through a decentralized warranty and history ledger — no lost receipts, no hidden issues, no hassle.',
    ratingIcon: <FaHeart className="text-blue-300" />,
  },
  {
    color: 'bg-gradient-to-br from-green-900/40 to-blue-900/40',
    icon: <FaChartBar size={20} />,
    title: 'Straightforward',
    users: 'A decentralized ledger for tracking warranties, repairs, ownership, and service history — boosting trust, cutting fraud, and streamlining after-sales service.',
    ratingIcon: <FaStar className="text-green-300" />,
  },
  {
    color: 'bg-gradient-to-br from-purple-900/40 to-blue-900/40',
    icon: <FaWallet size={20} />,
    title: 'Visionary',
    users: 'A transparent, tamper-proof record of every product\'s journey, empowering true ownership and trust through decentralized technology.',
    ratingIcon: <FaHeart className="text-purple-300" />,
  },
];

// Stats for animated counter
const stats = [
  { label: 'Verified Products', value: 10000, icon: <FaCheckCircle /> },
  { label: 'Happy Users', value: 5000, icon: <FaUsers /> },
  { label: 'Brands', value: 250, icon: <FaShieldAlt /> },
  { label: 'Countries', value: 30, icon: <FaGlobe /> },
];

// How it works steps
const steps = [
  {
    title: 'Register Your Product',
    description: 'Scan the QR code or enter your product\'s serial number to claim ownership.',
    icon: <FaFingerprint size={24} className="text-green-300" />,
  },
  {
    title: 'Access Digital Warranty',
    description: 'Get instant access to your product\'s warranty and service history.',
    icon: <FaLock size={24} className="text-blue-300" />,
  },
  {
    title: 'Track Ownership & Repairs',
    description: 'Monitor every service event and ownership transfer on the blockchain.',
    icon: <FaStream size={24} className="text-purple-300" />,
  }
];

// AnimatedCounter component for statistics
const AnimatedCounter = ({ value, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    const incrementTime = (duration / end) * 1.1;
    
    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, incrementTime);
    
    return () => clearInterval(timer);
  }, [value, duration]);
  
  return <span>{count.toLocaleString()}</span>;
};

const Landing = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-black text-white">
      {/* Navbar */}
      <Navbar />
      
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <SplineModel />
        
        {/* Additional background elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-[10%] w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-2/3 right-[15%] w-40 h-40 bg-green-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-[30%] w-24 h-24 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10">
        {/* Hero Section - adjusted positioning */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="min-h-[95vh] flex flex-col items-center px-4 text-center relative pt-8"
        >
          {/* Hero Content - moved closer to top */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto mt-8"
          >
            <motion.div 
              className="mb-4 inline-block py-2 px-4 rounded-full bg-gradient-to-r from-green-400/20 to-blue-500/20 text-sm font-medium"
              whileHover={{ scale: 1.05 }}
            >
              Revolutionary Product Verification
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-5 leading-tight">
              Explore the Future of{" "}
              <span className="inline-flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-400">
                <FaBolt className="inline-block text-green-300" /> 
                Verification with NFTs
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 mt-72 max-w-2xl mx-auto">
              Secure, transparent, and immutable product authentication using blockchain technology.
              Take control of your product ownership journey.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-black font-bold px-8 py-3 rounded-full shadow-lg flex items-center justify-center gap-2 transition-all duration-200"
                onClick={() => navigate('/signup')}
              >
                Get Started <FaArrowRight />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3 rounded-full shadow-lg flex items-center justify-center gap-2 backdrop-blur-sm"
                onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
              >
                Learn More <FaChevronDown />
              </motion.button>
            </div>
          </motion.div>
          
          {/* Scroll indicator - moved up slightly */}
          <motion.div 
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
          >
            <FaChevronDown className="text-2xl cursor-pointer text-gray-400 hover:text-white" />
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.section
          id="features"
          className="py-20 px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                  Revolutionizing
                </span> Product Ownership
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Our platform empowers consumers and brands with unmatched transparency and security.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {cards.map((card, idx) => (
                <motion.div
                  key={card.title}
                  className={`p-6 rounded-2xl ${card.color} backdrop-blur-md shadow-xl flex flex-col gap-4 min-h-[250px] relative overflow-hidden border border-white/10`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.2 }}
                  whileHover={{ 
                    y: -5,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
                  }}
                >
                  {/* Glowing orb in background */}
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
                  
                  {/* Icon & Rating */}
                  <div className="flex justify-between h-8 items-center mb-2 z-10">
                    <span className="bg-white/30 rounded-full p-3 text-black shadow-lg">
                      {card.icon}
                    </span>
                    <span>{card.ratingIcon}</span>
                  </div>
                  <h2 className="text-2xl font-bold z-10">{card.title}</h2>
                  <div className="flex text-gray-200 mt-2 z-10">
                    <span>
                      {card.users}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
        
        {/* Stats Section */}
        <motion.section
          className="py-16 px-4 bg-gradient-to-r from-black to-gray-900/60"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {stats.map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  className="p-6 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-3xl mb-2 flex justify-center text-blue-400">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-400">
                    <AnimatedCounter value={stat.value} />+
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
        
        {/* How it Works Section */}
        <motion.section
          id="how-it-works"
          className="py-20 px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">VeriOwn</span> Works
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Three simple steps to secure and manage your product ownership
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connecting line for desktop */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500/50 via-blue-500/50 to-purple-500/50"></div>
              
              {steps.map((step, idx) => (
                <motion.div
                  key={step.title}
                  className="bg-black/50 backdrop-blur-md border border-white/10 rounded-xl p-8 flex flex-col items-center text-center relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.2 }}
                >
                  {/* Step number */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-black font-bold mb-6 z-10">
                    {idx + 1}
                  </div>
                  <div className="mb-4">{step.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-300">{step.description}</p>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-black font-bold px-8 py-3 rounded-full shadow-lg flex items-center justify-center gap-2 transition-all duration-200 mx-auto"
                onClick={() => navigate('/signup')}
              >
                Start Verifying Your Products <FaArrowRight />
              </motion.button>
            </div>
          </div>
        </motion.section>
        
        {/* CTA Section */}
        <motion.section
          className="py-20 px-4 relative overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Background glow */}
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-green-500/10 rounded-full blur-3xl"></div>
          
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-black/60 to-gray-800/30 backdrop-blur-xl rounded-3xl p-10 border border-white/10 relative z-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Transform Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">Ownership Experience</span>?
              </h2>
              <p className="text-xl text-gray-300">
                Join thousands of consumers and brands already using VeriOwn to secure their products.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-black font-bold px-8 py-3 rounded-full shadow-lg flex items-center justify-center gap-2 transition-all duration-200"
                onClick={() => navigate('/signup')}
              >
                Sign Up Now <FaArrowRight />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3 rounded-full shadow-lg flex items-center justify-center gap-2"
                onClick={() => navigate('/login')}
              >
                Login
              </motion.button>
            </div>
          </div>
        </motion.section>
        
        {/* Footer */}
        <footer className="py-10 px-4 border-t border-white/10">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 flex items-center">
              <FaCube className="text-blue-400 text-2xl mr-2" />
              <span className="text-2xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                VeriOwn
              </span>
            </div>
            
            <div className="text-gray-400 text-sm text-center md:text-right">
              <p>© 2025 VeriOwn. All rights reserved.</p>
              <p>Secure Product Ownership Verification</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;

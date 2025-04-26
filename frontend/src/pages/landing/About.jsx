import React from 'react';
import { motion } from 'framer-motion';
import { FaFingerprint, FaShieldAlt, FaCube, FaExchangeAlt, FaFileContract, FaLock } from 'react-icons/fa';

export default function AboutVeriOwn() {
  const sections = [
    {
      title: "Our Mission",
      icon: <FaShieldAlt className="text-green-400" />,
      content: "VeriOwn empowers brands and users to register, verify, and transfer product ownership securely using blockchain technology. We aim to eliminate counterfeiting and bring transparency to product provenance for everyone."
    },
    {
      title: "How VeriOwn Works",
      icon: <FaCube className="text-blue-400" />,
      isList: true,
      content: [
        "Brands register products on-chain, creating a tamper-proof digital certificate.",
        "Each product receives a unique QR code for instant verification.",
        "Ownership transfers are managed securely and transparently via blockchain events.",
        "Users can view their product portfolio, approve transfers, and access digital ownership certificates anytime.",
        "All actions are logged immutably, ensuring trust and authenticity."
      ]
    },
    {
      title: "Why Blockchain?",
      icon: <FaLock className="text-purple-400" />,
      content: "Blockchain provides an immutable, decentralized ledger for product data and ownership, making forgery impossible and giving users full control over their assets."
    }
  ];

  const features = [
    {
      icon: <FaFingerprint className="text-white h-5 w-5" />,
      title: "Authenticity Verification",
      desc: "Instantly verify product authenticity using blockchain-backed QR codes."
    },
    {
      icon: <FaFileContract className="text-white h-5 w-5" />,
      title: "Digital Ownership Certificates",
      desc: "Every product gets a digital certificate, accessible anytime and stored on IPFS."
    },
    {
      icon: <FaExchangeAlt className="text-white h-5 w-5" />,
      title: "Secure Ownership Transfer",
      desc: "Transfer product ownership with a single click, tracked and validated on-chain."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f13] to-[#18181b] relative overflow-hidden py-16">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute w-[700px] h-[700px] rounded-full bg-blue-900/20 blur-3xl"
          style={{ top: '10%', left: '-15%' }}
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 20, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-green-900/20 blur-3xl"
          style={{ bottom: '-10%', right: '-10%' }}
          animate={{
            scale: [1, 1.2, 1],
            y: [0, -30, 0],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative mb-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-[#1c1c24]/90 backdrop-blur-md rounded-2xl overflow-hidden p-8 md:p-12 border border-[#2e2e3a] shadow-xl max-w-4xl mx-auto"
          >
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{
                  duration: 0.8,
                  type: "spring",
                  bounce: 0.5,
                  delay: 0.3
                }}
                className="inline-flex items-center justify-center bg-[#232136]/80 backdrop-blur-md p-3 rounded-2xl shadow-xl shadow-blue-900/20 mb-6 border border-[#393552]"
              >
                <div className="bg-gradient-to-tr from-green-400 via-blue-500 to-purple-500 rounded-xl p-3 text-white">
                  <FaFingerprint className="h-8 w-8" />
                </div>
              </motion.div>

              <motion.h1
                className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                About VeriOwn
              </motion.h1>

              <motion.div
                className="w-24 h-1 mx-auto mb-6 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 0.6, duration: 1 }}
              ></motion.div>

              <motion.p
                className="text-lg text-gray-300 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                The future of product authenticity and ownership is here. VeriOwn leverages blockchain to make every product verifiable, transferable, and truly yours.
              </motion.p>
            </div>
          </motion.div>
        </motion.div>

        {/* Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-[#1c1c24]/90 backdrop-blur-md mx-auto p-6 md:p-12 rounded-2xl max-w-4xl border border-[#2e2e3a] shadow-xl mb-16"
        >
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="mb-12 last:mb-0 group hover:bg-gradient-to-r hover:from-[#232136]/50 hover:to-[#2a2a3a]/50 p-6 rounded-xl transition-all duration-300 border border-transparent hover:border-[#393552]"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#232136] flex items-center justify-center mr-3">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  {section.title}
                </h2>
              </div>
              {section.isList ? (
                <ul className="list-disc list-inside space-y-3 text-gray-400 ml-2">
                  {section.content.map((item, i) => (
                    <motion.li
                      key={i}
                      className="group-hover:text-gray-300 transition-colors duration-300 pl-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + (i * 0.1), duration: 0.5 }}
                    >
                      {item}
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  {section.content}
                </p>
              )}
              {index !== sections.length - 1 && (
                <div className="border-b border-[#2e2e3a] mt-12"></div>
              )}
            </motion.div>
          ))}

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16 pt-8 border-t border-[#2e2e3a]"
          >
            <h2 className="text-2xl font-bold mb-8 text-center bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  className="bg-gradient-to-br from-[#232136] to-[#1c1c24] p-6 rounded-xl border border-[#393552] shadow-sm hover:shadow-md transition-shadow"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center mb-4 shadow-lg shadow-green-900/40">
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">{f.title}</h3>
                  <p className="text-gray-400">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="text-center mt-16 pt-8 border-t border-[#2e2e3a]"
          >
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Get in Touch
            </h2>
            <p className="text-gray-400 mb-8">
              For inquiries, collaborations, or support, contact us at{' '}
              <a
                href="mailto:support@veriown.com"
                className="text-green-400 hover:text-blue-400 font-medium transition-colors duration-300"
              >
                support@veriown.com
              </a>
            </p>
            <motion.button
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium text-lg shadow-lg shadow-blue-900/50 hover:shadow-blue-800/50 transition-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Contact Us
            </motion.button>
          </motion.div>
        </motion.div>

        <div className="text-center text-gray-500 text-sm mt-8">
          &copy; {new Date().getFullYear()} VeriOwn - Blockchain Product Verification
        </div>
      </div>
    </div>
  );
}

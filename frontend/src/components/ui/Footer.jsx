import React from 'react';
import { Link } from 'react-router-dom';
import { FaFingerprint, FaGithub, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#18181b] border-t border-[#2e2e3a]">
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg mr-3">
                <FaFingerprint className="text-white text-2xl" />
              </div>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                ProofNest
              </h2>
            </div>
            <p className="text-gray-400 mb-2 max-w-md">
              Secure your creative works with blockchain verification. ProofNest provides tamper-proof certification for your digital assets.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="bg-[#232136] hover:bg-[#2a2a3a] p-2 rounded-full transition-colors border border-[#393552]">
                <FaTwitter className="text-gray-300" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="bg-[#232136] hover:bg-[#2a2a3a] p-2 rounded-full transition-colors border border-[#393552]">
                <FaGithub className="text-gray-300" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="bg-[#232136] hover:bg-[#2a2a3a] p-2 rounded-full transition-colors border border-[#393552]">
                <FaLinkedinIn className="text-gray-300" />
              </a>
            </div>
          </div>

          {/* Quick Links - only includes links to pages that exist */}
          <div>
            <h3 className="text-gray-200 font-semibold mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/verify" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  Verify Content
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-gray-200 font-semibold mb-4 text-lg">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gray-200 font-semibold mb-4 text-lg">Contact</h3>
            <p className="text-gray-400 mb-2">Have a question?</p>
            <a
              href="mailto:support@proofnest.com"
              className="text-indigo-400 hover:text-purple-400 transition-colors font-medium"
            >
              support@proofnest.com
            </a>
          </div>
        </div>

        <div className="border-t border-[#2e2e3a] mt-10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} ProofNest. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <p className="text-gray-500 text-sm">
              Secured by Blockchain Technology
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

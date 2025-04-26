import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/ui/Navbar';
import Footer from '../../components/ui/Footer';

function Login() {
  const [form, setForm] = useState({
    username: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post('/api/users/login', form);
      localStorage.setItem('token', response.data.token);
      setMessage('Login successful!');
      // Navigate to dashboard or home after successful login
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#18181b] via-[#232136] to-[#0f0f13]">
      <div className="flex w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl bg-[#18181b] bg-opacity-95 border border-[#232136]">
        {/* Left Section - Login Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <div className="mb-8 flex items-center gap-3">
            <div className="bg-gradient-to-tr from-purple-600 to-indigo-500 text-white w-11 h-11 rounded-full flex items-center justify-center font-bold text-2xl shadow-lg border-2 border-[#232136]">V</div>
            <span className="font-extrabold text-2xl tracking-wide text-white">VeriOwn</span>
          </div>

          <h1 className="text-3xl font-extrabold mb-2 text-white tracking-tight">Welcome back</h1>
          <p className="mb-8 text-gray-400">Sign in to your VeriOwn account</p>

          <form className="flex flex-col gap-5" onSubmit={handleLogin}>
            <div className="flex flex-col gap-1">
              <label className="text-gray-300 font-semibold">Username</label>
              <input
                type="text"
                name="username"
                placeholder="johndoe123"
                className="p-3 rounded-lg bg-[#232136] border border-[#393552] text-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition placeholder-gray-500"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-gray-300 font-semibold">Password</label>
              <input
                type="password"
                name="password"
                placeholder="********"
                className="p-3 rounded-lg bg-[#232136] border border-[#393552] text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition placeholder-gray-500"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex justify-between items-center text-sm mt-1">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="mr-2 h-4 w-4 accent-indigo-600"
                />
                <label htmlFor="remember" className="text-gray-400">Remember me</label>
              </div>
              <a href="#" className="text-indigo-400 hover:underline">Forgot password?</a>
            </div>

            <button
              type="submit"
              className={`bg-gradient-to-r from-purple-600 to-indigo-500 text-white p-3 rounded-lg font-bold mt-4 shadow-lg hover:scale-105 hover:shadow-purple-800/40 transition-all duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            {message && (
              <div className={`text-center mt-2 font-semibold ${message.includes('failed') ? 'text-red-400' : 'text-green-400'}`}>
                {message}
              </div>
            )}
          </form>

          <div className="mt-8 text-gray-400 text-sm text-center">
            Don't have an account?{' '}
            <a href="/signup" className="text-indigo-400 hover:underline font-semibold">
              Sign up
            </a>
          </div>
        </div>

        {/* Right Section - Illustration / Benefits */}
        <div className="hidden md:flex w-1/2 flex-col justify-center items-center bg-gradient-to-br from-[#232136] via-[#18181b] to-[#0f0f13] relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#232136] via-[#18181b] to-[#0f0f13] opacity-90"></div>
          <div className="relative z-10 flex flex-col items-center p-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 mb-8 shadow-xl flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-6 text-white text-center">Secure Authentication</h2>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center mr-3">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span>Verify product authenticity</span>
              </li>
              <li className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center mr-3">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span>Track ownership history</span>
              </li>
              <li className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center mr-3">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span>Secure transfer process</span>
              </li>
              <li className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center mr-3">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span>Blockchain-inspired verification</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    </>
  );
}

export default Login;

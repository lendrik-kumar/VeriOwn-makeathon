import React, { useState } from 'react';
import axios from 'axios';

const initialForms = {
  regular: { username: '', password: '' },
  brand: {
    username: '', password: '', company_name: '', tax_id: '',
    contact_email: '', official_domain: ''
  },
  repair_shop: {
    username: '', password: '', business_name: '', business_license: '',
    location_address: '', certification_proof: '', contact_email: ''
  }
};

const Signup = () => {
  const [userType, setUserType] = useState('regular');
  const [form, setForm] = useState(initialForms['regular']);
  const [message, setMessage] = useState('');

  const handleTypeChange = (e) => {
    setUserType(e.target.value);
    setForm(initialForms[e.target.value]);
    setMessage('');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage('');
    let url = '/api/users/register/regular';
    let data = form;

    if (userType === 'brand') {
      url = '/api/users/register/brand';
      data = {
        username: form.username,
        password: form.password,
        company_name: form.company_name,
        tax_id: form.tax_id,
        contact_email: form.contact_email,
        official_domain: form.official_domain,
      };
    } else if (userType === 'repair_shop') {
      url = '/api/users/register/repair-shop';
      data = {
        username: form.username,
        password: form.password,
        business_name: form.business_name,
        business_license: form.business_license,
        location_address: form.location_address,
        certification_proof: form.certification_proof,
        contact_email: form.contact_email,
      };
    }

    try {
      const res = await axios.post(url, data);
      setMessage(res.data.message || 'Signup successful!');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center pt-20 justify-center bg-gradient-to-br from-[#18181b] via-[#232136] to-[#0f0f13]">
      <div className="flex w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl bg-[#18181b] bg-opacity-95 border border-[#232136]">
        {/* Left Section - Sign Up Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <div className="mb-8 flex items-center gap-3">
            <div className="bg-gradient-to-tr from-purple-600 to-indigo-500 text-white w-11 h-11 rounded-full flex items-center justify-center font-bold text-2xl shadow-lg border-2 border-[#232136]">V</div>
            <span className="font-extrabold text-2xl tracking-wide text-white">VeriOwn</span>
          </div>

          <h1 className="text-3xl font-extrabold mb-2 text-white tracking-tight">Create your account</h1>
          <p className="mb-8 text-gray-400">Join the VeriOwn community and start your journey!</p>

          <form className="flex flex-col gap-5" onSubmit={handleSignup}>
            {/* User Type Selection */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-300 font-semibold">Account Type</label>
              <select
                className="p-3 rounded-lg bg-[#232136] border border-[#393552] text-white"
                value={userType}
                onChange={handleTypeChange}
              >
                <option value="regular">Regular User</option>
                <option value="brand">Brand</option>
                <option value="repair_shop">Repair Shop</option>
              </select>
            </div>

            {/* Common Fields */}
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

            {/* Brand Fields */}
            {userType === 'brand' && (
              <>
                <div className="flex flex-col gap-1">
                  <label className="text-gray-300 font-semibold">Company Name</label>
                  <input
                    type="text"
                    name="company_name"
                    placeholder="Apple Inc."
                    className="p-3 rounded-lg bg-[#232136] border border-[#393552] text-white"
                    value={form.company_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-gray-300 font-semibold">Tax ID</label>
                  <input
                    type="text"
                    name="tax_id"
                    placeholder="123456789"
                    className="p-3 rounded-lg bg-[#232136] border border-[#393552] text-white"
                    value={form.tax_id}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-gray-300 font-semibold">Contact Email</label>
                  <input
                    type="email"
                    name="contact_email"
                    placeholder="verification@apple.com"
                    className="p-3 rounded-lg bg-[#232136] border border-[#393552] text-white"
                    value={form.contact_email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-gray-300 font-semibold">Official Domain</label>
                  <input
                    type="text"
                    name="official_domain"
                    placeholder="apple.com"
                    className="p-3 rounded-lg bg-[#232136] border border-[#393552] text-white"
                    value={form.official_domain}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}

            {/* Repair Shop Fields */}
            {userType === 'repair_shop' && (
              <>
                <div className="flex flex-col gap-1">
                  <label className="text-gray-300 font-semibold">Business Name</label>
                  <input
                    type="text"
                    name="business_name"
                    placeholder="FixIt Pro Repair"
                    className="p-3 rounded-lg bg-[#232136] border border-[#393552] text-white"
                    value={form.business_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-gray-300 font-semibold">Business License</label>
                  <input
                    type="text"
                    name="business_license"
                    placeholder="LIC987654321"
                    className="p-3 rounded-lg bg-[#232136] border border-[#393552] text-white"
                    value={form.business_license}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-gray-300 font-semibold">Location Address</label>
                  <input
                    type="text"
                    name="location_address"
                    placeholder="123 Repair Ave, New York, NY 10001"
                    className="p-3 rounded-lg bg-[#232136] border border-[#393552] text-white"
                    value={form.location_address}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-gray-300 font-semibold">Certification Proof (URL)</label>
                  <input
                    type="text"
                    name="certification_proof"
                    placeholder="https://certifications.com/fixit-pro-cert.pdf"
                    className="p-3 rounded-lg bg-[#232136] border border-[#393552] text-white"
                    value={form.certification_proof}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-gray-300 font-semibold">Contact Email</label>
                  <input
                    type="email"
                    name="contact_email"
                    placeholder="service@fixitpro.com"
                    className="p-3 rounded-lg bg-[#232136] border border-[#393552] text-white"
                    value={form.contact_email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white p-3 rounded-lg font-bold mt-2 shadow-lg hover:scale-105 hover:shadow-purple-800/40 transition-all duration-200"
            >
              Sign Up
            </button>

            {message && (
              <div className="text-center text-purple-400 mt-2 font-semibold">{message}</div>
            )}
          </form>

          <div className="mt-8 text-gray-400 text-sm text-center">
            Already have an account?{' '}
            <a href="/login" className="text-indigo-400 hover:underline font-semibold">
              Log in
            </a>
          </div>
        </div>

        {/* Right Section - Illustration / Testimonials */}
        <div className="hidden md:flex w-1/2 flex-col justify-center items-center bg-gradient-to-br from-[#232136] via-[#18181b] to-[#0f0f13] relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#232136] via-[#18181b] to-[#0f0f13] opacity-90"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="flex mb-6">
              <div className="flex -space-x-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-2 border-purple-700 overflow-hidden shadow-lg bg-gradient-to-tr from-purple-600 to-indigo-500 opacity-80"></div>
                ))}
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-3 text-white">People love VeriOwn</h2>
            <p className="text-base text-center text-gray-400 max-w-md">
              Trusted by thousands of users worldwide.<br />
              Experience secure product ownership verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

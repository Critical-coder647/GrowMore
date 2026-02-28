import React, { useState } from 'react';
import axios from 'axios';
import logoGM from '../../asset/logoGM.png';

function Login({ onAuth, go }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email,
        password: formData.password
      });

      // Pass auth data to parent component
      if (onAuth) {
        onAuth(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = () => {
    go('register');
  };

  return (
    <div className="min-h-screen bg-[#f5f7f8] dark:bg-[#101b22]" style={{ fontFamily: 'Manrope, sans-serif' }}>
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col lg:flex-row min-h-screen">
        {/* Left Side: Visual/Hero */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-60"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD5pudbU8HlwIRx1k4-EhtS_rK4c44YKfStSEJ-NmK8QhcPlfwKM0fZZ1jyvRXbMcbFQ-NXqcp-8pZVXAGV0rHcZZRqwITSQyCAL5sTrUkmDu14wO_nUA9RxIG778QJAWXcLMxFY4XPZF39v3Vfn95iv3ByD8WeqHTxuKJaPdwiiXNrcCXiVfcJgwZ0hdCee-KUxQjnt-t3zwj-mX4-ddUvQ7tUmkdbn0hOWbS3ENG0WZaCrqifYsey5fTDiM5L6x_719HaByxmbdA")'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          <div className="absolute left-10 top-10 z-10 flex items-center gap-3 cursor-pointer text-white" onClick={() => go('landing')}>
            <img src={logoGM} alt="GrowMore" className="h-10 w-10 object-contain" />
            <h2 className="text-xl font-bold tracking-tight">GrowMore</h2>
          </div>
          <div className="relative z-10 flex flex-col justify-end p-16 h-full text-white max-w-2xl">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0d93f2]/20 border border-[#0d93f2]/30 text-[#0d93f2] text-xs font-bold uppercase tracking-wider mb-6">
                Community &amp; Growth
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
                Connect with the future of fundraising.
              </h1>
              <p className="text-lg text-slate-300 leading-relaxed max-w-lg">
                Join a community of over 10,000 startups and investors sharing
                progress, building relationships, and raising capital efficiently.
              </p>
            </div>
            <div className="flex items-center gap-4 mt-8 pt-8 border-t border-white/10">
              <div className="flex -space-x-3">
                <div
                  className="w-10 h-10 rounded-full border-2 border-slate-900 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCdjPf2MxmZ_9damT-nuRE9F0vQDJY2f6BiE21T-P7qkJlrkl8tjpv62bOeeQ_-gtbDOAioL0nWT75vSO6z8B-E9brxLsaAtLXzZqDLfyJEfEKvpuYhAv6ZRxWeQhipvFNTAbJCvH4ENElz2fhzhZ-944DTjw8-rJinX4DVDe0ywYZLDreWzbhhRx-pmFMPjYG-hZVVuNWHyzcPts_JeiR3svdahAKnU_r8p9B39w5fGrJbqOADJCrt25lFLzZLIXeqiKZ-N9BVb5g")'
                  }}
                />
                <div
                  className="w-10 h-10 rounded-full border-2 border-slate-900 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBUf44oL4f8mcsf8XflXfpG1Wn4ShOVuTmhisBSq2PZ7zlcCMjJ2Rg6QGkZwdHGzwdbNqyPaVICKYrwc94aWphwFvjTO4pQfHxLVmHf_JCQZjeHIriCmYQ8vZN4V8Mh7a8fShvz47YtiR_rVOBw_B5-HWQFAvbVnw2yC-a31rnoQQT75fChQPhDguVHMDPwinbAxht1liAXjuerO7Bzt7VLjuwNwkULt5H_JQvVe-EtLiW4S0XPJ3NW4A6j7t1v2VKuxjFgJIPEqbo")'
                  }}
                />
                <div
                  className="w-10 h-10 rounded-full border-2 border-slate-900 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDcjeQAt_A002LFWkNVX_KBjEb9zHkR39F7at0vw_WQwInUs977ARBCqKsDiOjXu_7np6v4GcDmYDLhz7eEHb0640Ub53ZQDrSN9QJiDTDXnhboDaiULtfjKMoLZy5xxMnmfA1k48KhhHK9kHr3o_QzCuLfN8O00fC_MEY5B5q8fIMPSAWXBZXenTwgQKB5FrAWMabpbFRsJ2KXFfeHn-oUxb30a0iXonaCJfitfiiF_8SdlHleNE0-dbpg8367ZKVNhReZ3jO-Bjg")'
                  }}
                />
                <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-xs font-bold">
                  +2k
                </div>
              </div>
              <div className="text-sm font-medium text-slate-300">
                <span className="text-white font-bold">4.9/5</span> rating from our
                community
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-1/2 flex flex-col h-screen overflow-y-auto bg-[#f5f7f8] dark:bg-[#101b22]">
          <div className="lg:hidden flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-[#0d161c] dark:text-white cursor-pointer" onClick={() => go('landing')}>
              <img src={logoGM} alt="GrowMore" className="h-7 w-7 object-contain" />
              <span className="font-bold text-lg">GrowMore</span>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center px-6 py-10 lg:p-16">
          <div className="w-full max-w-md flex flex-col gap-8">
            <div className="flex justify-start">
              <button
                type="button"
                onClick={() => go('landing')}
                className="flex items-center gap-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                Back
              </button>
            </div>
            <div className="text-center lg:text-left">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Welcome Back
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                Please enter your details to sign in.
              </p>
              <p className="hidden sm:block mt-2 text-sm text-slate-600 dark:text-slate-400">
                Don't have an account?{' '}
                <button
                  onClick={handleSignup}
                  className="font-bold text-[#0d93f2] hover:text-blue-600"
                >
                  Sign up
                </button>
              </p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Email Field */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                  htmlFor="email"
                >
                  Email or Username
                </label>
                <div className="relative">
                  <input
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0d93f2]/20 focus:border-[#0d93f2] transition-all"
                    id="email"
                    name="email"
                    placeholder="name@company.com"
                    type="text"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative flex items-center">
                  <input
                    className="w-full h-12 pl-4 pr-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0d93f2]/20 focus:border-[#0d93f2] transition-all"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    className="absolute right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    className="w-4 h-4 rounded border-slate-300 text-[#0d93f2] focus:ring-[#0d93f2]/20 cursor-pointer"
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                    Remember for 30 days
                  </span>
                </label>
                <a
                  className="text-sm font-bold text-[#0d93f2] hover:text-blue-600 transition-colors"
                  href="#"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                className="mt-2 w-full h-12 flex items-center justify-center rounded-xl bg-[#0d93f2] hover:bg-blue-600 text-white font-bold text-base transition-all shadow-lg shadow-[#0d93f2]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-700" />
              <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium">
                Or continue with
              </span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-700" />
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <img
                  alt="Google"
                  className="w-5 h-5"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaQq0PYsksvjfUpMuc1ytFIrAhJeEb8sH54CJlRvJ2ezyT2rAnFl_6rIha7K0ET8Gv_RTiw3FYU3PKK8brtZERLxKp3ahpizfJdGzLusTrfO1u_MDaniU2RJsKGw_zbJ0U3nNybn2Tu4p9GdNM3pXSlpiQhbP8hzbvd8rsL0A_7T0Fi5op77YQwIQvoIE9ZcadVLv-DH--QCECqSAzNi5G1LsEna3cfC3Jp0jKDZ1UqfCOnIALnrCyysZ12N8OJYqcjT1QObs8G_o"
                />
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  Google
                </span>
              </button>
              <button className="flex items-center justify-center gap-2 h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <img
                  alt="LinkedIn"
                  className="w-5 h-5"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYLQetj20VIKDsJZ2Bz9eYNo4VrvfjFfpsYQm2eN4XJ1LpaBPRZYsWYQEH__0H9KQqCDkbB29L0qccgjT32uuKNOWvCYGQqQTkQ51pTYlHwWLr9pdhmw-m_wEUm_dbq7dYQpEgu9scbEmygVP7ukIS8ujxJa_39J3RMWrj-DSHbHbAXdgMUyaso2xyvPoWCW92IISbwrMEebdOCJEIuK9lLSy6nTTtwWgC5EDmLYS9Yzw7XJ1ZW5XVM1J5CchZSG4TaJWdssTjHa4"
                />
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  LinkedIn
                </span>
              </button>
            </div>

            {/* Mobile Signup Link */}
            <div className="block sm:hidden text-center mt-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Don't have an account?{" "}
                <button 
                  onClick={handleSignup}
                  className="font-bold text-[#0d93f2] hover:text-blue-600"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;

import React, { useState } from 'react';
import axios from 'axios';

function Register({ onAuth, go }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'startup'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      onAuth(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-row bg-[#f5f7f8] dark:bg-[#101b22]" style={{ fontFamily: 'Manrope, sans-serif' }}>
          {/* Left Panel: Visual & Value Prop */}
          <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 relative flex-col justify-between bg-cover bg-center overflow-hidden p-12" data-alt="Team of diverse professionals collaborating in a modern sunlit office space" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD8nayz9M32g0hRq52p6RtT_RLTMlFhp8Xs5KQEOeU-7jNP1z7fDEIVVa89Vh4yimb7XmMU-APAQeInsNy8lN3PTScQzN_ivHTZLxgTeAHQdHk8fxx06wXBaWNePqVILn4-zTcpJ4t0s5aa_1bYKnuz9K3exDwT2aNSEW9mtcidlOll0mc9pYw68_PBxs0CUZbghtmHWiNRs2X9WgS-r4z-LYBN_592NO9BcXG3zU6fr4wza7lyHjFBBZ4rENSqDWVokWk4U1hRmfg")'}}>
            {/* Dark Overlay for Readability */}
            <div className="absolute inset-0 bg-[#0d161c]/60 mix-blend-multiply z-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d161c] via-transparent to-[#0d161c]/40 z-0" />
            {/* Header / Logo */}
            <div className="relative z-10 flex items-center gap-3 text-white cursor-pointer" onClick={() => go('landing')}>
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#0d93f2]/20 backdrop-blur-sm border border-white/10">
                <span className="material-symbols-outlined text-white">rocket_launch</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight">GrowMore</h2>
            </div>
            {/* Main Content Area */}
            <div className="relative z-10 flex flex-col gap-10 mt-auto mb-10">
              <div className="flex flex-col gap-4">
                <h1 className="text-4xl xl:text-5xl font-bold leading-tight text-white tracking-[-0.02em]">
                  Join the Future of <span className="text-[#0d93f2]">Fundraising</span>
                </h1>
                <p className="text-lg text-slate-200 font-medium max-w-[540px] leading-relaxed">
                  Connect with over 10,000 founders and VCs. Raise capital, share updates, and grow your community in one place.
                </p>
              </div>
              {/* Stats / Social Proof Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg">
                  <div className="flex items-center gap-2 mb-2 text-[#0d93f2]">
                    <span className="material-symbols-outlined text-[24px]">monetization_on</span>
                  </div>
                  <p className="text-white text-2xl font-bold leading-none">$50M+</p>
                  <p className="text-slate-300 text-sm font-medium">Capital Deployed</p>
                </div>
                <div className="flex flex-col gap-1 p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg">
                  <div className="flex items-center gap-2 mb-2 text-[#0d93f2]">
                    <span className="material-symbols-outlined text-[24px]">verified_user</span>
                  </div>
                  <p className="text-white text-2xl font-bold leading-none">10k+</p>
                  <p className="text-slate-300 text-sm font-medium">Verified Investors</p>
                </div>
              </div>
            </div>
            {/* Footer Legal */}
            <div className="relative z-10 flex gap-6 text-sm text-slate-400 font-medium">
              <a className="hover:text-white transition-colors" href="#">Terms of Service</a>
              <a className="hover:text-white transition-colors" href="#">Privacy Policy</a>
            </div>
          </div>
          {/* Right Panel: Signup Form */}
          <div className="w-full lg:w-7/12 xl:w-1/2 flex flex-col h-screen overflow-y-auto bg-background-light dark:bg-background-dark">
            {/* Mobile Header (Visible only on small screens) */}
            <div className="lg:hidden flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-[#0d161c] dark:text-white cursor-pointer" onClick={() => go('landing')}>
                <span className="material-symbols-outlined text-[#0d93f2]">rocket_launch</span>
                <span className="font-bold text-lg">GrowMore</span>
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-24">
              <div className="w-full max-w-[480px] flex flex-col gap-8">
                {/* Form Header */}
                <div className="flex flex-col gap-2 text-center sm:text-left">
                  <h2 className="text-[#0d161c] dark:text-white text-3xl font-bold leading-tight tracking-[-0.015em]">Create your account</h2>
                  <div className="flex gap-1 justify-center sm:justify-start items-center text-sm font-medium">
                    <span className="text-[#497a9c] dark:text-slate-400">Already have an account?</span>
                    <button onClick={() => go('login')} className="text-[#0d93f2] hover:underline font-bold">Log In</button>
                  </div>
                </div>
                {/* Persona Toggle (Segmented Button) */}
                <div className="flex p-1 rounded-xl bg-[#e7eef4] dark:bg-slate-800">
                  <button
                    type="button"
                    onClick={() => handleRoleChange('startup')}
                    className={`flex-1 h-10 rounded-lg px-2 text-sm font-bold transition-all ${
                      formData.role === 'startup'
                        ? 'bg-white dark:bg-slate-700 text-[#0d161c] dark:text-white shadow-sm'
                        : 'text-[#497a9c] dark:text-slate-400'
                    }`}
                  >
                    <span className="truncate">Startup</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleChange('investor')}
                    className={`flex-1 h-10 rounded-lg px-2 text-sm font-bold transition-all ${
                      formData.role === 'investor'
                        ? 'bg-white dark:bg-slate-700 text-[#0d161c] dark:text-white shadow-sm'
                        : 'text-[#497a9c] dark:text-slate-400'
                    }`}
                  >
                    <span className="truncate">Investor</span>
                  </button>
                </div>
                {/* Social Signup */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 h-12 px-4 rounded-xl border border-[#cedde8] dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-[#0d161c] dark:text-white text-sm font-bold shadow-sm">
                    <img alt="Google Logo" className="w-5 h-5" data-alt="Google G logo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsUYA8IdQOxWlUOmuBbaKtB0ljmOiCuGPLuoRvv0HZ6Zn2lqOmPZHbItgFgQ33ZWgYrS11VMHOnQSEJ8me2QDVOa6lKnOjJSv83cv_yzMCKotnDfLC3r6yNWDqQc6ZV0cyrH1iZMBcXX36PDivVuGkjZ9xSNFJRqrqqCAEkVfKPU-fIMPKl5u5rbfqRv49uO-hEn9kic8_hkKgpL9K8LWLAQtyacKjk9MxNpgfUlYRcClArVqSofG1vUboMvJSwdve9qRPnjqF4oU" />
                    <span>Google</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 h-12 px-4 rounded-xl border border-[#cedde8] dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-[#0d161c] dark:text-white text-sm font-bold shadow-sm">
                    <img alt="LinkedIn Logo" className="w-5 h-5" data-alt="LinkedIn In logo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-e-oE_TCjKlMX9e7nbH00mvRCgysxeO4jASDuhdBSalpTRn_xlEbP41gkHM6ymBdL_gUWmUr7c33rXs10Asbgz08_UiobueWG71StSze_8wGqLERoLd9IU1gy1Fx1QeT6t1XD4UOGla_ZW9QAltyq8k22d8ZMzypS50Y6urh3xzQCyGQVcZ1EuudrZWgpGDF2XSSwljSqvi9NRZIZp-DfHiRzsABKWHuulTH9ftSoAvKa_93CjSK9pws3shnSZ-EQHZiS6Se4gcU" />
                    <span>LinkedIn</span>
                  </button>
                </div>
                {/* Divider */}
                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-[#cedde8] dark:border-slate-700" />
                  <span className="flex-shrink mx-4 text-[#497a9c] dark:text-slate-500 text-xs font-bold uppercase tracking-wider">Or sign up with email</span>
                  <div className="flex-grow border-t border-[#cedde8] dark:border-slate-700" />
                </div>
                {/* Error Display */}
                {error && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                    {error}
                  </div>
                )}

                {/* Input Fields */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <label className="flex flex-col gap-1.5">
                    <p className="text-[#0d161c] dark:text-slate-200 text-sm font-bold leading-normal">Full Name</p>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#497a9c] material-symbols-outlined text-[20px]">person</span>
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="form-input flex w-full rounded-xl border border-[#cedde8] dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-[#0d93f2] focus:ring-4 focus:ring-[#0d93f2]/10 h-12 pl-11 pr-4 placeholder:text-[#497a9c]/60 text-[#0d161c] dark:text-white text-base font-normal leading-normal transition-all"
                        placeholder="Jane Doe"
                        type="text"
                      />
                    </div>
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <p className="text-[#0d161c] dark:text-slate-200 text-sm font-bold leading-normal">Work Email</p>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#497a9c] material-symbols-outlined text-[20px]">mail</span>
                      <input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="form-input flex w-full rounded-xl border border-[#cedde8] dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-[#0d93f2] focus:ring-4 focus:ring-[#0d93f2]/10 h-12 pl-11 pr-4 placeholder:text-[#497a9c]/60 text-[#0d161c] dark:text-white text-base font-normal leading-normal transition-all"
                        placeholder="jane@company.com"
                        type="email"
                      />
                    </div>
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <p className="text-[#0d161c] dark:text-slate-200 text-sm font-bold leading-normal">Password</p>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#497a9c] material-symbols-outlined text-[20px]">lock</span>
                      <input
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="form-input flex w-full rounded-xl border border-[#cedde8] dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-[#0d93f2] focus:ring-4 focus:ring-[#0d93f2]/10 h-12 pl-11 pr-12 placeholder:text-[#497a9c]/60 text-[#0d161c] dark:text-white text-base font-normal leading-normal transition-all"
                        placeholder="Create a password"
                        type={showPassword ? 'text' : 'password'}
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#497a9c] hover:text-[#0d93f2] transition-colors"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                    <p className="text-xs text-[#497a9c] dark:text-slate-500 mt-0.5">Must be at least 8 characters long.</p>
                  </label>
                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-4 flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-4 bg-[#0d93f2] hover:bg-[#0b7dd1] transition-colors text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-[#0d93f2]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="truncate">{loading ? 'Creating Account...' : 'Get Started'}</span>
                  </button>
                </form>
                {/* Trust Footer */}
                <div className="flex items-center justify-center gap-2 text-xs text-[#497a9c] dark:text-slate-500">
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                  <span>Your data is secure and encrypted.</span>
                </div>
              </div>
            </div>
          </div>
    </div>
  );
}

export default Register;

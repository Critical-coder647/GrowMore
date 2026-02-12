import React from 'react';
import logoGM from '../../asset/logoGM.png';

function Landing({ go }) {
  const handleLogin = () => {
    go('login');
  };

  const handleSignup = () => {
    go('register');
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#f5f7f8] dark:bg-[#101b22] text-slate-900 dark:text-white overflow-x-hidden antialiased"
      style={{ fontFamily: 'Manrope, sans-serif' }}>
    {/* GrowMore Navigation */}
    <header className="sticky top-0 z-50 bg-[#f5f7f8]/90 dark:bg-[#101b22]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="flex justify-center w-full">
        <div className="flex items-center justify-between w-full max-w-7xl px-4 py-4 lg:px-8">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#0d93f2]/10">
              <img
                src={logoGM}
                alt="GrowMore logo"
                className="w-7 h-7 object-contain"
                loading="lazy"
              />
            </div>
            <h2 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight">
              GrowMore
            </h2>
          </div>
          <div className="hidden lg:flex items-center gap-8">
            <a
              className="text-slate-600 dark:text-slate-300 hover:text-[#0d93f2] font-medium text-sm transition-colors"
              href="#"
            >
              Startups
            </a>
            <a
              className="text-slate-600 dark:text-slate-300 hover:text-[#0d93f2] font-medium text-sm transition-colors"
              href="#"
            >
              Investors
            </a>
            <a
              className="text-slate-600 dark:text-slate-300 hover:text-[#0d93f2] font-medium text-sm transition-colors"
              href="#"
            >
              Community
            </a>
            <a
              className="text-slate-600 dark:text-slate-300 hover:text-[#0d93f2] font-medium text-sm transition-colors"
              href="#"
            >
              About Us
            </a>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleLogin}
              className="hidden sm:flex items-center justify-center h-10 px-5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold transition-colors">
              Login
            </button>
            <button 
              onClick={handleSignup}
              className="flex items-center justify-center h-10 px-5 rounded-lg bg-[#0d93f2] hover:bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition-all transform hover:scale-105">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </header>
    {/* Hero Section */}
    <section className="relative w-full py-16 lg:py-24">
      <div className="flex justify-center">
        <div className="max-w-7xl w-full px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="flex flex-col gap-6 text-center lg:text-left">
              <div className="inline-flex items-center self-center lg:self-start gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                <span className="w-2 h-2 rounded-full bg-[#0d93f2] animate-pulse" />
                <span className="text-xs font-bold text-[#0d93f2] tracking-wide uppercase">
                  New Community Features
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
                Where Visionaries <br className="hidden lg:block" /> Meet{" "}
                <span className="text-[#0d93f2]">Capital</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
                The all-in-one ecosystem for startups to raise funds and
                investors to discover the next big thing. Join the community
                building the future.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
                <button className="flex items-center gap-2 h-12 px-8 rounded-lg bg-[#0d93f2] hover:bg-blue-600 text-white text-base font-bold shadow-lg shadow-blue-500/25 transition-all">
                  <span className="material-symbols-outlined text-xl">
                    trending_up
                  </span>
                  Raise Capital
                </button>
                <button className="flex items-center gap-2 h-12 px-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-900 dark:text-white text-base font-bold transition-all">
                  <span className="material-symbols-outlined text-xl">
                    payments
                  </span>
                  Start Investing
                </button>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-4 text-sm text-slate-500 dark:text-slate-400 pt-4">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[#0d93f2] text-lg">
                    verified_user
                  </span>
                  <span>Bank-grade Security</span>
                </div>
                <div className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[#0d93f2] text-lg">
                    groups
                  </span>
                  <span>10k+ Members</span>
                </div>
              </div>
            </div>
            <div className="relative w-full aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-black/50 group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
              <div
                className="w-full h-full bg-center bg-cover transition-transform duration-700 group-hover:scale-105"
                data-alt="Diverse team of startup founders collaborating around a laptop in a modern office"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAIswHfrTJTLfyAz_a8m2uv9c1uBH3uDq2OaFCBrbVydIKlXiMRz5FQ121nTMOJwrgHWlfDVY9TBW6J-5wowia9XcHUI2NLMsWavmi7fuysFXXZyR4HkF6sPkYlAlPXQLKuC4ceNxFllaJMI4PWK3_LyVVIGIvYP21WCkhH9B-b0fD1qG0clBf0wsWC7h9LVt3Tm0mx93YXVZv1mybTw7NahTUWEJpuDe6r89TZERkuiRiM9cf3gLWNcEftXAFCJ_l0J7XH3OVtH8c")'
                }}
              ></div>
              {/* Floating UI Card Overlay */}
              <div className="absolute bottom-6 left-6 right-6 z-20 bg-white dark:bg-slate-800/90 backdrop-blur p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#0d93f2]/20 flex items-center justify-center text-[#0d93f2]">
                    <span className="material-symbols-outlined">rocket</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-bold text-slate-900 dark:text-white text-sm">
                        TechFlow AI
                      </p>
                      <span className="text-xs font-semibold text-green-500">
                        +12% this week
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#0d93f2] h-full rounded-full"
                        style={{ width: "75%" }}
                      />
                    </div>
                    <div className="flex justify-between mt-1 text-[10px] text-slate-500 font-medium">
                      <span>$750k raised</span>
                      <span>Goal: $1M</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    {/* Social Proof */}
    <section className="py-10 border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
      <div className="flex justify-center">
        <div className="max-w-7xl w-full px-4 text-center">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-8">
            Trusted by industry leaders &amp; VCs
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Logo placeholders using text/icons for simplicity as no images provided for logos specifically */}
            <div className="flex items-center gap-2 text-xl font-bold text-slate-700 dark:text-slate-300">
              <span className="material-symbols-outlined text-3xl">token</span>{" "}
              Stripe
            </div>
            <div className="flex items-center gap-2 text-xl font-bold text-slate-700 dark:text-slate-300">
              <span className="material-symbols-outlined text-3xl">
                diamond
              </span>{" "}
              Coinbase
            </div>
            <div className="flex items-center gap-2 text-xl font-bold text-slate-700 dark:text-slate-300">
              <span className="material-symbols-outlined text-3xl">spa</span>{" "}
              Sequoia
            </div>
            <div className="flex items-center gap-2 text-xl font-bold text-slate-700 dark:text-slate-300">
              <span className="material-symbols-outlined text-3xl">
                flutter_dash
              </span>{" "}
              YCombinator
            </div>
            <div className="flex items-center gap-2 text-xl font-bold text-slate-700 dark:text-slate-300">
              <span className="material-symbols-outlined text-3xl">bolt</span>{" "}
              TechStars
            </div>
          </div>
        </div>
      </div>
    </section>
    {/* How It Works */}
    <section className="py-20 bg-slate-50 dark:bg-[#13222d]">
      <div className="flex justify-center">
        <div className="max-w-7xl w-full px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              How GrowMore Works
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Whether you're building the future or funding it, we've
              streamlined the process to help you succeed.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Startup Flow */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-[#0d93f2]">
                  <span className="material-symbols-outlined text-2xl">
                    rocket_launch
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  For Startups
                </h3>
              </div>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0d93f2]/10 text-[#0d93f2] flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      Create Profile
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Showcase your pitch deck, financials, and team.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0d93f2]/10 text-[#0d93f2] flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      Engage Community
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Post updates, milestones, and build a following.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0d93f2]/10 text-[#0d93f2] flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      Get Funded
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Connect with verified investors and close deals.
                    </p>
                  </div>
                </li>
              </ul>
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
                <a
                  className="text-[#0d93f2] font-bold text-sm hover:underline flex items-center gap-1"
                  href="#"
                >
                  Start Fundraising{" "}
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>
            {/* Investor Flow */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <span className="material-symbols-outlined text-2xl">
                    paid
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  For Investors
                </h3>
              </div>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      Discover Deals
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Browse curated startups based on your thesis.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      Track Progress
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Follow startup updates in real-time on your feed.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      Invest Securely
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Seamlessly deploy capital through our secure platform.
                    </p>
                  </div>
                </li>
              </ul>
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
                <a
                  className="text-emerald-600 dark:text-emerald-400 font-bold text-sm hover:underline flex items-center gap-1"
                  href="#"
                >
                  Join as Investor{" "}
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    {/* Community Section */}
    <section className="py-20 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-30 pointer-events-none">
        <div className="absolute top-10 -left-10 w-72 h-72 bg-[#0d93f2]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 -right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      </div>
      <div className="flex justify-center relative z-10">
        <div className="max-w-7xl w-full px-4 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-2">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                More Than Just Funding. <br />{" "}
                <span className="text-[#0d93f2]">A Community.</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg mb-8">
                Follow startup journeys from seed to IPO. React to milestones,
                comment on strategy, and build relationships before the term
                sheet.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#0d93f2] bg-[#0d93f2]/10 p-2 rounded-full">
                    rss_feed
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    Live Founder Updates
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#0d93f2] bg-[#0d93f2]/10 p-2 rounded-full">
                    forum
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    Direct Investor Feedback
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#0d93f2] bg-[#0d93f2]/10 p-2 rounded-full">
                    celebration
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    Celebrate Wins Together
                  </span>
                </div>
              </div>
              <button className="mt-10 h-12 px-8 rounded-lg border-2 border-slate-900 dark:border-white text-slate-900 dark:text-white font-bold hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-colors">
                Explore Community
              </button>
            </div>
            {/* Fake Feed UI */}
            <div className="lg:col-span-3 relative">
              {/* Card 1 (Main) */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-5 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500 z-10 relative">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                      NM
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                        Nova Motors
                      </h4>
                      <p className="text-xs text-slate-500">
                        2 hours ago • Seed Stage
                      </p>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600">
                    <span className="material-symbols-outlined">
                      more_horiz
                    </span>
                  </button>
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-sm mb-4">
                  Huge milestone today! 🚀 We just delivered our 1000th electric
                  scooter unit. Revenue is up 40% MoM. Thanks to our early
                  backers for believing in sustainable urban mobility!
                </p>
                <div
                  className="w-full h-48 rounded-lg bg-cover bg-center mb-4"
                  data-alt="Modern electric scooter parked on a city street at sunset"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCctuJusl3lYwPRqS8V_EJTKZnSxUFYcBV0N-HG2VezT0VTNo9ASxVCTIOobdbw_TkRcJIfcgZZsJNNIe4D6S8MyO4-j_u9eqqJG83gx5yyFZSoEbEEOt9RORl79_1JwiLR2_p3MbFluDCghDIIAk9CPr-O9Dcgs-bTGUMj_Y7xrOYOe9VoqsE7RIKVSW_N_ceRcvIhPgjnVua4wTkYrxjRYNk3wY5bXSovHTHB6idTYP2xu_Xh-HXD0E05fSKBY0kaBAODijgyZ7s")'
                  }}
                />
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex gap-4">
                    <button className="flex items-center gap-1 text-slate-500 hover:text-red-500 text-xs font-medium transition-colors group">
                      <span className="material-symbols-outlined text-lg group-hover:text-red-500">
                        favorite
                      </span>{" "}
                      243
                    </button>
                    <button className="flex items-center gap-1 text-slate-500 hover:text-[#0d93f2] text-xs font-medium transition-colors group">
                      <span className="material-symbols-outlined text-lg group-hover:text-[#0d93f2]">
                        chat_bubble
                      </span>{" "}
                      42
                    </button>
                  </div>
                  <button className="text-slate-500 hover:text-[#0d93f2]">
                    <span className="material-symbols-outlined text-lg">
                      share
                    </span>
                  </button>
                </div>
              </div>
              {/* Card 2 (Background) */}
              <div className="absolute top-10 left-10 w-full bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-5 opacity-40 scale-95 -z-10 blur-[1px]">
                <div className="flex gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-500" />
                  <div className="h-10 w-32 bg-slate-200 dark:bg-slate-700 rounded-lg" />
                </div>
                <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-700 rounded mb-4" />
                <div className="h-32 w-full bg-slate-200 dark:bg-slate-700 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    {/* Testimonials */}
    <section className="py-20 bg-slate-50 dark:bg-[#13222d]">
      <div className="flex justify-center">
        <div className="max-w-7xl w-full px-4 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
            Success Stories
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm">
              <div className="flex gap-1 text-yellow-400 mb-4">
                <span className="material-symbols-outlined text-sm fill-current">
                  star
                </span>
                <span className="material-symbols-outlined text-sm fill-current">
                  star
                </span>
                <span className="material-symbols-outlined text-sm fill-current">
                  star
                </span>
                <span className="material-symbols-outlined text-sm fill-current">
                  star
                </span>
                <span className="material-symbols-outlined text-sm fill-current">
                  star
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 mb-6 italic">
                "GrowMore made it incredibly easy to reach investors who
                actually understood our niche. We closed our seed round in 3
                weeks."
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full bg-cover bg-center"
                  data-alt="Portrait of Sarah Jenkins, CEO"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDngNuSnMT0oEdqot8jBQ6qTQDnUzQoxFJFwCQU0OqAoOqZNDUH78oMiHXsuR3Q_yy5BFj3jF3uuEqRAxhNWHUfFQi91b4pNslagt_Gy-SAg0M22M8caomIDMB8OGRazbTL8f15MRy5TnIVez78Bp6OVm3iumsuaM0wwI2zbrEg5RXjJCqqSOT0yyL82TDeBa8nkwtaN87TDPsrYmwhuN-PQSiz6ILglHTB2XDLsHK5QnExoQSWe-Uo_hhd_xYxCLyqiutZs9qqnGM")'
                  }}
                />
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white text-sm">
                    Sarah Jenkins
                  </h5>
                  <p className="text-xs text-slate-500">
                    CEO, GreenTech Solutions
                  </p>
                </div>
              </div>
            </div>
            {/* Testimonial 2 */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm">
              <div className="flex gap-1 text-yellow-400 mb-4">
                <span className="material-symbols-outlined text-sm fill-current">
                  star
                </span>
                <span className="material-symbols-outlined text-sm fill-current">
                  star
                </span>
                <span className="material-symbols-outlined text-sm fill-current">
                  star
                </span>
                <span className="material-symbols-outlined text-sm fill-current">
                  star
                </span>
                <span className="material-symbols-outlined text-sm fill-current">
                  star
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 mb-6 italic">
                "The community aspect is a game changer. Being able to see
                regular updates from founders gives me the confidence to invest
                more."
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full bg-cover bg-center"
                  data-alt="Portrait of David Chen, Angel Investor"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCy3j9d0VxN8xWRPmz5mWQZfbcbm6-hmgDruLUis3K__JwZmbvc4yVK-kEW5_I-ek0s3BSxHGH1uhq6s46Q9r5RDd5QLL57IrtfWdonhhU0IFOi7Zyn4yHxGyRUqiZxuaEPZX0iV98e5hBrATHi9fytw4PEbI0WFTVTRahW_cBaeL_Z4NDmXE0EQezNVWjw_9TS1ZwFj394Vq0VMlBi05_BQwaNNLxsvqenitzGygjNLv3YtOlGeMJlo5u5eFEBw5BiEv5pI0gUt4w")'
                  }}
                />
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white text-sm">
                    David Chen
                  </h5>
                  <p className="text-xs text-slate-500">Angel Investor</p>
                </div>
              </div>
            </div>
            {/* Testimonial 3 */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm">
              <div className="flex gap-1 text-yellow-400 mb-4">
                <span className="material-symbols-outlined text-sm fill-current">
                  star
                </span>
                <span className="material-symbols-outlined text-sm fill-current">
                  star
                </span>
                <span className="material-symbols-outlined text-sm fill-current">
                  star
                </span>
                <span className="material-symbols-outlined text-sm fill-current">
                  star
                </span>
                <span className="material-symbols-outlined text-sm fill-current">
                  star
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 mb-6 italic">
                "I found my lead investor through the 'Trending Startups' feed.
                The platform is intuitive and professional."
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full bg-cover bg-center"
                  data-alt="Portrait of Michael Ross, Founder"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCI9dyiObTgWbthqHfqMO6iPm3ITXrSYtLFp2jMJJKLZtWxi5grYI5G5W-gal5JxkIj_XgkVb6mUt0wKon5tjtldNTa1mfyOQxnAwCoeP2PvMFeiTaDQ_D5aXiaTeur2z35ky1Xf_pFOhS5npJYLTDfGqa_725rYtB3F-qRij9NPaYt7UB2rMcb0qn5iQMOYawN8j1woAP2fPhSPKttgnoU47rj0LBI354VjvjrZQZtHZDcM1b-fi7A2gSlWtr8Bt_47T8n1KPXUVM")'
                  }}
                />
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white text-sm">
                    Michael Ross
                  </h5>
                  <p className="text-xs text-slate-500">Founder, DataSystems</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    {/* CTA Section */}
    <section className="py-24 bg-[#0d93f2] text-white">
      <div className="flex justify-center">
        <div className="max-w-4xl w-full px-4 text-center">
          <h2 className="text-4xl font-black tracking-tight mb-6">
            Ready to shape the future?
          </h2>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
            Join 10,000+ founders and investors changing the world one deal at a
            time. Create your account today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="h-14 px-8 rounded-xl bg-white text-[#0d93f2] text-lg font-bold shadow-xl hover:bg-slate-100 transition-colors">
              Get Started for Free
            </button>
            <button className="h-14 px-8 rounded-xl bg-blue-600 border border-blue-400 text-white text-lg font-bold hover:bg-blue-700 transition-colors">
              Schedule a Demo
            </button>
          </div>
          <p className="mt-6 text-sm text-blue-200 opacity-80">
            No credit card required for basic startup profiles.
          </p>
        </div>
      </div>
    </section>
    {/* Footer */}
    <footer className="bg-background-light dark:bg-background-dark pt-16 pb-8 border-t border-slate-200 dark:border-slate-800">
      <div className="flex justify-center">
        <div className="max-w-7xl w-full px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-white">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#0d93f2]/10">
                  <img
                    src={logoGM}
                    alt="GrowMore logo"
                    className="w-6 h-6 object-contain"
                    loading="lazy"
                  />
                </div>
                <span className="text-xl font-bold">GrowMore</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs mb-6">
                Connecting visionary startups with forward-thinking investors.
                The community platform for the next generation of unicorns.
              </p>
              <div className="flex gap-4">
                <a
                  className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-[#0d93f2] hover:text-white transition-colors"
                  href="#"
                >
                  <span className="text-xs font-bold">X</span>
                </a>
                <a
                  className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-[#0d93f2] hover:text-white transition-colors"
                  href="#"
                >
                  <span className="text-xs font-bold">in</span>
                </a>
                <a
                  className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-[#0d93f2] hover:text-white transition-colors"
                  href="#"
                >
                  <span className="text-xs font-bold">fb</span>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">
                Platform
              </h4>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                <li>
                  <a className="hover:text-[#0d93f2]" href="#">
                    Browse Startups
                  </a>
                </li>
                <li>
                  <a className="hover:text-[#0d93f2]" href="#">
                    For Investors
                  </a>
                </li>
                <li>
                  <a className="hover:text-[#0d93f2]" href="#">
                    Pricing
                  </a>
                </li>
                <li>
                  <a className="hover:text-[#0d93f2]" href="#">
                    Success Stories
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">
                Company
              </h4>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                <li>
                  <a className="hover:text-[#0d93f2]" href="#">
                    About Us
                  </a>
                </li>
                <li>
                  <a className="hover:text-[#0d93f2]" href="#">
                    Careers
                  </a>
                </li>
                <li>
                  <a className="hover:text-[#0d93f2]" href="#">
                    Blog
                  </a>
                </li>
                <li>
                  <a className="hover:text-[#0d93f2]" href="#">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">
                Legal
              </h4>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                <li>
                  <a className="hover:text-[#0d93f2]" href="#">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a className="hover:text-[#0d93f2]" href="#">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a className="hover:text-[#0d93f2]" href="#">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a className="hover:text-[#0d93f2]" href="#">
                    Risk Disclosure
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-400 text-center md:text-left">
              © 2023 GrowMore Inc. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs text-slate-400">
              <span>
                Made with <span className="text-red-500">♥</span> for builders
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
    </div>
  );
}

export default Landing;

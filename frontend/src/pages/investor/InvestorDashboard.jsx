import React, { useState, useEffect } from 'react';
import axios from 'axios';

function InvestorDashboard({ go }) {
  const [user, setUser] = useState(null);
  const [deals, setDeals] = useState([]);
  const [stats, setStats] = useState({
    totalInvested: '$4.2M',
    activeDeals: 12,
    portfolioValue: '$8.5M',
    avgROI: '+28%'
  });

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // In a real app, fetch deals from API
    // For now, using mock data
    setDeals([
      {
        id: 1,
        name: 'TechVision AI',
        category: 'AI/ML',
        stage: 'Series A',
        amount: '$2.5M',
        progress: 65,
        investors: 8,
        daysLeft: 12
      },
      {
        id: 2,
        name: 'GreenEnergy Co',
        category: 'CleanTech',
        stage: 'Seed',
        amount: '$500K',
        progress: 80,
        investors: 12,
        daysLeft: 5
      },
      {
        id: 3,
        name: 'HealthHub',
        category: 'HealthTech',
        stage: 'Series B',
        amount: '$5M',
        progress: 45,
        investors: 15,
        daysLeft: 20
      }
    ]);
  }, []);



  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ fontFamily: 'Manrope, sans-serif' }}>
      <aside className="w-72 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111a22] flex-shrink-0 z-20 hidden lg:flex">
        <div className="flex h-full flex-col justify-between p-4">
          <div className="flex flex-col gap-4">
            <div className="flex gap-3 items-center pb-6 border-b border-slate-100 dark:border-slate-800">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 shadow-sm"
                style={{
                  backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCHEMdPDNvg_QW7Pv0gfJgSvzaw1expUAdT6mf4PBx9EXVZnr8hSj-0jMklw7KMxM2z_YbFUEjc_GybZGr0O9rIuxNKWwOh5KvcPIe0SGE7UZmbU-JhPlCGnlX7w69VsRUDyqKu7_U6yq2iQ9aE6jfBSUParP9tGm57pvE02Xk55PDLoDzMhPi0PmHaFv-KiryjuORp1_wZZXqkX0JjMNkQWGNsis_kA8L4hUZioAOD6XpgRGmy5OXeOjIZTB90LybopyvjvhEWvCQ")'
                }}
              />
              <div className="flex flex-col">
                <h1 className="text-slate-900 dark:text-white text-base font-bold leading-normal">
                  {user ? user.name : 'Investor'}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium leading-normal">
                  {user ? user.email : 'Partner at VC Firm'}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <button
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#0d93f2]/10 text-[#0d93f2] group transition-all"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 24 }}>
                  dashboard
                </span>
                <p className="text-sm font-bold leading-normal">Dashboard</p>
              </button>
              <button
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 24 }}>
                  trending_up
                </span>
                <p className="text-sm font-medium leading-normal">Deal Flow</p>
              </button>
              <button
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 24 }}>
                  pie_chart
                </span>
                <p className="text-sm font-medium leading-normal">Portfolio</p>
              </button>
              <button
                onClick={() => go('community')}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 24 }}>
                  groups
                </span>
                <p className="text-sm font-medium leading-normal">Community</p>
              </button>
              <button
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 24 }}>
                  chat
                </span>
                <p className="text-sm font-medium leading-normal">Messages</p>
              </button>
              <button
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 24 }}>
                  notifications
                </span>
                <div className="flex flex-1 items-center justify-between">
                  <p className="text-sm font-medium leading-normal">Notifications</p>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    3
                  </span>
                </div>
              </button>
              <button
                onClick={() => go('settings')}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 24 }}>
                  settings
                </span>
                <p className="text-sm font-medium leading-normal">Settings</p>
              </button>
            </div>
          </div>
          <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-11 px-4 bg-[#0d93f2] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#0b7dd1] transition-colors shadow-lg shadow-blue-500/30">
            <span className="material-symbols-outlined mr-2 text-lg">add</span>
            <span className="truncate">Add New Deal</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col h-full overflow-y-auto relative z-0 bg-[#f5f7f8] dark:bg-[#0d161c]">
        <header className="w-full px-6 pt-6 pb-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Good Morning, {user ? user.name.split(' ')[0] : 'Investor'}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Here's what's happening with your portfolio today.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="size-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                <span className="material-symbols-outlined">search</span>
              </button>
              <button className="size-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 border-2 border-white dark:border-slate-800 text-[10px] font-bold text-white">
                  3
                </span>
              </button>
            </div>
          </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
          <div className="flex flex-col gap-1 rounded-xl p-5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                Total Invested
              </p>
              <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                <span className="material-symbols-outlined text-sm font-bold">
                  trending_up
                </span>
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight">
                $4.2M
              </p>
              <p className="text-green-600 dark:text-green-400 text-xs font-bold">
                +12%
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-1 rounded-xl p-5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                Active Deals
              </p>
              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                <span className="material-symbols-outlined text-sm font-bold">
                  handshake
                </span>
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight">
                12
              </p>
              <p className="text-green-600 dark:text-green-400 text-xs font-bold">
                +2 new
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-1 rounded-xl p-5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                Portfolio Value
              </p>
              <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                <span className="material-symbols-outlined text-sm font-bold">
                  account_balance
                </span>
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight">
                $15.8M
              </p>
              <p className="text-green-600 dark:text-green-400 text-xs font-bold">
                +8%
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-1 rounded-xl p-5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                Pending Invites
              </p>
              <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                <span className="material-symbols-outlined text-sm font-bold">
                  mark_email_unread
                </span>
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight">
                3
              </p>
              <p className="text-red-500 text-xs font-bold">-1</p>
            </div>
          </div>
        </div>
      </header>
      <div className="px-6 py-2 sticky top-0 z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-4 py-2">
          <div className="relative flex-1 min-w-[200px]">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined">
              search
            </span>
            <input
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl h-12 pl-12 pr-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Search startups, founders, or updates..."
            />
          </div>
          <div className="flex gap-2">
            <button className="h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">
                tune
              </span>
              Filters
            </button>
            <button className="h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">
                sort
              </span>
              Sort
            </button>
          </div>
        </div>
        <div className="mt-2 border-b border-slate-200 dark:border-slate-700">
          <div className="flex gap-8">
            <button className="relative pb-3 pt-2 text-primary text-sm font-bold border-b-[3px] border-primary">
              Recommended Startups
            </button>
            <button className="relative pb-3 pt-2 text-slate-500 dark:text-slate-400 text-sm font-medium border-b-[3px] border-transparent hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              Founder Updates
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
                12
              </span>
            </button>
            <button className="relative pb-3 pt-2 text-slate-500 dark:text-slate-400 text-sm font-medium border-b-[3px] border-transparent hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              My Watchlist
            </button>
          </div>
        </div>
      </div>
      <div className="p-6 flex flex-col gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="flex gap-4">
              <div className="size-16 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center overflow-hidden">
                <img
                  alt="Abstract blue geometric logo for CloudScale AI"
                  className="w-full h-full object-cover opacity-80"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZiGLPbOt58XK5xIOuVmXfr4Nu6BVCxUaPOI-SdewQS87fdWS1qw9MiSG0JDrexhOJXIMjTRzQODeij9I5w0JNEB1493zS4xrvQGNDuK0j2Aaqdc05s97PF7Z226HeWaku9FHjnKNpw77EsHG-i4mjr-ya1vLWLasqwQ3BQQ_PK0E9x-RbIWdurfJDah8qt6DNGkP4vGgZ8BpDLDRc7SUMdQUWTxz2xdeqOiFxbXVBnA32mFer4Ipf5uU-MldjKCvEl80264W5jlw"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    CloudScale AI
                  </h3>
                  <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs px-2 py-0.5 rounded-full font-bold">
                    Series A
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                  Automated infrastructure scaling for enterprise cloud
                  environments.
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-700 dark:text-slate-300 px-2 py-1 rounded-md">
                    SaaS
                  </span>
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-700 dark:text-slate-300 px-2 py-1 rounded-md">
                    AI/ML
                  </span>
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-700 dark:text-slate-300 px-2 py-1 rounded-md">
                    San Francisco
                  </span>
                </div>
              </div>
            </div>
            <button className="text-slate-400 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">bookmark</span>
            </button>
          </div>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-slate-700 dark:text-slate-300 font-semibold">
                $1.8M{" "}
                <span className="text-slate-400 font-normal">
                  raised of $2.5M
                </span>
              </span>
              <span className="text-primary font-bold">72%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5">
              <div
                className="bg-primary h-2.5 rounded-full"
                style={{ width: "72%" }}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6 border-t border-b border-slate-100 dark:border-slate-700 py-4">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
                Valuation
              </p>
              <p className="text-slate-900 dark:text-white font-bold mt-0.5">
                $12M Cap
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
                Min Check
              </p>
              <p className="text-slate-900 dark:text-white font-bold mt-0.5">
                $25k
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
                Traction
              </p>
              <p className="text-slate-900 dark:text-white font-bold mt-0.5">
                $85k MRR
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex-1 h-10 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg text-sm transition-colors shadow-lg shadow-blue-500/20">
              Commit to Deal
            </button>
            <button className="h-10 px-4 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-medium rounded-lg text-sm transition-colors">
              View Deck
            </button>
            <button className="h-10 px-4 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-medium rounded-lg text-sm transition-colors">
              Ask Question
            </button>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <div className="flex gap-3">
              <div
                className="size-10 rounded-full bg-cover bg-center"
                data-alt="Portrait of Sarah Chen"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBsukFzqSPJNlyk8me3vWZW75Uq-Z2HG1IDY_PkYQ1uMeN1LFC9xiJ93NEH15Tlj1ISmXkCMfvOw1DqBicWOsScDNOqdOWvbF98lgOPamiMzxiCnbEzbDr4ErG4of6ccCHJMKYhOXlkyz_gEHCabp6oP-kJrbVh6zqm08G9X5-6ROXpIXzs3zFH-gXYRuwz4b1Tv0EKC0TMTVKOssNwUesNg23ljFdpta0An28Lq5Ebz0po4mdLXvFW2JJP9D5W-XMqOjW8c5e-FIA")'
                }}
              />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Sarah Chen{" "}
                  <span className="text-slate-400 font-normal">posted in</span>{" "}
                  Portfolio Updates
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Founder at GreenTech • 2h ago
                </p>
              </div>
            </div>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <span className="material-symbols-outlined">more_horiz</span>
            </button>
          </div>
          <div className="pl-13 ml-13">
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-4">
              Excited to share that we've officially closed our partnership with
              EcoSystems! 🌿 This will expand our distribution to 3 new
              countries in Southeast Asia by Q4. Huge thanks to{" "}
              <span className="text-primary cursor-pointer hover:underline">
                @Alex Venture
              </span>{" "}
              for the intro!
            </p>
            <div className="rounded-xl overflow-hidden mb-4 border border-slate-200 dark:border-slate-700">
              <div
                className="bg-cover bg-center h-48 w-full"
                data-alt="Graph showing upward growth trend on a dashboard"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCKGODnP0RkJFm-6rdbam2U0XFNunoZMhYHpoF9w5CjswJRHyH66t2rJcuOORbdIY_Rk_km_NGRUereVEfNjjHM9S-HGjSXiQiUauU4mi6csIBU2liPD1AvynsxW85rV4DS_bEW2f9ybMaG5VuPTCVbjbkn80VwXl6ipJXhmpjNWdUSut8_Ctf3eBQDwZtwPtoOqmQeatIhG0iH3Wb0zaAhFGvdocXy2dIo1ojdEyukV3xjuq9OTOkrbjjuKBTBUJYUhA_ztWErSw4")'
                }}
              />
              <div className="bg-slate-50 dark:bg-slate-900 p-3">
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Q3 Growth Projections
                </p>
                <p className="text-xs text-slate-500">
                  GreenTech Internal Data
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 pt-2 border-t border-slate-100 dark:border-slate-700">
              <button className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">
                  thumb_up
                </span>
                <span className="text-xs font-bold">24 Likes</span>
              </button>
              <button className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">
                  comment
                </span>
                <span className="text-xs font-bold">5 Comments</span>
              </button>
              <button className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">
                  share
                </span>
                <span className="text-xs font-bold">Share</span>
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow opacity-70 hover:opacity-100">
          <div className="flex justify-between items-start mb-4">
            <div className="flex gap-4">
              <div className="size-16 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/50 flex items-center justify-center">
                <span className="material-symbols-outlined text-orange-500 text-3xl">
                  rocket_launch
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Nebula Space
                  </h3>
                  <span className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs px-2 py-0.5 rounded-full font-bold">
                    Seed
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                  Next-gen propulsion systems for small satellites.
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-700 dark:text-slate-300 px-2 py-1 rounded-md">
                    DeepTech
                  </span>
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-700 dark:text-slate-300 px-2 py-1 rounded-md">
                    Aerospace
                  </span>
                </div>
              </div>
            </div>
            <button className="text-slate-400 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">bookmark_border</span>
            </button>
          </div>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-slate-700 dark:text-slate-300 font-semibold">
                $800k{" "}
                <span className="text-slate-400 font-normal">
                  raised of $3M
                </span>
              </span>
              <span className="text-primary font-bold">26%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5">
              <div
                className="bg-primary h-2.5 rounded-full"
                style={{ width: "26%" }}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex-1 h-10 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 text-primary dark:text-white font-bold rounded-lg text-sm transition-colors">
              Investigate
            </button>
            <button className="h-10 px-4 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-medium rounded-lg text-sm transition-colors">
              Pass
            </button>
          </div>
        </div>
      </div>
      <aside className="w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111a22] flex-shrink-0 hidden xl:flex flex-col overflow-y-auto">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Upcoming Meetings
          </h3>
          <button className="text-primary text-xs font-bold">View All</button>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex gap-3 items-start">
            <div className="flex flex-col items-center bg-slate-50 dark:bg-slate-800 rounded-lg p-2 min-w-[50px] border border-slate-100 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-500">
                Oct
              </span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                24
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                Pitch: FinFlow Series A
              </p>
              <p className="text-xs text-slate-500 mt-0.5">10:00 AM • Zoom</p>
              <div className="flex -space-x-2 mt-2">
                <img
                  alt="Avatar of attendee"
                  className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqyHxs14Ro3jxBgKRavQYXh_Ime9zEPadRZcoZXJjWGBA4Ic8Y-ILb5DvD5ofdYEa6xve0iEFOiLTMrmuCaaOzF-8R5-oo2vv8YWqQidKyMwRh8Vbkaq7TaL34vgWrfvWwLJXiFIZwUqV2k-xIYgNuOFMC9K0j3zGT0vWR_YDbU6Gy1_5-CVr3-pTtD7WW7jAz1f9CtjQreE00YrcgKuN0C37_dEMKY2pNxRiiaEuAENvc4WKi9J0rJ8A8DDkPuPt8FOTZwCBnFjI"
                />
                <img
                  alt="Avatar of attendee"
                  className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVVbOX_zGWyXnPwkJ4CWtNV3jfNaiNJ_1MrvCOb-LccTipnTX6qgx6PLA_cwBlYmT1MR98zgZAsI1QZZj1psltfGeg7SZgi52I1-Pbh2Y85oNZH73io7TQD2fQYC-kbF4cyIAQqzuRnzImVFPGAMx3DMrMByMPR3rgLw9CNFdAiI5eLwGgfOj3_2TcFsBzN8Jekhoi2S_EZtlqwGp1Ju8SkovgDk0ZxBnxVSbIagUDaOwvr5OD04PpZYpzjuL-Q4y5U5WtMYWmvhU"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <div className="flex flex-col items-center bg-slate-50 dark:bg-slate-800 rounded-lg p-2 min-w-[50px] border border-slate-100 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-500">
                Oct
              </span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                25
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                Board Meeting: Healthify
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                2:00 PM • In Person
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          Deal Pipeline
        </h3>
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-slate-500">
                Due Diligence (2)
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 mb-2 hover:border-primary/50 cursor-pointer transition-colors">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  CryptoSecure
                </span>
                <span className="size-2 bg-yellow-400 rounded-full" />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Reviewing financials
              </p>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-slate-500">Term Sheet (1)</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 mb-2 hover:border-primary/50 cursor-pointer transition-colors">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  UrbanFarm
                </span>
                <span className="size-2 bg-green-500 rounded-full" />
              </div>
              <p className="text-xs text-slate-400 mt-1">Awaiting signatures</p>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Top Performers
          </h3>
          <button className="text-slate-400 hover:text-slate-600">
            <span className="material-symbols-outlined text-lg">
              more_horiz
            </span>
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-xs">
                A
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Acme Corp
                </p>
                <p className="text-xs text-slate-500">SaaS</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-green-600">+124%</p>
              <p className="text-xs text-slate-400">ROI</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded bg-pink-100 dark:bg-pink-900 flex items-center justify-center text-pink-600 dark:text-pink-300 font-bold text-xs">
                B
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  BetaLogistics
                </p>
                <p className="text-xs text-slate-500">Logistics</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-green-600">+45%</p>
              <p className="text-xs text-slate-400">ROI</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold text-xs">
                D
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  DataMinds
                </p>
                <p className="text-xs text-slate-500">AI</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-green-600">+12%</p>
              <p className="text-xs text-slate-400">ROI</p>
            </div>
          </div>
        </div>
        <button className="w-full mt-6 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          View Full Portfolio
        </button>
      </div>
    </aside>
      </main>
    </div>
  );
}

export default InvestorDashboard;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Helper function to determine which step to resume from
const getIncompleteProfileStep = () => {
  const saved = localStorage.getItem('profileSetupData');
  if (!saved) {
    return 'profile-step-1'; // Start from beginning if no data
  }
  
  try {
    const data = JSON.parse(saved);
    
    // Check Step 1 completion (Basic Details)
    if (!data.companyName || !data.industry) {
      return 'profile-step-1';
    }
    
    // Check Step 2 completion (Business Details)
    if (!data.problemStatement || !data.solution) {
      return 'profile-step-2';
    }
    
    // Check Step 3 completion (Funding Requirements)
    if (!data.fundingGoal || !data.fundingPurpose) {
      return 'profile-step-3';
    }
    
    // If all steps are complete, return null (profile is complete)
    return null;
  } catch (error) {
    console.error('Error checking profile completion:', error);
    return 'profile-step-1';
  }
};

function StartupDashboard({ user, go }) {
  const [stats, setStats] = useState({
    totalRaised: '$1.2M',
    activeRequests: 3,
    profileViews: 1450,
    investorConnects: 12
  });
  
  const [applications, setApplications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showProfileIncompleteAlert, setShowProfileIncompleteAlert] = useState(false);
  const [resumeStep, setResumeStep] = useState(null);
  
  useEffect(() => {
    // Check if profile setup is incomplete
    const incompleteStep = getIncompleteProfileStep();
    if (incompleteStep) {
      setShowProfileIncompleteAlert(true);
      setResumeStep(incompleteStep);
    }
    
    // Mock data - in production, fetch from API
    setApplications([
      {
        id: 1,
        investor: 'Sequoia Capital',
        date: 'Oct 24, 2023',
        amount: '$2,000,000',
        round: 'Series A',
        status: 'Under Review',
        statusColor: 'yellow'
      },
      {
        id: 2,
        investor: 'Andreessen Horowitz',
        date: 'Oct 10, 2023',
        amount: '$1,500,000',
        round: 'Series A',
        status: 'Meeting Scheduled',
        statusColor: 'blue'
      },
      {
        id: 3,
        investor: 'Y Combinator',
        date: 'Sep 28, 2023',
        amount: '$500,000',
        round: 'Seed',
        status: 'Funded',
        statusColor: 'green'
      }
    ]);
    
    // Fetch notification count
    fetchNotificationCount();
    // Poll for notification updates every 30 seconds
    const interval = setInterval(fetchNotificationCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotificationCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/notifications/unread-count', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotificationCount(response.data.count || 0);
    } catch (error) {
      console.error('Error fetching notification count:', error);
    }
  };



  return (
    <div className="relative flex min-h-screen w-full flex-row bg-[#f5f7f8] dark:bg-[#101b22]" style={{ fontFamily: 'Manrope, sans-serif' }}>
          <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#111a22] md:flex">
            <div className="flex flex-col h-full justify-between">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 px-2 py-2 cursor-pointer" onClick={() => go('landing')}>
                  <div className="aspect-square size-10 rounded-full bg-[#0d93f2]/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#0d93f2]">rocket_launch</span>
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-base font-bold leading-normal text-slate-900 dark:text-white">{user?.name || 'TechNova'}</h1>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Startup</p>
                  </div>
                </div>
                <nav className="flex flex-col gap-2">
                  <button className="flex items-center gap-3 rounded-xl bg-[#0d93f2]/10 px-3 py-3 text-[#0d93f2]">
                    <span className="material-symbols-outlined fill-1" style={{fontVariationSettings: '"FILL" 1'}}>dashboard</span>
                    <span className="text-sm font-bold">Dashboard</span>
                  </button>
                  <button onClick={() => go('startup-profile')} className="group flex items-center gap-3 rounded-xl px-3 py-3 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                    <span className="material-symbols-outlined">person</span>
                    <span className="text-sm font-medium">Profile</span>
                  </button>
                  <button onClick={() => go('startup-funding')} className="group flex items-center gap-3 rounded-xl px-3 py-3 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                    <span className="material-symbols-outlined">monetization_on</span>
                    <span className="text-sm font-medium">Funding Requests</span>
                  </button>
                  <button onClick={() => go('startup-connect')} className="group flex items-center gap-3 rounded-xl px-3 py-3 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                    <span className="material-symbols-outlined">groups</span>
                    <span className="text-sm font-medium">Investor Connect</span>
                  </button>
                  <button onClick={() => go('community')} className="group flex items-center gap-3 rounded-xl px-3 py-3 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                    <span className="material-symbols-outlined">forum</span>
                    <span className="text-sm font-medium">Community Feed</span>
                  </button>
                  <button onClick={() => go('messages')} className="group flex items-center gap-3 rounded-xl px-3 py-3 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                    <span className="material-symbols-outlined">chat</span>
                    <span className="text-sm font-medium">Messages</span>
                  </button>
                  <button onClick={() => go('notifications')} className="group flex items-center gap-3 rounded-xl px-3 py-3 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                    <div className="relative">
                      <span className="material-symbols-outlined">notifications</span>
                      {notificationCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-[#111a22]">{notificationCount}</span>
                      )}
                    </div>
                    <span className="text-sm font-medium">Notifications</span>
                  </button>
                  <button onClick={() => go('settings')} className="group flex items-center gap-3 rounded-xl px-3 py-3 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                    <span className="material-symbols-outlined">settings</span>
                    <span className="text-sm font-medium">Settings</span>
                  </button>
                </nav>
              </div>
              <div className="flex flex-col gap-3 rounded-xl bg-slate-50 p-4 border border-slate-100 dark:bg-slate-800/50 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Profile Strength</p>
                  <span className="text-xs font-bold text-[#0d93f2]">85%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div className="h-full w-[85%] rounded-full bg-[#0d93f2]" />
                </div>
                <button className="text-xs font-medium text-[#0d93f2] hover:underline text-left">Complete Financials →</button>
              </div>
            </div>
          </aside>
          <main className="flex flex-1 flex-col overflow-y-auto px-4 pb-10 pt-4 md:px-10 md:pt-8">
            <div className="mb-6 flex items-center justify-between md:hidden">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-full bg-[#0d93f2]/20 flex items-center justify-center text-[#0d93f2]">
                  <span className="material-symbols-outlined text-sm">rocket_launch</span>
                </div>
                <span className="font-bold text-lg">{user?.name || 'Startup'}</span>
              </div>
              <button className="p-2 text-slate-600 dark:text-slate-300">
                <span className="material-symbols-outlined">menu</span>
              </button>
            </div>
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
              <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Dashboard Overview</h2>
                  <p className="text-base text-slate-500 dark:text-slate-400">Track fundraising, applications, and community pulse.</p>
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:bg-[#111a22] dark:border-slate-700 dark:text-white dark:hover:bg-slate-800">
                    <span className="material-symbols-outlined text-[20px]">add_box</span>
                    New Post
                  </button>
                  <button onClick={() => go('startup-funding')} className="flex items-center gap-2 rounded-lg bg-[#0d93f2] px-4 py-2.5 text-sm font-bold text-white shadow-md transition-colors hover:bg-[#0d93f2]/90">
                    <span className="material-symbols-outlined text-[20px]">request_quote</span>
                    New Funding Request
                  </button>
                </div>
              </div>
              
              {/* Incomplete Profile Alert */}
              {showProfileIncompleteAlert && resumeStep && (
                <div className="flex items-start gap-4 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800/50 dark:bg-amber-900/20">
                  <span className="material-symbols-outlined text-amber-600 dark:text-amber-500 mt-0.5">
                    warning
                  </span>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-amber-900 dark:text-amber-200 mb-1">
                      Complete Your Profile Setup
                    </h3>
                    <p className="text-sm text-amber-800 dark:text-amber-300 mb-3">
                      You haven't completed your startup profile yet. Complete your profile to start connecting with investors and showcase your startup to the community.
                    </p>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => go(resumeStep)}
                        className="flex items-center gap-2 rounded-lg bg-amber-600 hover:bg-amber-700 px-4 py-2 text-sm font-bold text-white transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                        Resume Setup
                      </button>
                      <button 
                        onClick={() => setShowProfileIncompleteAlert(false)}
                        className="flex items-center gap-2 rounded-lg bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-700 px-4 py-2 text-sm font-bold text-amber-900 dark:text-amber-200 hover:bg-amber-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        Remind Me Later
                      </button>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowProfileIncompleteAlert(false)}
                    className="text-amber-600 dark:text-amber-500 hover:text-amber-800 dark:hover:text-amber-300"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#111a22]">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Raised</p>
                    <span className="material-symbols-outlined text-green-500">trending_up</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalRaised}</p>
                  <p className="text-xs font-medium text-green-600">+12% vs last month</p>
                </div>
                <div className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#111a22]">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Requests</p>
                    <span className="material-symbols-outlined text-[#0d93f2]">pending_actions</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.activeRequests}</p>
                  <p className="text-xs font-medium text-slate-400">1 awaiting response</p>
                </div>
                <div className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#111a22]">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Profile Views</p>
                    <span className="material-symbols-outlined text-[#0d93f2]">visibility</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.profileViews.toLocaleString()}</p>
                  <p className="text-xs font-medium text-green-600">+24% this week</p>
                </div>
                <div className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#111a22]">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Investor Connects</p>
                    <span className="material-symbols-outlined text-[#0d93f2]">handshake</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.investorConnects}</p>
                  <p className="text-xs font-medium text-green-600">+5 new</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="flex flex-col gap-4 lg:col-span-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Application Status</h3>
                  <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#111a22]">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-900 dark:bg-slate-800 dark:text-slate-200">
                          <tr>
                            <th className="px-6 py-4 font-bold">Investor / Firm</th>
                            <th className="px-6 py-4 font-bold">Date</th>
                            <th className="px-6 py-4 font-bold">Amount</th>
                            <th className="px-6 py-4 font-bold">Round</th>
                            <th className="px-6 py-4 font-bold">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                          <tr className="group hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="size-8 rounded-full bg-slate-200 bg-cover bg-center" data-alt="Sequoia Capital Logo" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAayWzdHPXSJz0wekzsVpPR_6H7I13ZHnUdPKyqGnBUiY6uKsS3Js-kTrHuYun40S64-TUr-rAOdPGOMTt-qwQHAyRXwa1TKhQJkWrbu5-FxGG6GY3CAeP6ZDAoBi1drlcUS8uFddkkjC0ynNN-Nevmo2auDHdQrOhKgODgHMfQfdht_m0Owtutop2hk5SGTMwP8AwPH5Sb9PfDUJsAkiaKbldNHT6IDzXENlcLy2zjgQVDYdVxTb-15pgUAc1z0aJnSTfcU1OAruc")'}} />
                                <span className="font-medium text-slate-900 dark:text-white">Sequoia Capital</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400">Oct 24, 2023</td>
                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400">$2,000,000</td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800 dark:bg-slate-700 dark:text-slate-300">Series A</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">
                                Under Review
                              </span>
                            </td>
                          </tr>
                          <tr className="group hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="size-8 rounded-full bg-slate-200 bg-cover bg-center" data-alt="Andreessen Horowitz Logo" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDpWr8xOoWdr7VRd02i0pXFhSJYH6vLePZ5JhZqHfIRkysiZqKk84_uXvIfkp3VnIYyq3fiOQnFt5Q7v2Y6gpZxkR7q4L8m-DbekrFuqVVg-OJtO8t8gwt7qJ9b-aWWos7fSzBAdH2AdNY-6UnBL7DH3ef7k7xEiRR0tJiRnYYlICqw_ZSJx5S1xqURd9ECuZgeX4qiLo4Y4JYweFjHh8zEKCtGeXJmSQETqAAElwpsgIjbPKxBfUh9MJoMngjEtCHnKBk4uqVG36k")'}} />
                                <span className="font-medium text-slate-900 dark:text-white">Andreessen Horowitz</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400">Oct 10, 2023</td>
                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400">$1,500,000</td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800 dark:bg-slate-700 dark:text-slate-300">Series A</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center rounded-full bg-[#0d93f2]/20 px-3 py-1 text-xs font-bold text-[#0d93f2]">
                                Meeting Scheduled
                              </span>
                            </td>
                          </tr>
                          <tr className="group hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="size-8 rounded-full bg-slate-200 bg-cover bg-center" data-alt="Y Combinator Logo" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBkpUYauYme7NEnPimRI6Z5t0GwPEO8UKunlJ-oTsmmVQ34l6Ml12OpgBgg9Aya7qMWp-le0KLdKxG7aBYcnoNbSY-88ZIJ8JlQgxyIokA6Ao1bAjDsD1hWXT5ud5xVuZfY2HCnQtb_nQEc1oDh43OwFWryf0_-kupdsQejsKOuwFtbTQ8cgpwwDmBmQnb9w49E5i2XQtq9NTeCm9cUEwkY9l2R_vt-SztPliu_JK9R79A_092G2q7HB-iStN-XanQQrlpr3NPJDnY")'}} />
                                <span className="font-medium text-slate-900 dark:text-white">Y Combinator</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400">Sep 28, 2023</td>
                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400">$500,000</td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800 dark:bg-slate-700 dark:text-slate-300">Seed</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700 dark:bg-green-900/30 dark:text-green-500">
                                Funded
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="border-t border-slate-200 p-4 text-center dark:border-slate-700">
                      <button className="text-sm font-bold text-[#0d93f2] hover:text-blue-600">View All Applications</button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-6 lg:col-span-1">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Community Pulse</h3>
                      <button className="text-sm font-medium text-[#0d93f2] hover:underline">View Feed</button>
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#111a22]">
                        <div className="flex items-start gap-3">
                          <div className="size-10 shrink-0 rounded-full bg-cover bg-center" data-alt="Profile picture of Sarah Chen" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCpUATiDrsnPaRBdWKFy2l3MWXlRC4UU9f77CYllKBvQnI_Ke0Z7uwEUH9alwfOgl9zvP-YvLoWqExxBxFLgb9gaj0RiGqLdAC9Gdvcq1znDUWK2xjWqDA1aLgaOeg5WPmi7O2sH6l0bps2kM_-8QLhrFtt81aMZQZ_Erle907dI33cbfv1NvGVNuRraTnXGSEq3zZoFf_TWOM3o9EjpCz3_eTNgybAC6axY-zSUJF6uQjhb_6Wu9kiKVnfJmYqeSpnAoQSm7rMrjQ")'}} />
                          <div className="flex flex-col">
                            <div className="flex flex-wrap items-baseline gap-1">
                              <p className="text-sm font-bold text-slate-900 dark:text-white">Sarah Chen</p>
                              <span className="text-xs text-slate-500">VC at Alpha Partners</span>
                            </div>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                              Looking for B2B SaaS founders in the logistics space. DM me your decks! 🚀
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 pl-12 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">favorite</span> 12</span>
                          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">mode_comment</span> 4</span>
                          <span>2h ago</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#111a22]">
                        <div className="flex items-start gap-3">
                          <div className="size-10 shrink-0 rounded-full bg-cover bg-center" data-alt="Profile picture of GreenTech Solutions" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC-ONwIXdVB5bzn8CKLOzgcMz_oml3gbJw3BRCZP9-76C_xRZ3aqeDait558Q-685BJgqU_71aaR61vrUVB34Dcjk8pC0o1hqFna2ZwwqxRxXut4uqAZO-0AvL_RnRRSde5zjDePCh5tikvT1_n553QsIWjuCbTwhHHCQEh6dmeWNhjwggh3Hk2CgfKbxZTFtQ5ERk4uHgKYcpYhQNYO5sEFVAofYl0drwOt1LVg8vZyGCPjTxc0qSEsomnx2hEaBY86KXmlFr8g_4")'}} />
                          <div className="flex flex-col">
                            <div className="flex flex-wrap items-baseline gap-1">
                              <p className="text-sm font-bold text-slate-900 dark:text-white">GreenTech Solutions</p>
                              <span className="text-xs text-slate-500">Seed Stage Startup</span>
                            </div>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                              Just closed our seed round! Huge thanks to the community for the support.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 pl-12 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px] text-pink-500 font-variation-settings: 'FILL' 1;">favorite</span> 84</span>
                          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">mode_comment</span> 12</span>
                          <span>5h ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#111a22]">
                    <h4 className="mb-4 text-sm font-bold text-slate-900 dark:text-white">Recommended Investors</h4>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="size-9 rounded-full bg-slate-100 bg-cover bg-center" data-alt="BlackRock Ventures" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAYtC3PLmA1uKbt2GdJ_JtCxKBu6og9D6yzeH_bYOY-0YtH5K7ww0bt2ZyRvflpi2a9xMwy_5DEWymciQCuyv8LLjR5Hhoagi6hvJfy0m-daE61yUgXG0vvf6dmH4wkzDWc8TBGFwSj-uspvPDiT0asJE595C19Yl9Buc_wiSDtz-rByCQywzthUZEMCSHkIiO9fJkbf8uCOcW9ZDB8bYHngSkAOOC6d56DTGe6wmVdq8E6hcOUaKgYyzGehhZVaW7Y9HuRSfRjcnM")'}} />
                          <div className="flex flex-col">
                            <p className="text-sm font-bold text-slate-900 dark:text-white">BlackRock Ventures</p>
                            <p className="text-xs text-slate-500">Fintech Focus</p>
                          </div>
                        </div>
                        <button className="rounded-full bg-[#0d93f2]/10 p-1.5 text-[#0d93f2] hover:bg-[#0d93f2]/20">
                          <span className="material-symbols-outlined text-[20px]">person_add</span>
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="size-9 rounded-full bg-slate-100 bg-cover bg-center" data-alt="BlueSky Capital" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDemHawnCh-JdRNY3v7d1itwR0asjOtEr71b861WgQZy9vXKNfzA-DienUwmmJls2CF-df8p5NTEOAro9tNR6a6p9oZyOX2qeBGh-geI9_e5wc6br1zoph9zh8dqSSblKtrC0nVUbyBT4c8ZBHgVFC00jK_kKQ8Nsr0P7CaM0PzzV2-FwM8z3ei4dWAicaAyFQlwA5b-9ka_EWdooR9s2Am40YD4DJqHYpebA-Hpz1va0Wg8NwaZv5lP2pd5x1BIkqg9P9f_x-QsXs")'}} />
                          <div className="flex flex-col">
                            <p className="text-sm font-bold text-slate-900 dark:text-white">BlueSky Capital</p>
                            <p className="text-xs text-slate-500">Early Stage</p>
                          </div>
                        </div>
                        <button className="rounded-full bg-[#0d93f2]/10 p-1.5 text-[#0d93f2] hover:bg-[#0d93f2]/20">
                          <span className="material-symbols-outlined text-[20px]">person_add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
    );
}

export default StartupDashboard;

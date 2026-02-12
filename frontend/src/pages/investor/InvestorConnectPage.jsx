import React, { useState, useEffect } from 'react';
import client from '../../api/client.js';

export default function InvestorConnectPage({ go, user }) {
  const [connections, setConnections] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [startups, setStartups] = useState([
    {
      id: 1,
      name: 'DataFlow Analytics',
      founder: 'Priya Patel',
      stage: 'Series A',
      match: 95,
      tags: ['Data AI', 'Analytics', 'B2B'],
      logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKKMjwJh93c3tZBJgDu2EUERX5qYTGVh50RQIg8ULZTDtrIlvu1_-0Gs9cMWtOjc3OZY-GvmVdu5kn1LEyp8_hdhe5H35G0NqI3OE37aAQjPnImUwl5kWckTM579c_CVPDWOGrzxdJo_erZpPQBoRBF6Dk4SaqWbHjyzYRcGquBJWRinzM7pFUoK6-NXhCxEmvhiNnSnuZ0_0jLBIWfUzpYamnYk6zBbkqHjw821OHb5QM0rem8jq8qv8Rektk88fNvsLHhWXsMjY'
    },
    {
      id: 2,
      name: 'GreenEnergy Co',
      founder: 'James Lin',
      stage: 'Seed',
      match: 87,
      tags: ['ClimaTech', 'Energy', 'Hardware'],
      logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKKMjwJh93c3tZBJgDu2EUERX5qYTGVh50RQIg8ULZTDtrIlvu1_-0Gs9cMWtOjc3OZY-GvmVdu5kn1LEyp8_hdhe5H35G0NqI3OE37aAQjPnImUwl5kWckTM579c_CVPDWOGrzxdJo_erZpPQBoRBF6Dk4SaqWbHjyzYRcGquBJWRinzM7pFUoK6-NXhCxEmvhiNnSnuZ0_0jLBIWfUzpYamnYk6zBbkqHjw821OHb5QM0rem8jq8qv8Rektk88fNvsLHhWXsMjY'
    },
    {
      id: 3,
      name: 'HealthMind',
      founder: 'Dr. Sarah Khan',
      stage: 'Pre-Seed',
      match: 82,
      tags: ['Healthtech', 'AI', 'Mobile'],
      logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKKMjwJh93c3tZBJgDu2EUERX5qYTGVh50RQIg8ULZTDtrIlvu1_-0Gs9cMWtOjc3OZY-GvmVdu5kn1LEyp8_hdhe5H35G0NqI3OE37aAQjPnImUwl5kWckTM579c_CVPDWOGrzxdJo_erZpPQBoRBF6Dk4SaqWbHjyzYRcGquBJWRinzM7pFUoK6-NXhCxEmvhiNnSnuZ0_0jLBIWfUzpYamnYk6zBbkqHjw821OHb5QM0rem8jq8qv8Rektk88fNvsLHhWXsMjY'
    }
  ]);
  const [messages, setMessages] = useState([
    { id: 1, name: 'Priya Patel', company: 'DataFlow Analytics', message: 'Thanks for your interest!', time: '1h', online: true, unread: false },
    { id: 2, name: 'James Lin', company: 'GreenEnergy Co', message: 'Would love to discuss funding options', time: '3h', online: false, unread: true },
    { id: 3, name: 'Dr. Sarah Khan', company: 'HealthMind', message: 'Can we schedule a call?', time: '1d', online: true, unread: false }
  ]);

  const handleConnect = async (startupId) => {
    try {
      setConnections(prev => ({ ...prev, [startupId]: 'pending' }));
      await client.post('/connections/request', { startupId });
      setConnections(prev => ({ ...prev, [startupId]: 'sent' }));
    } catch (err) {
      console.error('Connection request failed:', err);
      setConnections(prev => ({ ...prev, [startupId]: 'error' }));
    }
  };

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: ".no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }"
        }}
      />
      <div className="flex min-h-screen w-full flex-col">
       

        {/* Main Layout */}
        <div className="mx-auto flex w-full max-w-[1440px] flex-1 gap-6 p-6">
          {/* Left Sidebar */}
          <aside className="hidden lg:flex w-72 flex-col gap-6 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto no-scrollbar">
            {/* Profile Summary */}
            <div className="flex flex-col gap-4 rounded-xl bg-white dark:bg-[#111a22] p-5 shadow-sm border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-full bg-gradient-to-br from-[#0d93f2] to-[#0ea5e9] flex items-center justify-center text-white font-bold">VC</div>
                <div className="flex flex-col">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Capital Ventures</h3>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">$50M Fund • Series A+</p>
                </div>
              </div>
              <div className="flex w-full gap-2">
                <div className="flex flex-1 flex-col items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 py-2">
                  <span className="text-lg font-bold text-slate-900 dark:text-white">28</span>
                  <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400">Portfolio</span>
                </div>
                <div className="flex flex-1 flex-col items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 py-2">
                  <span className="text-lg font-bold text-slate-900 dark:text-white">15</span>
                  <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400">Interests</span>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="flex flex-col rounded-xl bg-white dark:bg-[#111a22] py-3 shadow-sm border border-slate-200 dark:border-slate-800">
              <button onClick={() => go('investor-dashboard')} className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0d93f2] transition-colors">
                <span className="material-symbols-outlined">dashboard</span>
                Dashboard
              </button>
              <button className="flex items-center gap-3 px-5 py-3 text-sm font-bold text-[#0d93f2] bg-[#0d93f2]/10 border-r-2 border-[#0d93f2]">
                <span className="material-symbols-outlined fill-current">rocket_launch</span>
                Discover
              </button>
              <button className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0d93f2] transition-colors">
                <span className="material-symbols-outlined">bookmark</span>
                Saved
              </button>
              <button className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0d93f2] transition-colors">
                <span className="material-symbols-outlined">trending_up</span>
                Portfolio
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col rounded-xl bg-white dark:bg-[#111a22] p-5 shadow-sm border border-slate-200 dark:border-slate-800 gap-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Filters</h4>
                <button className="text-xs font-medium text-[#0d93f2] hover:text-blue-600">Reset</button>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Funding Stage</label>
                {['Pre-Seed', 'Seed', 'Series A', 'Series B'].map((stage) => (
                  <label key={stage} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="size-4 rounded border-slate-300 text-[#0d93f2] focus:ring-[#0d93f2]" defaultChecked={stage === 'Seed'} />
                    <span className="text-sm text-slate-900 dark:text-white group-hover:text-[#0d93f2] transition-colors">{stage}</span>
                  </label>
                ))}
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700" />
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Industry</label>
                {['SaaS', 'Healthtech', 'Fintech', 'ClimaTech'].map((industry) => (
                  <label key={industry} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="size-4 rounded border-slate-300 text-[#0d93f2] focus:ring-[#0d93f2]" defaultChecked={industry === 'SaaS'} />
                    <span className="text-sm text-slate-900 dark:text-white group-hover:text-[#0d93f2] transition-colors">{industry}</span>
                  </label>
                ))}
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700" />
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Match Score</label>
                <input className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0d93f2]" max={100} min={0} type="range" defaultValue="50" />
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
                  <span>50%+</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Center Feed */}
          <main className="flex flex-1 flex-col gap-6 overflow-hidden">
            {/* Search */}
            <div className="relative w-full">
              <div className="flex items-center rounded-xl bg-white dark:bg-[#111a22] p-1 shadow-sm border border-slate-200 dark:border-slate-800 focus-within:ring-2 focus-within:ring-[#0d93f2]/20">
                <div className="flex size-12 items-center justify-center text-slate-600 dark:text-slate-400">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input className="h-12 w-full flex-1 border-none bg-transparent text-base text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:ring-0" placeholder="Search startups by name, industry, or founder..." type="text" />
                <button className="mr-1 rounded-lg bg-[#0d93f2] px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-blue-600 transition-colors">Find</button>
              </div>
            </div>

            {/* Featured Startups */}
            <section>
              <div className="mb-4 flex items-end justify-between px-1">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Featured Startups</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Top matches for your investment portfolio</p>
                </div>
                <button className="text-sm font-bold text-[#0d93f2] hover:underline">View All</button>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {startups.map((startup, idx) => (
                  <div key={startup.id} className="flex min-w-[280px] flex-col overflow-hidden rounded-2xl bg-white dark:bg-[#111a22] shadow-sm border border-slate-200 dark:border-slate-800 transition-transform hover:-translate-y-1 hover:shadow-md">
                    <div className={`relative h-24 w-full bg-gradient-to-r ${idx === 0 ? 'from-blue-100 to-indigo-100' : idx === 1 ? 'from-green-100 to-emerald-100' : 'from-purple-100 to-pink-100'} dark:from-slate-800 dark:to-slate-700`}>
                      <div className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-1 text-xs font-bold text-emerald-600 shadow-sm backdrop-blur-sm">{startup.match}% Match</div>
                    </div>
                    <div className="relative flex flex-col items-center px-5 pb-5">
                      <div className="-mt-12 mb-3 size-24 overflow-hidden rounded-full border-4 border-white dark:border-[#111a22] shadow-sm bg-gradient-to-br from-[#0d93f2] to-[#0ea5e9]" />
                      <div className="mb-1 flex items-center gap-1">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{startup.name}</h3>
                        <span className="material-symbols-outlined text-base text-[#0d93f2]">verified</span>
                      </div>
                      <p className="mb-1 text-center text-xs font-medium text-slate-600 dark:text-slate-400">Founded by {startup.founder}</p>
                      <p className="mb-3 text-center text-xs font-bold text-[#0d93f2]">{startup.stage}</p>
                      <div className="mb-4 flex flex-wrap justify-center gap-2">
                        {startup.tags.map((tag) => (
                          <span key={tag} className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-[10px] font-bold uppercase text-slate-600 dark:text-slate-300">{tag}</span>
                        ))}
                      </div>
                      <div className="grid w-full grid-cols-2 gap-3">
                        <button onClick={() => handleConnect(startup.id)} className="flex items-center justify-center rounded-xl bg-[#0d93f2] px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-600 transition-colors">
                          {connections[startup.id] === 'pending' ? 'Connecting...' : connections[startup.id] === 'sent' ? 'Sent' : 'Interested'}
                        </button>
                        <button onClick={() => go('messages')} className="flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2.5 text-sm font-bold text-slate-900 dark:text-white border border-transparent hover:border-slate-300 dark:hover:border-slate-600 transition-colors">Message</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* All Startups List */}
            <section className="flex flex-col gap-4">
              <h2 className="px-1 text-xl font-bold text-slate-900 dark:text-white">Explore Startups</h2>
              {startups.map((startup) => (
                <div key={startup.id} className="flex flex-col rounded-xl bg-white dark:bg-[#111a22] p-4 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="size-16 rounded-lg bg-gradient-to-br from-[#0d93f2] to-[#0ea5e9] flex-shrink-0" />
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{startup.name}</h3>
                          <span className="text-xs font-bold text-[#0d93f2] bg-[#0d93f2]/10 px-2 py-0.5 rounded">{startup.stage}</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Founded by {startup.founder}</p>
                        <div className="flex flex-wrap gap-2">
                          {startup.tags.map((tag) => (
                            <span key={tag} className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{startup.match}%</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Match</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleConnect(startup.id)} className="rounded-lg bg-[#0d93f2] text-white px-4 py-2 text-sm font-bold hover:bg-blue-600 transition-colors">
                          {connections[startup.id] === 'sent' ? 'Sent' : 'Interest'}
                        </button>
                        <button className="rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Save</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          </main>

          {/* Right Sidebar */}
          <aside className="hidden xl:flex w-80 flex-col gap-6 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto no-scrollbar">
            {/* Messages */}
            <div className="flex flex-col rounded-xl bg-white dark:bg-[#111a22] shadow-sm border border-slate-200 dark:border-slate-800 h-full max-h-[600px]">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 p-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Messages</h4>
                <div className="flex gap-2">
                  <button className="text-slate-600 hover:text-[#0d93f2] dark:text-slate-400">
                    <span className="material-symbols-outlined text-lg">edit_square</span>
                  </button>
                  <button className="text-slate-600 hover:text-[#0d93f2] dark:text-slate-400">
                    <span className="material-symbols-outlined text-lg">more_horiz</span>
                  </button>
                </div>
              </div>
              <div className="flex flex-col flex-1 overflow-y-auto p-2">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <div className="relative">
                      <div className="size-10 rounded-full bg-gradient-to-br from-[#0d93f2] to-[#0ea5e9]" />
                      {msg.online && <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white dark:border-[#111a22] bg-green-500" />}
                    </div>
                    <div className="flex flex-1 flex-col overflow-hidden">
                      <div className="flex justify-between items-baseline">
                        <h5 className="truncate text-sm font-bold text-slate-900 dark:text-white">{msg.name}</h5>
                        <span className="text-[10px] text-slate-600 dark:text-slate-400">{msg.time}</span>
                      </div>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400 truncate">{msg.company}</p>
                      <p className={`truncate text-xs ${msg.unread ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>{msg.message}</p>
                    </div>
                    {msg.unread && <div className="flex size-4 items-center justify-center rounded-full bg-[#0d93f2] text-[10px] font-bold text-white">1</div>}
                  </div>
                ))}
              </div>
            </div>

            {/* Portfolio Stats */}
            <div className="flex flex-col gap-3 rounded-xl bg-white dark:bg-[#111a22] p-4 shadow-sm border border-slate-200 dark:border-slate-800">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Portfolio Overview</h4>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Active Investments</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">28</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Pending Interests</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">12</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Returns</p>
                  <p className="text-sm font-bold text-emerald-600">+24.3%</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

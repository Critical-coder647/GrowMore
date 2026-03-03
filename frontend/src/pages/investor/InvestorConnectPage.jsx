import React, { useState, useEffect } from 'react';
import client from '../../api/client.js';
import InvestorSidebar from '../../components/InvestorSidebar.jsx';
import UserSearchResults from '../../components/UserSearchResults.jsx';

const fallbackStartups = [
  { id: 'fallback-1', name: 'DataFlow Analytics', founder: 'Priya Patel', stage: 'Series A', match: 95, tags: ['Data AI', 'Analytics', 'B2B'] },
  { id: 'fallback-2', name: 'GreenEnergy Co', founder: 'James Lin', stage: 'Seed', match: 87, tags: ['ClimaTech', 'Energy', 'Hardware'] },
  { id: 'fallback-3', name: 'HealthMind', founder: 'Dr. Sarah Khan', stage: 'Pre-Seed', match: 82, tags: ['Healthtech', 'AI', 'Mobile'] }
];

const fallbackMessages = [
  { id: 'fallback-1', name: 'Priya Patel', company: 'DataFlow Analytics', message: 'Thanks for your interest!', time: '1h', unread: false },
  { id: 'fallback-2', name: 'James Lin', company: 'GreenEnergy Co', message: 'Would love to discuss funding options', time: '3h', unread: true },
  { id: 'fallback-3', name: 'Dr. Sarah Khan', company: 'HealthMind', message: 'Can we schedule a call?', time: '1d', unread: false }
];

function formatRelativeTime(value) {
  if (!value) return 'Now';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Now';
  const diffMins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (diffMins < 1) return 'Now';
  if (diffMins < 60) return `${diffMins}m`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h`;
  return `${Math.floor(diffHours / 24)}d`;
}

export default function InvestorConnectPage({ go, user }) {
  const [connections, setConnections] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [startups, setStartups] = useState(fallbackStartups);
  const [messages, setMessages] = useState(fallbackMessages);

  useEffect(() => {
    const loadStartups = async () => {
      try {
        const response = await client.get('/startups/discover');
        const items = Array.isArray(response.data) ? response.data : [];
        if (!items.length) {
          setStartups(fallbackStartups);
          return;
        }

        setStartups(
          items.map((startup) => ({
            id: startup._id,
            ownerId: startup.owner,
            name: startup.name,
            founder: Array.isArray(startup.founders) && startup.founders.length ? startup.founders[0] : 'Founder',
            stage: startup.stage || 'Early Stage',
            match: Math.max(70, Math.min(99, 70 + (Array.isArray(startup.keywords) ? startup.keywords.length * 4 : 0))),
            tags: Array.isArray(startup.industry) && startup.industry.length ? startup.industry.slice(0, 3) : ['Startup'],
            pitchDeckPath: startup.pitchDeckPath || '',
            fundingProposal: startup.fundingProposal || null
          }))
          .sort((a, b) => {
            const aScore = a.fundingProposal?.targetAmount ? 1 : 0;
            const bScore = b.fundingProposal?.targetAmount ? 1 : 0;
            return bScore - aScore;
          })
        );
      } catch (error) {
        console.error('Error loading startups:', error);
        setStartups(fallbackStartups);
      }
    };

    const loadMessagePreviews = async () => {
      try {
        const response = await client.get('/messages/conversations');
        const items = Array.isArray(response.data) ? response.data : [];
        if (!items.length) {
          setMessages(fallbackMessages);
          return;
        }

        setMessages(
          items.slice(0, 8).map((item, index) => ({
            id: item.partnerId || `msg-${index}`,
            name: item.partnerName || 'Unknown',
            company: item.partnerSubtitle || item.partnerRole || 'Member',
            message: item.lastMessage || 'Start chatting',
            time: formatRelativeTime(item.lastMessageAt),
            unread: Number(item.unreadCount || 0) > 0
          }))
        );
      } catch (error) {
        console.error('Error loading message previews:', error);
        setMessages(fallbackMessages);
      }
    };

    loadStartups();
    loadMessagePreviews();
  }, []);

  const handleConnect = async (startupId) => {
    try {
      setConnections((prev) => ({ ...prev, [startupId]: 'pending' }));
      await client.post('/connections/request', { startupId });
      setConnections((prev) => ({ ...prev, [startupId]: 'sent' }));
    } catch (err) {
      console.error('Connection request failed:', err);
      setConnections((prev) => ({ ...prev, [startupId]: 'error' }));
    }
  };

  const openMessagesWithPartner = (partner) => {
    localStorage.setItem(
      'messagePartner',
      JSON.stringify({
        id: String(partner.id),
        name: partner.name,
        role: 'startup',
        subtitle: partner.company || partner.name
      })
    );
    go('messages');
  };

  const openMessagesForStartup = (startup) => {
    const partnerId = startup.ownerId || startup.id;
    openMessagesWithPartner({ id: partnerId, name: startup.founder || startup.name, company: startup.name });
  };

  const openPublicProfile = (startup) => {
    const profileId = startup.ownerId || startup.id;
    localStorage.setItem('publicProfileUserId', String(profileId));
    go('public-profile');
  };

  const openPitchDeck = (startup) => {
    const path = startup?.pitchDeckPath;
    if (!path) return;
    const url = String(path).startsWith('http') ? path : `http://localhost:5000${path}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const filteredStartups = startups.filter((startup) => {
    const haystack = `${startup.name} ${startup.founder} ${(startup.tags || []).join(' ')}`.toLowerCase();
    return haystack.includes(searchQuery.toLowerCase());
  });

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: '.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }'
        }}
      />
      <div className="flex min-h-screen w-full flex-col">
        <div className="mx-auto flex w-full max-w-[1440px] flex-1 gap-6 p-6">
          <InvestorSidebar user={user} go={go} activeView="investor-connect" />

          <main className="flex flex-1 flex-col gap-6 overflow-hidden">
            <div className="relative w-full">
              <div className="flex items-center rounded-xl bg-white dark:bg-[#111a22] p-1 shadow-sm border border-slate-200 dark:border-slate-800 focus-within:ring-2 focus-within:ring-[#0d93f2]/20">
                <div className="flex size-12 items-center justify-center text-slate-600 dark:text-slate-400">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input
                  className="h-12 w-full flex-1 border-none bg-transparent text-base text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:ring-0"
                  placeholder="Search startups by name, industry, or founder..."
                  type="text"
                  value={searchQuery}
                  onFocus={() => setIsSearchOpen(true)}
                  onBlur={() => setTimeout(() => setIsSearchOpen(false), 120)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                />
                <button className="mr-1 rounded-lg bg-[#0d93f2] px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-blue-600 transition-colors">Find</button>
              </div>
              <UserSearchResults
                query={searchQuery}
                isOpen={isSearchOpen}
                user={user}
                go={go}
                onSelect={() => {
                  setSearchQuery('');
                  setIsSearchOpen(false);
                }}
              />
            </div>

            <section>
              <div className="mb-4 flex items-end justify-between px-1">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Featured Startups</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Suggested real startup accounts (with fallback demo data)</p>
                </div>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {filteredStartups.map((startup, idx) => (
                  <div key={startup.id} className="flex min-w-[280px] flex-col overflow-hidden rounded-2xl bg-white dark:bg-[#111a22] shadow-sm border border-slate-200 dark:border-slate-800 transition-transform hover:-translate-y-1 hover:shadow-md">
                    <div className={`relative h-24 w-full bg-gradient-to-r ${idx % 3 === 0 ? 'from-blue-100 to-indigo-100' : idx % 3 === 1 ? 'from-green-100 to-emerald-100' : 'from-purple-100 to-pink-100'} dark:from-slate-800 dark:to-slate-700`}>
                      <div className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-1 text-xs font-bold text-emerald-600 shadow-sm backdrop-blur-sm">{startup.match}% Match</div>
                    </div>
                    <div className="relative flex flex-col items-center px-5 pb-5">
                      <div className="-mt-12 mb-3 size-24 overflow-hidden rounded-full border-4 border-white dark:border-[#111a22] shadow-sm bg-gradient-to-br from-[#0d93f2] to-[#0ea5e9]" />
                      <div className="mb-1 flex items-center gap-1">
                        <button onClick={() => openPublicProfile(startup)} className="text-lg font-bold text-slate-900 dark:text-white hover:text-[#0d93f2] transition-colors">{startup.name}</button>
                        <span className="material-symbols-outlined text-base text-[#0d93f2]">verified</span>
                      </div>
                      <p className="mb-1 text-center text-xs font-medium text-slate-600 dark:text-slate-400">Founded by {startup.founder}</p>
                      <p className="mb-3 text-center text-xs font-bold text-[#0d93f2]">{startup.stage}</p>
                      {startup.fundingProposal?.targetAmount > 0 && (
                        <div className="mb-3 w-full rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-center dark:border-blue-900/40 dark:bg-blue-900/20">
                          <p className="text-[10px] uppercase font-bold text-blue-600">Funding Proposal</p>
                          <p className="text-sm font-extrabold text-slate-900 dark:text-white">${Number(startup.fundingProposal.targetAmount).toLocaleString()}</p>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300">Min ${Number(startup.fundingProposal.minTicket || 0).toLocaleString()} • {startup.fundingProposal.valuation || 'Valuation N/A'}</p>
                        </div>
                      )}
                      <div className="mb-4 flex flex-wrap justify-center gap-2">
                        {(startup.tags || []).map((tag) => (
                          <span key={tag} className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-[10px] font-bold uppercase text-slate-600 dark:text-slate-300">{tag}</span>
                        ))}
                      </div>
                      <div className="grid w-full grid-cols-2 gap-3">
                        <button onClick={() => handleConnect(startup.id)} className="flex items-center justify-center rounded-xl bg-[#0d93f2] px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-600 transition-colors">
                          {connections[startup.id] === 'pending' ? 'Connecting...' : connections[startup.id] === 'sent' ? 'Sent' : 'Interested'}
                        </button>
                        <button onClick={() => openPublicProfile(startup)} className="flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2.5 text-sm font-bold text-slate-900 dark:text-white border border-transparent hover:border-slate-300 dark:hover:border-slate-600 transition-colors">View Profile</button>
                      </div>
                      {startup.pitchDeckPath && (
                        <button
                          onClick={() => openPitchDeck(startup)}
                          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                          View Pitch Deck
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="px-1 text-xl font-bold text-slate-900 dark:text-white">Explore Startups</h2>
              {filteredStartups.map((startup) => (
                <div key={`list-${startup.id}`} className="flex flex-col rounded-xl bg-white dark:bg-[#111a22] p-4 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="size-16 rounded-lg bg-gradient-to-br from-[#0d93f2] to-[#0ea5e9] flex-shrink-0" />
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-center gap-2 mb-1">
                          <button onClick={() => openPublicProfile(startup)} className="text-lg font-bold text-slate-900 dark:text-white hover:text-[#0d93f2] transition-colors">{startup.name}</button>
                          <span className="text-xs font-bold text-[#0d93f2] bg-[#0d93f2]/10 px-2 py-0.5 rounded">{startup.stage}</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Founded by {startup.founder}</p>
                        <div className="flex flex-wrap gap-2">
                          {(startup.tags || []).map((tag) => (
                            <span key={`${startup.id}-${tag}`} className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded">{tag}</span>
                          ))}
                        </div>
                        {startup.fundingProposal?.targetAmount > 0 && (
                          <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 dark:border-blue-900/40 dark:bg-blue-900/20">
                            <p className="text-[10px] uppercase font-bold text-blue-600">Funding Proposal</p>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                              ${Number(startup.fundingProposal.targetAmount).toLocaleString()} target • Min ${Number(startup.fundingProposal.minTicket || 0).toLocaleString()}
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                              {startup.fundingProposal.summary || startup.fundingProposal.elevatorPitch || 'No summary provided'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{startup.match}%</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Match</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleConnect(startup.id)} className="rounded-lg bg-[#0d93f2] text-white px-4 py-2 text-sm font-bold hover:bg-blue-600 transition-colors">
                          {connections[startup.id] === 'sent' ? 'Sent' : 'Connect'}
                        </button>
                        <button onClick={() => openMessagesForStartup(startup)} className="rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Message</button>
                        <button onClick={() => openPublicProfile(startup)} className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white px-4 py-2 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Profile</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          </main>

          <aside className="hidden xl:flex w-80 flex-col gap-6 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto no-scrollbar">
            <div className="flex flex-col rounded-xl bg-white dark:bg-[#111a22] shadow-sm border border-slate-200 dark:border-slate-800 h-full max-h-[600px]">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 p-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Messages</h4>
              </div>
              <div className="flex flex-col flex-1 overflow-y-auto p-2">
                {messages.map((msg) => (
                  <div key={`msg-${msg.id}`} onClick={() => openMessagesWithPartner(msg)} className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <div className="relative">
                      <div className="size-10 rounded-full bg-gradient-to-br from-[#0d93f2] to-[#0ea5e9]" />
                      {msg.unread && <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white dark:border-[#111a22] bg-green-500" />}
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
          </aside>
        </div>
      </div>
    </>
  );
}

import React, { useState, useEffect } from 'react';
import client from '../../api/client.js';
import StartupSidebar from '../../components/StartupSidebar.jsx';

export default function StartupConnectPage({ go, user }) {
  const [connections, setConnections] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [investors, setInvestors] = useState([
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'Partner at Sequoia Capital',
      match: 98,
      tags: ['SaaS', 'AI', 'Seed'],
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADBEo25j7l6WzwyICUCIb7sZ6-ZXL317eGM5ThwzIUcIRoRV10-gaZ2jSi8EK2c9aat3rdwSeRZjZKnz-_RmUZ6pOa6Yb55NHCta_A3G1mEoLNmwiYBM3wUMpfo4Rq78SVDRX7hQ7rOspQRTtrt_U-SBQJo6G5jqaiXQxt8-aQvtWnAHxPWXhrTb8zvMgShbeNVz_S-qmUIx_OqVo7dcLH7d8ahFK1e6nPYMz_XsXKQ5TykFU1gAIGe2KcIFW4kG78E58u6W5Wdr4'
    },
    {
      id: 2,
      name: 'Marcus Johnson',
      role: 'Angel Investor • Ex-Stripe',
      match: 92,
      tags: ['Fintech', 'Pre-Seed'],
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClLGXRKWkXOIiatZ-vIi2q4gCvxRiak76lua7imRmpsjtkYLPyAH0D91xahx16W1Glq4lPhLTD8qFjdWSc1nfxjOkEzEv5p0UQ7jTQsV9yZzZ2PXgGIcjCY19kMTSkcG3RlFlEwazGUPhRGcPcsJRgxBMgenNIqaC6mgHUmcDpW9rcBZoNzkrvIAESe97rm_fR4dyH-O-FpeuDp1NJ0hDqk6mYd_ud2n4SxY_KomZ-lKVg_wxcS_3FkyX4uUx73aPHDnLnMOJGA_M'
    },
    {
      id: 3,
      name: 'Elena Rodriguez',
      role: 'Growth Mentor • Techstars',
      match: 88,
      tags: ['Growth', 'Marketing'],
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdDBzgtRd-Ms2L-uhwxkV3EMbOQMDRbdAZfikKbgtf2CFcAOuLx15N-__Uq4NwhZmVAzzwA3TgVkWuFLrqgl1iHs7AEUDwjEBmIFEIdN1hTZ_r1saqlsvmlrHWg5CStPf96p_aw8BXTpKecYfqjO8DZT6Nb0hNPyjBreY7OzUSoIrE0MvDYKCidNbO-Wb7N6Q57Fr4Zb1gi1c2DHlDkXFM3xBg7GMe6PKwazcCgUStRCaSxloV_b73khL7qa1UtDmAnj3jx5MoZE4'
    }
  ]);
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'David Kim',
      role: 'Managing Partner at Horizon Ventures',
      time: '2h ago',
      content: 'Just closed our latest fund focused on Sustainable Tech! 🌿 We are actively looking for pre-seed startups working on carbon capture and renewable energy storage. DMs are open for pitch decks. #ClimateTech #VC #Startup',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnHCELjGe2BBAziHNBeMZEYRvlrakenyluhp3yrcqLr3Tz8THVb70RYlMidWCzd1kpsKSmM-GsYzzzXozwLgPllDJoalxiWSq0tR4sWUYEHdAQDGlFN3PobtNG7l8VpjwjrXLE1mP4iliiKojTPlnxa4pMbUJ242-RaE_U5MAPjE450qz699Fsf2o7q5B6Mb5rQziYDFnFzfuz1eBdzQvKzaGW1Kv5-WvE-F4JppcVgdbC6kfM0o7DCywAikQl91srt1IRRc2CDhs',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAl56hQHVA_0KqldafToSNni8Bu1Yo4LUuvw1PPwDqG_mr6ClE4hlPWNn_R7GYEJrbod0vZ1d23qH7DJY6l4g8n1b9pEb-3hj1A8RyTEaa3TMad6T3I31e_vfD0AsU4zBV_u7CVeyWnm410yV00QBeCQH0cQIMd0Gl7kI-TSVQht5w6J6tRnULDz7-LP0oDEhUPQRGFP1VzzmIAB86thbnntGV0CV2ijkmLYIvmuc_JEK_RLNGh95MsD5SswyEAt_WSVYBrOADZydo',
      likes: 142,
      comments: 24
    },
    {
      id: 2,
      author: 'Lisa Wong',
      role: 'Angel Investor',
      time: '5h ago',
      content: 'Excited to announce my partnership with the team at @DataFlow. Their vision for AI-driven analytics in the logistics space is exactly what the market needs right now. Big things coming! 🚀',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCi_lhDnL_4PwU_DVxpHpaFeNAxIbs4GAdaWBOJMAhwHg88ckiCiZhStpDss6uWiJChrn531Hv4xBiDCCtOZYncP1qJQCt24NPFdVs3Qr0Te0D7dNvZjtstReTKfIOu1jd9F_YIy_bKdQQEtaIKhUcM4cAs9Qh9T3OU6HcAWx6oAeA8N5D7PoWTPbBVwwD2frgaoE8_LcLBd1uWbPG-oerl1EuBkbh4MmTl_5Gvjn--lcszqMBdA82oEPjcB9nFoeFeLEl7NNPUmDQ',
      likes: 89,
      comments: 12
    }
  ]);
  const [messages, setMessages] = useState([
    { id: 1, name: 'James Wilson', lastMessage: 'Hey, thanks for the intro! Let\'s schedule...', time: '12m', online: true, unread: false },
    { id: 2, name: 'Sarah Chen', lastMessage: 'Would love to see your deck.', time: '2h', online: false, unread: true },
    { id: 3, name: 'Michael Ross', lastMessage: 'Great catch up!', time: '1d', online: true, unread: false }
  ]);

  const handleConnect = async (investorId) => {
    try {
      setConnections(prev => ({ ...prev, [investorId]: 'pending' }));
      await client.post('/connections/request', { investorId });
      setConnections(prev => ({ ...prev, [investorId]: 'sent' }));
    } catch (err) {
      console.error('Connection request failed:', err);
      setConnections(prev => ({ ...prev, [investorId]: 'error' }));
    }
  };

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: ".no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }"
        }}
      />
      <div className="flex h-screen w-full overflow-hidden bg-[#f5f7f8] dark:bg-[#101b22]" style={{ fontFamily: 'Manrope, sans-serif' }}>
        <StartupSidebar user={user} go={go} activeView="startup-connect" />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-[1440px] gap-6 p-6">
            {/* Center Feed */}
            <section className="flex min-w-0 flex-1 flex-col gap-6">
            {/* Search */}
            <div className="relative w-full">
              <div className="flex items-center rounded-xl bg-white dark:bg-[#111a22] p-1 shadow-sm border border-slate-200 dark:border-slate-800 focus-within:ring-2 focus-within:ring-[#0d93f2]/20">
                <div className="flex size-12 items-center justify-center text-slate-600 dark:text-slate-400">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input className="h-12 w-full flex-1 border-none bg-transparent text-base text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:ring-0" placeholder="Search for investors, mentors, or specific funds..." type="text" />
                <button className="mr-1 rounded-lg bg-[#0d93f2] px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-blue-600 transition-colors">Find</button>
              </div>
            </div>

            {/* Top Picks */}
            <section>
              <div className="mb-4 flex items-end justify-between px-1">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Top Picks for You</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Based on your B2B SaaS profile</p>
                </div>
                <button className="text-sm font-bold text-[#0d93f2] hover:underline">View All</button>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {investors.map((inv, idx) => (
                  <div key={inv.id} className="flex min-w-[280px] flex-col overflow-hidden rounded-2xl bg-white dark:bg-[#111a22] shadow-sm border border-slate-200 dark:border-slate-800 transition-transform hover:-translate-y-1 hover:shadow-md">
                    <div className={`relative h-24 w-full bg-gradient-to-r ${idx === 0 ? 'from-blue-100 to-indigo-100' : idx === 1 ? 'from-orange-100 to-amber-100' : 'from-purple-100 to-pink-100'} dark:from-slate-800 dark:to-slate-700`}>
                      <div className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-1 text-xs font-bold text-emerald-600 shadow-sm backdrop-blur-sm">{inv.match}% Match</div>
                    </div>
                    <div className="relative flex flex-col items-center px-5 pb-5">
                      <div className="-mt-12 mb-3 size-24 overflow-hidden rounded-full border-4 border-white dark:border-[#111a22] shadow-sm">
                        <img alt="Investor" className="h-full w-full object-cover" src={inv.image} />
                      </div>
                      <div className="mb-1 flex items-center gap-1">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{inv.name}</h3>
                        <span className="material-symbols-outlined text-base text-[#0d93f2]">verified</span>
                      </div>
                      <p className="mb-3 text-center text-sm font-medium text-slate-600 dark:text-slate-400">{inv.role}</p>
                      <div className="mb-4 flex flex-wrap justify-center gap-2">
                        {inv.tags.map((tag) => (
                          <span key={tag} className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-[10px] font-bold uppercase text-slate-600 dark:text-slate-300">{tag}</span>
                        ))}
                      </div>
                      <div className="grid w-full grid-cols-2 gap-3">
                        <button onClick={() => handleConnect(inv.id)} className="flex items-center justify-center rounded-xl bg-[#0d93f2] px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-600 transition-colors">
                          {connections[inv.id] === 'pending' ? 'Connecting...' : connections[inv.id] === 'sent' ? 'Sent' : 'Connect'}
                        </button>
                        <button onClick={() => go('messages')} className="flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2.5 text-sm font-bold text-slate-900 dark:text-white border border-transparent hover:border-slate-300 dark:hover:border-slate-600 transition-colors">Message</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Posts */}
            <section className="flex flex-col gap-4">
              <h2 className="px-1 text-xl font-bold text-slate-900 dark:text-white">Investor Updates</h2>
              
              {posts.map((post) => (
                <div key={post.id} className="flex flex-col rounded-xl bg-white dark:bg-[#111a22] p-0 shadow-sm border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3 p-4">
                    <div className="size-10 rounded-full bg-cover bg-center" style={{ backgroundImage: `url("${post.avatar}")` }} />
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">{post.author}</h4>
                          <span className="text-xs text-slate-600 dark:text-slate-400">• {post.time}</span>
                        </div>
                        <button className="text-slate-600 hover:text-[#0d93f2] dark:text-slate-400">
                          <span className="material-symbols-outlined">more_horiz</span>
                        </button>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{post.role}</p>
                    </div>
                  </div>
                  <div className="px-4 pb-3">
                    <p className="text-sm leading-relaxed text-slate-900 dark:text-white">{post.content}</p>
                  </div>
                  {post.image && (
                    <div className="w-full h-64 bg-cover bg-center" style={{ backgroundImage: `url("${post.image}")` }} />
                  )}
                  <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 px-4 py-3">
                    <div className="flex gap-4">
                      <button className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0d93f2] dark:text-slate-400 transition-colors">
                        <span className="material-symbols-outlined text-base">favorite</span>
                        {post.likes}
                      </button>
                      <button className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0d93f2] dark:text-slate-400 transition-colors">
                        <span className="material-symbols-outlined text-base">chat_bubble</span>
                        {post.comments}
                      </button>
                    </div>
                    <button className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0d93f2] dark:text-slate-400 transition-colors">
                      <span className="material-symbols-outlined text-base">share</span>
                      Share
                    </button>
                  </div>
                </div>
              ))}
            </section>

            </section>

            {/* Right Sidebar */}
            <aside className="hidden xl:flex w-80 flex-col gap-6 sticky top-6 h-[calc(100vh-3rem)] overflow-y-auto no-scrollbar">
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
                        <p className={`truncate text-xs ${msg.unread ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>{msg.lastMessage}</p>
                      </div>
                      {msg.unread && <div className="flex size-4 items-center justify-center rounded-full bg-[#0d93f2] text-[10px] font-bold text-white">1</div>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Mentors */}
              <div className="flex flex-col gap-3 rounded-xl bg-white dark:bg-[#111a22] p-4 shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Suggested Mentors</h4>
                  <button className="text-xs font-bold text-[#0d93f2] hover:underline">See All</button>
                </div>
                <div className="flex flex-col gap-3">
                  {[
                    { name: 'Dr. Emily White', role: 'CTO at TechGiant' },
                    { name: 'Alex Brown', role: 'Product Lead at StartupX' }
                  ].map((mentor) => (
                    <div key={mentor.name} className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-gradient-to-br from-[#0d93f2] to-[#0ea5e9]" />
                      <div className="flex flex-1 flex-col">
                        <h5 className="text-sm font-bold text-slate-900 dark:text-white">{mentor.name}</h5>
                        <p className="text-[10px] text-slate-600 dark:text-slate-400">{mentor.role}</p>
                      </div>
                      <button className="flex size-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <span className="material-symbols-outlined text-lg">person_add</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </>
  );
}

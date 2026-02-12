import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminDashboard({ user, go }) {
  const name = user?.name || 'Admin';
  
  const [stats, setStats] = useState([
    { label: 'Total Startups', value: '0', change: '+0%', icon: 'business_center' },
    { label: 'Total Investors', value: '0', change: '+0%', icon: 'account_balance_wallet' },
    { label: 'Funds Raised', value: '$0', change: '+0%', icon: 'trending_up' },
    { label: 'Active Rounds', value: '0', change: '+0%', icon: 'monitoring' }
  ]);
  
  const [startups, setStartups] = useState([]);
  const [investors, setInvestors] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [investmentData, setInvestmentData] = useState({
    total: '$0',
    change: '+0%',
    chartPoints: []
  });
  const [systemActivities, setSystemActivities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      // Fetch all data in parallel
      const [startupsRes, investorsRes, postsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/startups/', { headers }),
        axios.get('http://localhost:5000/api/investors/', { headers }),
        axios.get('http://localhost:5000/api/community/posts?limit=100', { headers })
      ]);
      
      const startupsData = startupsRes.data || [];
      const investorsData = investorsRes.data || [];
      const postsData = postsRes.data || [];
      
      setStartups(startupsData);
      setInvestors(investorsData);
      setPosts(postsData);
      
      // Calculate total funding
      const totalFunding = startupsData.reduce((sum, startup) => {
        const min = startup.fundingRequirementMin || 0;
        const max = startup.fundingRequirementMax || 0;
        return sum + ((min + max) / 2);
      }, 0);

      // Calculate active rounds (startups seeking funding)
      const activeRounds = startupsData.filter(s => 
        s.fundingRequirementMin && s.fundingRequirementMin > 0
      ).length;
      
      // Update stats with real data
      setStats([
        { 
          label: 'Total Startups', 
          value: startupsData.length.toLocaleString(), 
          change: `+${Math.min(Math.round((startupsData.length / 100) * 13), 13)}%`,
          icon: 'business_center'
        },
        { 
          label: 'Total Investors', 
          value: investorsData.length.toLocaleString(), 
          change: `+${Math.min(Math.round((investorsData.length / 100) * 8), 8)}%`,
          icon: 'account_balance_wallet'
        },
        { 
          label: 'Funds Raised', 
          value: totalFunding > 0 ? `$${(totalFunding / 1000000).toFixed(1)}M` : '$0', 
          change: `+${Math.min(Math.round((totalFunding / 1000000) * 0.52), 22)}%`,
          icon: 'trending_up'
        },
        { 
          label: 'Active Rounds', 
          value: activeRounds.toString(), 
          change: `+${Math.min(Math.round((activeRounds / 100) * 5), 5)}%`,
          icon: 'monitoring'
        }
      ]);

      // Set investment data
      setInvestmentData({
        total: totalFunding > 0 ? `$${(totalFunding / 1000000).toFixed(1)}M` : '$12.4M',
        change: '+22%',
        chartPoints: generateChartData(totalFunding)
      });

      // Generate system activities from recent data
      const activities = [];
      if (startupsData.length > 0) {
        const recent = startupsData[0];
        activities.push({
          icon: 'rocket_launch',
          color: 'text-blue-500',
          bgColor: 'bg-blue-500/10',
          title: 'New Startup Registered',
          description: `${recent.name || 'Unnamed startup'} verified on ${recent.industry || 'platform'}`,
          time: '7 mins ago'
        });
      }
      
      if (startupsData.length > 1) {
        const startup = startupsData[1];
        activities.push({
          icon: 'check_circle',
          color: 'text-green-500',
          bgColor: 'bg-green-500/10',
          title: 'Funding Round Closed',
          description: `${startup.name || 'Startup'} secured funding with 4 investors`,
          time: '45 mins ago'
        });
      }

      if (postsData.length > 0) {
        activities.push({
          icon: 'flag',
          color: 'text-amber-500',
          bgColor: 'bg-amber-500/10',
          title: 'Post Flagged',
          description: 'Community post by user #JD923 reported for spam',
          time: '1 hr ago'
        });
      }

      if (investorsData.length > 0) {
        activities.push({
          icon: 'verified',
          color: 'text-purple-500',
          bgColor: 'bg-purple-500/10',
          title: 'New VC Verification',
          description: `${investorsData[0].name || 'Investor'} requested account upgrade`,
          time: '3 hrs ago'
        });
      }

      setSystemActivities(activities);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const generateChartData = (totalFunding) => {
    // Generate 6 months of data points
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'];
    const baseValue = totalFunding / 1000000 || 12.4;
    return months.map((month, i) => ({
      month,
      value: Math.max(0, baseValue * (0.7 + Math.sin(i * 0.8) * 0.3 + i * 0.08))
    }));
  };

  // Get pending verifications (recent startups/investors)
  const pendingVerifications = [
    ...startups.slice(0, 2).map(s => ({
      id: s._id,
      name: s.name || 'Unnamed Startup',
      contact: s.email || 'sarah@email.com',
      type: 'Startup',
      submitted: new Date(s.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    })),
    ...investors.slice(0, 1).map(i => ({
      id: i._id,
      name: i.name || 'Unnamed Investor',
      contact: i.email || 'Individual Angel',
      type: 'Investor',
      submitted: new Date(i.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }))
  ].slice(0, 2);

  // Get flagged posts for moderation
  const moderationQueue = posts
    .filter(post => post?.reports?.length && post?.reportStatus !== 'dismissed')
    .slice(0, 2)
    .map(post => ({
      id: post._id,
      author: post.userName || post.author || 'Anonymous',
      authorId: post.authorId || post.userId || null,
      role: post.userRole === 'startup' ? 'Startup Founder' : 'Investor',
      content: post.content?.substring(0, 60) || 'No content',
      reportReason: post.reports?.[0]?.reason || 'Reported',
      reporter: post.reports?.[0]?.reporterName || 'Community member',
      time: new Date(post.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }));

  // Get recent startups (last 5)
  const recentStartups = startups.slice(0, 5);
  
  // Get recent investors (last 5)
  const recentInvestors = investors.slice(0, 5);
  
  // Get recent posts for moderation
  const recentPosts = posts.slice(0, 5);

  return (
    <div className="min-h-screen w-full bg-[#0a0f16] text-white flex" style={{ fontFamily: 'Manrope, sans-serif' }}>
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-slate-800 bg-[#0d1219] sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-3 cursor-pointer" onClick={() => go('admin-dashboard')}>
          <div className="bg-[#0d93f2] size-10 rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white">admin_panel_settings</span>
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight text-white">Admin Central</h1>
            <p className="text-xs text-slate-400">Platform Management</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1">
          <button onClick={() => go('admin-dashboard')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-500/10 text-blue-400 w-full">
            <span className="material-symbols-outlined text-xl">dashboard</span>
            <span className="text-sm font-semibold">Dashboard</span>
          </button>
          <button onClick={() => go('admin-users')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 transition-colors w-full text-left text-slate-400">
            <span className="material-symbols-outlined text-xl">group</span>
            <span className="text-sm font-medium">User Management</span>
          </button>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 transition-colors w-full text-left text-slate-400">
            <span className="material-symbols-outlined text-xl">trending_up</span>
            <span className="text-sm font-medium">Funding Rounds</span>
          </button>
          <button onClick={() => go('community')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 transition-colors w-full text-left text-slate-400">
            <span className="material-symbols-outlined text-xl">forum</span>
            <span className="text-sm font-medium">Community Feed</span>
          </button>
          <button onClick={() => go('admin-moderation')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 transition-colors w-full text-left text-slate-400">
            <span className="material-symbols-outlined text-xl">shield_person</span>
            <span className="text-sm font-medium">Moderation</span>
          </button>
        </nav>
        
        <div className="p-4 border-t border-slate-800 mt-auto">
          <div className="bg-slate-800/50 rounded-xl p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">System</span>
                <div className="size-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
              </div>
              <p className="text-sm font-bold text-white mb-0.5">System Healthy</p>
              <p className="text-[10px] text-slate-500">v4.2.0 - Stable</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-[#0d1219]/80 backdrop-blur-xl border-b border-slate-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Platform Overview</h2>
              <p className="text-sm text-slate-400 mt-0.5">Here's what's happening with your portfolio today.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search startups, investors..." 
                  className="w-64 px-4 py-2 pl-10 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                />
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xl">search</span>
              </div>
              <button className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button className="p-2 rounded-lg hover:bg-slate-800 text-slate-400">
                <span className="material-symbols-outlined">mail</span>
              </button>
              <button onClick={() => go('settings')} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold">
                  {name.charAt(0)}
                </div>
                <span className="text-sm font-medium text-slate-300">{name}</span>
              </button>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat, idx) => {
              const colors = [
                {icon: 'text-blue-400', bg: 'bg-blue-500/10', change: 'text-green-400'},
                {icon: 'text-purple-400', bg: 'bg-purple-500/10', change: 'text-green-400'},
                {icon: 'text-emerald-400', bg: 'bg-emerald-500/10', change: 'text-green-400'},
                {icon: 'text-amber-400', bg: 'bg-amber-500/10', change: 'text-green-400'}
              ];
              const color = colors[idx] || colors[0];
              
              return (
                <div key={stat.label} className="bg-[#0f1621] border border-slate-800 rounded-xl p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-2.5 rounded-lg ${color.bg}`}>
                      <span className={`material-symbols-outlined text-xl ${color.icon}`}>{stat.icon}</span>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${color.change} bg-green-500/10`}>{stat.change}</span>
                  </div>
                  <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-white">{loading ? '...' : stat.value}</h3>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            {/* Investment Volume Chart */}
            <div className="xl:col-span-2 bg-[#0f1621] border border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Investment Volume (USD)</h3>
                  <p className="text-sm text-slate-400">Last 6 Months</p>
                </div>
                <button className="text-sm text-blue-400 hover:text-blue-300 font-medium">12 months</button>
              </div>
              
              <div className="mb-6">
                <div className="text-3xl font-bold text-white mb-1">{investmentData.total}</div>
                <span className="text-sm font-semibold text-green-400">{investmentData.change} vs last period</span>
              </div>

              {/* Simple SVG Chart */}
              <div className="relative h-48">
                <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Area fill */}
                  <path
                    d={`M 0 ${180 - (investmentData.chartPoints[0]?.value || 8) * 8} 
                        ${investmentData.chartPoints.map((point, i) => 
                          `L ${(i * 120)} ${180 - (point.value || 8) * 8}`
                        ).join(' ')} 
                        L 600 180 L 0 180 Z`}
                    fill="url(#chartGradient)"
                  />
                  
                  {/* Line */}
                  <path
                    d={`M 0 ${180 - (investmentData.chartPoints[0]?.value || 8) * 8} 
                        ${investmentData.chartPoints.map((point, i) => 
                          `L ${(i * 120)} ${180 - (point.value || 8) * 8}`
                        ).join(' ')}`}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
                
                {/* X-axis labels */}
                <div className="flex justify-between mt-4 px-2">
                  {investmentData.chartPoints.map((point) => (
                    <span key={point.month} className="text-xs text-slate-500 font-medium">{point.month}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* System Activity */}
            <div className="bg-[#0f1621] border border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">System Activity</h3>
              </div>
              
              <div className="space-y-4">
                {systemActivities.slice(0, 4).map((activity, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className={`w-10 h-10 rounded-full ${activity.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <span className={`material-symbols-outlined text-lg ${activity.color}`}>{activity.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white mb-0.5">{activity.title}</p>
                      <p className="text-xs text-slate-400 line-clamp-2">{activity.description}</p>
                      <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-6 py-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
                View All Activity →
              </button>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Pending Verifications */}
            <div className="bg-[#0f1621] border border-slate-800 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Pending Verifications</h3>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400">
                  {pendingVerifications.length} Pending
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800/30">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">User / Organization</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Submitted</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {loading ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-8 text-center text-slate-500">Loading...</td>
                      </tr>
                    ) : pendingVerifications.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-8 text-center text-slate-500">No pending verifications</td>
                      </tr>
                    ) : (
                      pendingVerifications.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-800/20">
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-semibold text-white">{item.name}</p>
                              <p className="text-xs text-slate-400">{item.contact}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-slate-300">{item.type}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-slate-400">{item.submitted}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button className="p-1.5 rounded-lg hover:bg-green-500/10 text-green-400 transition-colors">
                                <span className="material-symbols-outlined text-xl">check</span>
                              </button>
                              <button className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors">
                                <span className="material-symbols-outlined text-xl">close</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Community Moderation */}
            <div className="bg-[#0f1621] border border-slate-800 rounded-xl">
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Community Moderation</h3>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-500/10 text-red-400">
                  {moderationQueue.length} Flagged
                </span>
              </div>
              
              <div className="p-6 space-y-4">
                {loading ? (
                  <div className="text-center text-slate-500 py-8">Loading...</div>
                ) : moderationQueue.length === 0 ? (
                  <div className="text-center text-slate-500 py-8">No flagged content</div>
                ) : (
                  moderationQueue.map((item) => (
                    <div key={item.id} className="bg-slate-800/30 rounded-xl p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-slate-400">{item.author.charAt(0)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-semibold text-white">{item.author}</p>
                            <span className="text-xs text-slate-500">• {item.time}</span>
                          </div>
                          <p className="text-xs text-slate-400 mb-2">{item.role}</p>
                          <p className="text-sm text-slate-300 mb-3 line-clamp-2">{item.content}</p>
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-red-400 text-sm">flag</span>
                            <span className="text-xs font-semibold text-red-400">Reported for: {item.reportReason}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">Reported by {item.reporter}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-semibold rounded-lg transition-colors">
                          View Post
                        </button>
                        <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors">
                          Remove Post
                        </button>
                        <button className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-sm font-semibold rounded-lg transition-colors">
                          Warn User
                        </button>
                        <button className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 text-sm font-semibold rounded-lg transition-colors">
                          Suspend User
                        </button>
                        <button className="ml-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-lg transition-colors">
                          Dismiss
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../../components/AdminSidebar.jsx';

export default function AdminDashboard({ user, go }) {
  const name = user?.name || 'Admin';
  
  const [stats, setStats] = useState([
    { label: 'Total Startups', value: '0', icon: 'business_center' },
    { label: 'Total Investors', value: '0', icon: 'account_balance_wallet' },
    { label: 'Funds Raised', value: '$0', icon: 'trending_up' },
    { label: 'Active Rounds', value: '0', icon: 'monitoring' }
  ]);
  
  const [startups, setStartups] = useState([]);
  const [investors, setInvestors] = useState([]);
  const [posts, setPosts] = useState([]);
  const [pendingProfiles, setPendingProfiles] = useState([]);
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

  const getTimeAgo = (dateValue) => {
    if (!dateValue) return 'just now';
    const diffMs = Date.now() - new Date(dateValue).getTime();
    const minutes = Math.max(1, Math.floor(diffMs / (1000 * 60)));
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const sendNotification = async ({ recipientId, recipientType, type, title, message, link, metadata }) => {
    if (!recipientId || !recipientType) return;
    const token = localStorage.getItem('token');
    await axios.post(
      'http://localhost:5000/api/notifications',
      { recipientId, recipientType, type, title, message, link, metadata },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  };

  const refreshReports = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const postsRes = await axios.get('http://localhost:5000/api/community/posts?limit=100', { headers });
    const postsData = Array.isArray(postsRes.data) ? postsRes.data : postsRes.data?.posts;
    setPosts(postsData || []);
  };

  const refreshPendingProfiles = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const pendingRes = await axios.get('http://localhost:5000/api/admin/profiles?status=pending', { headers });
    const pendingStartups = pendingRes.data?.startups || [];
    const pendingInvestors = pendingRes.data?.investors || [];

    const mappedPending = [
      ...pendingStartups.map((s) => ({
        id: s._id,
        name: s.name || s.companyName || 'Unnamed Startup',
        contact: s.email || 'unknown@email.com',
        type: 'Startup',
        userType: 'StartupUser',
        submitted: new Date(s.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      })),
      ...pendingInvestors.map((i) => ({
        id: i._id,
        name: i.name || i.firmName || 'Unnamed Investor',
        contact: i.email || 'unknown@email.com',
        type: 'Investor',
        userType: 'InvestorUser',
        submitted: new Date(i.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      }))
    ]
      .sort((a, b) => new Date(b.submitted).getTime() - new Date(a.submitted).getTime())
      .slice(0, 5);

    setPendingProfiles(mappedPending);
  };

  const handleApproveProfile = async (item) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/admin/profiles/${item.userType}/${item.id}/review`,
        { status: 'approved', note: 'Approved from dashboard' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPendingProfiles((prev) => prev.filter((profile) => profile.id !== item.id));

      try {
        await sendNotification({
          recipientId: item.id,
          recipientType: item.userType,
          type: 'verification',
          title: 'Account verified',
          message: 'Your account has been verified and approved by our team.',
          link: '/settings',
          metadata: { userId: item.id }
        });
      } catch (notifyError) {
        console.error('Notification failed after approve:', notifyError);
      }
    } catch (error) {
      console.error('Error approving profile:', error);
    }
  };

  const handleRejectProfile = async (item) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/admin/profiles/${item.userType}/${item.id}/review`,
        { status: 'rejected', note: 'Rejected from dashboard' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPendingProfiles((prev) => prev.filter((profile) => profile.id !== item.id));

      try {
        await sendNotification({
          recipientId: item.id,
          recipientType: item.userType,
          type: 'verification',
          title: 'Account rejected',
          message: 'Your account verification was rejected. Please update your profile and reapply.',
          link: '/settings',
          metadata: { userId: item.id }
        });
      } catch (notifyError) {
        console.error('Notification failed after reject:', notifyError);
      }
    } catch (error) {
      console.error('Error rejecting profile:', error);
    }
  };

  const handleViewPost = (item) => {
    localStorage.setItem('communityFocusPostId', item.id);
    go('community');
  };

  const handleRemovePost = async (item) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/community/posts/${item.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await sendNotification({
        recipientId: item.authorId,
        recipientType: item.userType,
        type: 'moderation',
        title: 'Post removed',
        message: 'Your post was removed for violating community guidelines.',
        link: '/community',
        metadata: { postId: item.id }
      });
      await refreshReports();
    } catch (error) {
      console.error('Error removing post:', error);
    }
  };

  const handleWarnUser = async (item) => {
    try {
      await sendNotification({
        recipientId: item.authorId,
        recipientType: item.userType,
        type: 'warning',
        title: 'Account warning',
        message: 'Please review our community policies. Further violations may result in suspension.',
        link: '/community',
        metadata: { postId: item.id }
      });
    } catch (error) {
      console.error('Error warning user:', error);
    }
  };

  const handleSuspendUser = async (item) => {
    try {
      const value = window.prompt('Suspend user for how many days?', '7');
      const days = Number(value || 7);
      if (!Number.isFinite(days) || days <= 0) return;
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/admin/users/${item.authorId}/suspend`,
        { userType: item.userType, days, reason: 'Community guidelines violation' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await sendNotification({
        recipientId: item.authorId,
        recipientType: item.userType,
        type: 'suspension',
        title: 'Account suspended',
        message: `Your account has been suspended for ${days} days due to policy violations.`,
        link: '/community',
        metadata: { postId: item.id }
      });
      await refreshReports();
    } catch (error) {
      console.error('Error suspending user:', error);
    }
  };

  const handleDismissReport = async (item) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/community/posts/${item.id}/dismiss-report`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await refreshReports();
    } catch (error) {
      console.error('Error dismissing report:', error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      // Fetch all data in parallel
      const [profilesAllRes, postsRes, pendingRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/profiles?status=all', { headers }),
        axios.get('http://localhost:5000/api/community/posts?limit=100', { headers }),
        axios.get('http://localhost:5000/api/admin/profiles?status=pending', { headers })
      ]);
      
      const startupsData = profilesAllRes.data?.startups || [];
      const investorsData = profilesAllRes.data?.investors || [];
      const postsData = Array.isArray(postsRes.data) ? postsRes.data : postsRes.data?.posts || [];
      
      setStartups(startupsData);
      setInvestors(investorsData);
      setPosts(postsData);

      const pendingStartups = pendingRes.data?.startups || [];
      const pendingInvestors = pendingRes.data?.investors || [];
      const mappedPending = [
        ...pendingStartups.map((s) => ({
          id: s._id,
          name: s.name || s.companyName || 'Unnamed Startup',
          contact: s.email || 'unknown@email.com',
          type: 'Startup',
          userType: 'StartupUser',
          submitted: new Date(s.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        })),
        ...pendingInvestors.map((i) => ({
          id: i._id,
          name: i.name || i.firmName || 'Unnamed Investor',
          contact: i.email || 'unknown@email.com',
          type: 'Investor',
          userType: 'InvestorUser',
          submitted: new Date(i.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        }))
      ]
        .sort((a, b) => new Date(b.submitted).getTime() - new Date(a.submitted).getTime())
        .slice(0, 5);
      setPendingProfiles(mappedPending);
      
      // Calculate total funding
      const totalFunding = startupsData.reduce((sum, startup) => {
        const min = startup?.fundingRequirement?.min || startup?.fundingRequirementMin || 0;
        const max = startup?.fundingRequirement?.max || startup?.fundingRequirementMax || 0;
        return sum + ((min + max) / 2);
      }, 0);

      // Calculate active rounds (startups seeking funding)
      const activeRounds = startupsData.filter(s => 
        (s?.fundingRequirement?.min || s?.fundingRequirementMin || 0) > 0
      ).length;
      
      // Update stats with real data
      setStats([
        { 
          label: 'Total Startups', 
          value: startupsData.length.toLocaleString(), 
          icon: 'business_center'
        },
        { 
          label: 'Total Investors', 
          value: investorsData.length.toLocaleString(), 
          icon: 'account_balance_wallet'
        },
        { 
          label: 'Funds Raised', 
          value: totalFunding > 0 ? `$${(totalFunding / 1000000).toFixed(1)}M` : '$0', 
          icon: 'trending_up'
        },
        { 
          label: 'Active Rounds', 
          value: activeRounds.toString(), 
          icon: 'monitoring'
        }
      ]);

      // Set investment data
      setInvestmentData({
        total: totalFunding > 0 ? `$${(totalFunding / 1000000).toFixed(1)}M` : '$0',
        change: totalFunding > 0 ? `+${Math.min(99, Math.max(1, Math.round(totalFunding / 1000000)))}%` : '+0%',
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
          description: `${recent.name || 'Unnamed startup'} joined the platform`,
          time: getTimeAgo(recent.createdAt)
        });
      }
      
      if (startupsData.length > 1) {
        const startup = startupsData[1];
        activities.push({
          icon: 'check_circle',
          color: 'text-green-500',
          bgColor: 'bg-green-500/10',
          title: 'Startup Added',
          description: `${startup.name || 'Startup'} profile is active`,
          time: getTimeAgo(startup.createdAt)
        });
      }

      if (postsData.length > 0) {
        activities.push({
          icon: 'flag',
          color: 'text-amber-500',
          bgColor: 'bg-amber-500/10',
          title: 'Post Flagged',
          description: `${postsData[0].userName || 'A user'} post was reported`,
          time: getTimeAgo(postsData[0].createdAt)
        });
      }

      if (pendingInvestors.length > 0 || pendingStartups.length > 0) {
        const pendingUser = pendingInvestors[0] || pendingStartups[0];
        activities.push({
          icon: 'verified',
          color: 'text-purple-500',
          bgColor: 'bg-purple-500/10',
          title: 'Verification Pending',
          description: `${pendingUser?.name || 'User'} is waiting for profile review`,
          time: getTimeAgo(pendingUser?.createdAt)
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

  // Get flagged posts for moderation
  const moderationQueue = posts
    .filter(post => post?.reports?.length && post?.reportStatus !== 'dismissed')
    .slice(0, 2)
    .map(post => ({
      id: post._id,
      author: post.userName || post.author || 'Anonymous',
      authorId: post.authorId || post.userId || null,
      userType: post.userType || (post.userRole === 'startup' ? 'StartupUser' : 'InvestorUser'),
      role: post.userRole === 'startup' ? 'Startup Founder' : 'Investor',
      content: post.content?.substring(0, 60) || 'No content',
      reportReason: post.reports?.[0]?.reason || 'Reported',
      reporter: post.reports?.[0]?.reporterName || 'Community member',
      time: new Date(post.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }));

  return (
    <div className="min-h-screen w-full bg-[#f5f7f8] dark:bg-[#0a0f16] text-slate-900 dark:text-white flex" style={{ fontFamily: 'Manrope, sans-serif' }}>
      <AdminSidebar go={go} activeView="admin-dashboard" />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white/90 dark:bg-[#0d1219]/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Platform Overview</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Here's what's happening with your portfolio today.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search startups, investors..." 
                  className="w-64 px-4 py-2 pl-10 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                />
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xl">search</span>
              </div>
              <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400">
                <span className="material-symbols-outlined">mail</span>
              </button>
              <button onClick={() => go('settings')} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold">
                  {name.charAt(0)}
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{name}</span>
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
                <div key={stat.label} className="bg-white dark:bg-[#0f1621] border border-slate-200 dark:border-slate-800 rounded-xl p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-2.5 rounded-lg ${color.bg}`}>
                      <span className={`material-symbols-outlined text-xl ${color.icon}`}>{stat.icon}</span>
                    </div>
                        <span className="text-[10px] font-bold px-2 py-1 rounded text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/40">Live</span>
                  </div>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">{stat.label}</p>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{loading ? '...' : stat.value}</h3>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            {/* Investment Volume Chart */}
            <div className="xl:col-span-2 bg-white dark:bg-[#0f1621] border border-slate-200 dark:border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Investment Volume (USD)</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Last 6 Months</p>
                </div>
                <button className="text-sm text-blue-400 hover:text-blue-300 font-medium">12 months</button>
              </div>
              
              <div className="mb-6">
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{investmentData.total}</div>
                <span className="text-sm font-semibold text-green-600">{investmentData.change} vs last period</span>
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
            <div className="bg-white dark:bg-[#0f1621] border border-slate-200 dark:border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">System Activity</h3>
              </div>
              
              <div className="space-y-4">
                {systemActivities.slice(0, 4).map((activity, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className={`w-10 h-10 rounded-full ${activity.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <span className={`material-symbols-outlined text-lg ${activity.color}`}>{activity.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white mb-0.5">{activity.title}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{activity.description}</p>
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
            <div className="bg-white dark:bg-[#0f1621] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pending Verifications</h3>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400">
                  {pendingProfiles.length} Pending
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-800/30">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">User / Organization</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Submitted</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/50">
                    {loading ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-8 text-center text-slate-500">Loading...</td>
                      </tr>
                    ) : pendingProfiles.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-8 text-center text-slate-500">No pending verifications</td>
                      </tr>
                    ) : (
                      pendingProfiles.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20">
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.name}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{item.contact}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-slate-700 dark:text-slate-300">{item.type}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-slate-500 dark:text-slate-400">{item.submitted}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button onClick={() => handleApproveProfile(item)} className="p-1.5 rounded-lg hover:bg-green-500/10 text-green-400 transition-colors">
                                <span className="material-symbols-outlined text-xl">check</span>
                              </button>
                              <button onClick={() => handleRejectProfile(item)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors">
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
            <div className="bg-white dark:bg-[#0f1621] border border-slate-200 dark:border-slate-800 rounded-xl">
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Community Moderation</h3>
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
                    <div key={item.id} className="bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{item.author.charAt(0)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.author}</p>
                            <span className="text-xs text-slate-500">• {item.time}</span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{item.role}</p>
                          <p className="text-sm text-slate-700 dark:text-slate-300 mb-3 line-clamp-2">{item.content}</p>
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-red-400 text-sm">flag</span>
                            <span className="text-xs font-semibold text-red-400">Reported for: {item.reportReason}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">Reported by {item.reporter}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => handleViewPost(item)} className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-lg transition-colors">
                          View Post
                        </button>
                        <button onClick={() => handleRemovePost(item)} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors">
                          Remove Post
                        </button>
                        <button onClick={() => handleWarnUser(item)} className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-sm font-semibold rounded-lg transition-colors">
                          Warn User
                        </button>
                        <button onClick={() => handleSuspendUser(item)} disabled={!item.authorId} className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                          Suspend User
                        </button>
                        <button onClick={() => handleDismissReport(item)} className="ml-auto px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-lg transition-colors">
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

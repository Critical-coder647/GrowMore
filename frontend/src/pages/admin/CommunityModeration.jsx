import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

export default function CommunityModeration({ user, go }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [suspendTarget, setSuspendTarget] = useState(null);
  const [suspendDays, setSuspendDays] = useState(7);
  const [selectedId, setSelectedId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [reasonFilter, setReasonFilter] = useState('all');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get('http://localhost:5000/api/community/posts?limit=200', { headers });
      const data = Array.isArray(res.data) ? res.data : res.data?.posts;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching reported posts:', error);
    } finally {
      setLoading(false);
    }
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
      fetchReports();
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

  const handleSuspendUser = async () => {
    if (!suspendTarget) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/admin/users/${suspendTarget.authorId}/suspend`,
        { userType: suspendTarget.userType, days: suspendDays, reason: 'Community guidelines violation' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await sendNotification({
        recipientId: suspendTarget.authorId,
        recipientType: suspendTarget.userType,
        type: 'suspension',
        title: 'Account suspended',
        message: `Your account has been suspended for ${suspendDays} days due to policy violations.`,
        link: '/community',
        metadata: { postId: suspendTarget.id }
      });
      setSuspendTarget(null);
      fetchReports();
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
      if (item.reports?.length) {
        await Promise.all(
          item.reports.map((report) => sendNotification({
            recipientId: report.reporterId,
            recipientType: report.reporterType,
            type: 'report',
            title: 'Report reviewed',
            message: 'Thanks for the report. We reviewed the content and found no policy violation.',
            link: '/community',
            metadata: { postId: item.id }
          }))
        );
      }
      fetchReports();
    } catch (error) {
      console.error('Error dismissing report:', error);
    }
  };

  const reportedPosts = useMemo(() => {
    const filtered = posts.filter((post) =>
      post?.reports?.length && post?.reportStatus !== 'dismissed'
    );

    const normalized = filtered.map((post) => ({
      id: post._id,
      author: post.userName || post.author || 'Anonymous',
      authorId: post.userId || post.authorId || null,
      userType: post.userType || (post.userRole === 'startup' ? 'StartupUser' : 'InvestorUser'),
      role: post.userRole || 'Member',
      content: post.content || 'No content',
      reason: post.reports?.[0]?.reason || 'Reported by community',
      reporter: post.reports?.[0]?.reporterName || 'Community member',
      reports: post.reports || [],
      time: new Date(post.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }));

    if (!query.trim()) return normalized;
    const q = query.toLowerCase();
    return normalized.filter((item) =>
      item.author.toLowerCase().includes(q) ||
      item.content.toLowerCase().includes(q) ||
      item.reason.toLowerCase().includes(q)
    );
  }, [posts, query]);

  const filteredReports = useMemo(() => {
    return reportedPosts.filter((item) => {
      const reasonMatch = reasonFilter === 'all' || item.reason === reasonFilter;
      const statusMatch = statusFilter === 'all' || statusFilter === 'high';
      return reasonMatch && statusMatch;
    });
  }, [reportedPosts, reasonFilter, statusFilter]);

  useEffect(() => {
    if (!selectedId && filteredReports.length) {
      setSelectedId(filteredReports[0].id);
    }
  }, [filteredReports, selectedId]);

  const selectedReport = filteredReports.find((item) => item.id === selectedId) || filteredReports[0];

  const getSeverity = (reason) => {
    const lower = (reason || '').toLowerCase();
    if (lower.includes('violence') || lower.includes('hate') || lower.includes('suicide') || lower.includes('nudity')) {
      return { label: 'High', color: 'bg-red-500/10 text-red-400 border-red-500/30' };
    }
    if (lower.includes('scam') || lower.includes('fraud') || lower.includes('spam')) {
      return { label: 'Medium', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
    }
    return { label: 'Low', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' };
  };

  const reasonOptions = useMemo(() => {
    const set = new Set(reportedPosts.map((item) => item.reason));
    return ['all', ...Array.from(set)];
  }, [reportedPosts]);

  const stats = useMemo(() => {
    const highCount = filteredReports.filter((item) => getSeverity(item.reason).label === 'High').length;
    const total = filteredReports.length;
    return { total, highCount, queueHealth: total ? Math.min(100, Math.round(100 - (highCount / total) * 100)) : 100 };
  }, [filteredReports]);

  return (
    <div className="min-h-screen w-full bg-[#0a0f16] text-white flex" style={{ fontFamily: 'Manrope, sans-serif' }}>
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
          <button onClick={() => go('admin-dashboard')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 transition-colors w-full text-left text-slate-400">
            <span className="material-symbols-outlined text-xl">dashboard</span>
            <span className="text-sm font-medium">Dashboard</span>
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
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-500/10 text-blue-400 w-full">
            <span className="material-symbols-outlined text-xl">shield_person</span>
            <span className="text-sm font-semibold">Moderation</span>
          </button>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="px-8 py-8">
          <div className="flex items-start justify-between gap-6 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Community Moderation</h2>
              <p className="text-sm text-slate-400 mt-1">{stats.total} Pending Reports needing your attention</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="h-10 px-4 rounded-lg bg-slate-800 text-slate-200 text-sm font-semibold flex items-center gap-2 hover:bg-slate-700">
                <span className="material-symbols-outlined text-base">bolt</span>
                Bulk Actions
              </button>
              <button className="h-10 px-4 rounded-lg bg-[#0d93f2] text-white text-sm font-semibold flex items-center gap-2 hover:bg-blue-600">
                <span className="material-symbols-outlined text-base">history</span>
                View Audit Log
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="relative flex-1 min-w-[240px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">search</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search reports by user, content, or reason..."
                className="h-11 w-full rounded-xl border border-slate-800 bg-[#0b1016] pl-10 pr-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0d93f2]/30"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 rounded-xl border border-slate-800 bg-[#0b1016] px-3 text-sm text-slate-200"
            >
              <option value="all">Status: All</option>
              <option value="high">Status: High</option>
            </select>
            <select
              value={reasonFilter}
              onChange={(e) => setReasonFilter(e.target.value)}
              className="h-11 rounded-xl border border-slate-800 bg-[#0b1016] px-3 text-sm text-slate-200"
            >
              {reasonOptions.map((reason) => (
                <option key={reason} value={reason}>
                  {reason === 'all' ? 'Reason: All' : reason}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-[#0f1621] border border-slate-800 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-12 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-800 px-4 py-3">
              <div className="col-span-1" />
              <div className="col-span-2">Severity</div>
              <div className="col-span-3">Report Details</div>
              <div className="col-span-3">Content Preview</div>
              <div className="col-span-2">Author</div>
              <div className="col-span-1 text-right">Action</div>
            </div>
            <div className="divide-y divide-slate-800">
              {loading ? (
                <div className="text-center text-slate-500 py-10">Loading reports...</div>
              ) : filteredReports.length === 0 ? (
                <div className="text-center text-slate-500 py-10">No reported posts</div>
              ) : (
                filteredReports.map((item) => {
                  const severity = getSeverity(item.reason);
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedId(item.id)}
                      className={`w-full grid grid-cols-12 items-center px-4 py-4 text-left hover:bg-slate-800/40 ${selectedId === item.id ? 'bg-slate-800/30' : ''}`}
                    >
                      <div className="col-span-1">
                        <div className="size-3 rounded-full border border-slate-600" />
                      </div>
                      <div className="col-span-2">
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${severity.color}`}>
                          {severity.label}
                        </span>
                      </div>
                      <div className="col-span-3">
                        <p className="text-sm font-semibold text-slate-100">{item.reporter}</p>
                        <p className="text-xs text-slate-500">Flagged for {item.reason}</p>
                        <p className="text-xs text-blue-400">View Context</p>
                      </div>
                      <div className="col-span-3">
                        <p className="text-sm text-slate-300 line-clamp-1">{item.content}</p>
                      </div>
                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <div className="size-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-semibold text-slate-200">
                            {item.author.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm text-slate-100">{item.author}</p>
                            <p className="text-xs text-slate-500">Joined {item.time}</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-1 text-right text-slate-500">
                        <span className="material-symbols-outlined text-base">chevron_right</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
            <div className="px-4 py-3 text-xs text-slate-500 border-t border-slate-800">Showing {Math.min(filteredReports.length, 3)} of {filteredReports.length} reports</div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-[#0f1621] border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Detailed Preview: {selectedReport?.author || '—'}</h3>
                  <p className="text-xs text-slate-500">Report ID: {selectedReport?.id || '—'} • {selectedReport?.time || ''}</p>
                </div>
                <span className={`rounded-full border px-2 py-0.5 text-xs ${getSeverity(selectedReport?.reason).color}`}>
                  {getSeverity(selectedReport?.reason).label}
                </span>
              </div>
              <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 text-sm text-slate-300 mb-4">
                {selectedReport?.content || 'Select a report to preview content.'}
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => selectedReport && handleDismissReport(selectedReport)} className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 text-sm font-semibold hover:bg-slate-700">
                  Dismiss Report
                </button>
                <button onClick={() => selectedReport && handleWarnUser(selectedReport)} className="px-4 py-2 rounded-lg bg-amber-500/20 text-amber-300 text-sm font-semibold hover:bg-amber-500/30">
                  Warn User
                </button>
                <button onClick={() => selectedReport && handleRemovePost(selectedReport)} className="px-4 py-2 rounded-lg bg-red-500/80 text-white text-sm font-semibold hover:bg-red-600">
                  Delete Post
                </button>
              </div>
            </div>

            <div className="bg-[#0f1621] border border-slate-800 rounded-2xl p-5">
              <h3 className="text-base font-bold text-white mb-4">Moderation Stats</h3>
              <div className="space-y-4">
                <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
                  <p className="text-xs text-slate-500 uppercase font-semibold">Reports Today</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4">
                  <p className="text-xs text-red-400 uppercase font-semibold">High Severity</p>
                  <p className="text-2xl font-bold text-red-300">{stats.highCount}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-2">Queue Health</p>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${stats.queueHealth}%` }} />
                  </div>
                  <p className="text-xs text-slate-400 mt-2">{stats.queueHealth}%</p>
                </div>
                <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 flex items-center gap-3">
                  <div className="size-9 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <span className="material-symbols-outlined">check</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Action Successful</p>
                    <p className="text-xs text-slate-400">User action processed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {suspendTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0d1219] p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold">Suspend User</h4>
              <button onClick={() => setSuspendTarget(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="text-sm text-slate-400 mb-4">Select how long the user should be suspended.</p>
            <label className="text-xs font-semibold uppercase text-slate-500">Duration (days)</label>
            <input
              type="number"
              min="1"
              max="365"
              value={suspendDays}
              onChange={(e) => setSuspendDays(Number(e.target.value))}
              className="mt-2 w-full rounded-lg border border-slate-800 bg-[#0b1016] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#0d93f2]/30"
            />
            <div className="mt-5 flex items-center gap-2">
              <button
                onClick={() => setSuspendTarget(null)}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSuspendUser}
                className="ml-auto rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
              >
                Suspend
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

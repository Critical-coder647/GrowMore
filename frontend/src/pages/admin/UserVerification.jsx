import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import AdminSidebar from '../../components/AdminSidebar.jsx';

export default function UserVerification({ user, go }) {
  const [startups, setStartups] = useState([]);
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [submittingId, setSubmittingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get('http://localhost:5000/api/admin/profiles?status=pending', { headers });
      setStartups(res.data?.startups || []);
      setInvestors(res.data?.investors || []);
    } catch (error) {
      console.error('Error fetching users:', error);
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

  const handleApprove = async (item) => {
    try {
      setSubmittingId(item.id);
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/admin/profiles/${item.userType}/${item.id}/review`,
        { status: 'approved', note: adminNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (item.userType === 'StartupUser') {
        setStartups((prev) => prev.filter((u) => u._id !== item.id));
      } else {
        setInvestors((prev) => prev.filter((u) => u._id !== item.id));
      }
      if (selectedUser?.id === item.id) closePreview();

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
      console.error('Error approving user:', error);
    } finally {
      setSubmittingId(null);
    }
  };

  const handleReject = async (item) => {
    try {
      setSubmittingId(item.id);
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/admin/profiles/${item.userType}/${item.id}/review`,
        { status: 'rejected', note: adminNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (item.userType === 'StartupUser') {
        setStartups((prev) => prev.filter((u) => u._id !== item.id));
      } else {
        setInvestors((prev) => prev.filter((u) => u._id !== item.id));
      }
      if (selectedUser?.id === item.id) closePreview();

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
      console.error('Error rejecting user:', error);
    } finally {
      setSubmittingId(null);
    }
  };

  const pendingUsers = useMemo(() => {
    const mapStartup = startups.map((s) => ({
      id: s._id,
      name: s.name || s.companyName || 'Unnamed Startup',
      email: s.email || 'unknown@email.com',
      role: 'Startup',
      userType: 'StartupUser',
      submitted: new Date(s.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      verificationStatus: s.verificationStatus || 'pending',
      raw: s
    }));
    const mapInvestor = investors.map((i) => ({
      id: i._id,
      name: i.name || i.firmName || 'Unnamed Investor',
      email: i.email || 'unknown@email.com',
      role: 'Investor',
      userType: 'InvestorUser',
      submitted: new Date(i.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      verificationStatus: i.verificationStatus || 'pending',
      raw: i
    }));
    const merged = [...mapStartup, ...mapInvestor];

    const filteredByTab = activeTab === 'startup'
      ? merged.filter((u) => u.userType === 'StartupUser')
      : activeTab === 'investor'
      ? merged.filter((u) => u.userType === 'InvestorUser')
      : merged;

    if (!query.trim()) return filteredByTab;
    const q = query.toLowerCase();
    return filteredByTab.filter((u) =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  }, [startups, investors, activeTab, query]);

  const openPreview = (item) => {
    setSelectedUser(item);
    setAdminNote('');
  };

  const closePreview = () => {
    setSelectedUser(null);
    setAdminNote('');
  };

  const formatCurrency = (value) => {
    if (!value && value !== 0) return '—';
    return `$${Number(value).toLocaleString()}`;
  };

  return (
    <div className="min-h-screen w-full bg-[#f5f7f8] dark:bg-[#101b22] text-slate-900 dark:text-white flex" style={{ fontFamily: 'Manrope, sans-serif' }}>
      <AdminSidebar go={go} activeView="admin-users" />

      <main className="flex-1 overflow-y-auto">
        <div className="px-8 py-8">
          <div className="flex items-start justify-between gap-6 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">User Verification</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Approve or reject new accounts.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="relative flex-1 min-w-[240px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or email"
                className="h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-10 pr-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0d93f2]/20"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`h-11 px-4 rounded-xl text-sm font-semibold ${activeTab === 'all' ? 'bg-blue-500/10 text-blue-600' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('startup')}
                className={`h-11 px-4 rounded-xl text-sm font-semibold ${activeTab === 'startup' ? 'bg-blue-500/10 text-blue-600' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}`}
              >
                Startups
              </button>
              <button
                onClick={() => setActiveTab('investor')}
                className={`h-11 px-4 rounded-xl text-sm font-semibold ${activeTab === 'investor' ? 'bg-blue-500/10 text-blue-600' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}`}
              >
                Investors
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111a22] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-12 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800 px-4 py-3">
              <div className="col-span-4">User</div>
              <div className="col-span-3">Role</div>
              <div className="col-span-3">Submitted</div>
              <div className="col-span-2 text-right">Action</div>
            </div>
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? (
                <div className="text-center text-slate-500 py-10">Loading users...</div>
              ) : pendingUsers.length === 0 ? (
                <div className="text-center text-slate-500 py-10">No pending verifications</div>
              ) : (
                pendingUsers.map((item) => (
                  <div key={item.id} onClick={() => openPreview(item)} className="grid grid-cols-12 items-center px-4 py-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <div className="col-span-4 flex items-center gap-3">
                      <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.email}</p>
                      </div>
                    </div>
                    <div className="col-span-3 text-sm text-slate-600 dark:text-slate-300">{item.role}</div>
                    <div className="col-span-3 text-sm text-slate-500 dark:text-slate-400">{item.submitted}</div>
                    <div className="col-span-2 flex justify-end gap-2">
                      <button onClick={(e) => { e.stopPropagation(); handleReject(item); }} className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700">
                        Reject
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleApprove(item); }} className="px-3 py-1.5 rounded-lg bg-[#0d93f2] text-white text-xs font-semibold hover:bg-blue-600">
                        Approve
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-6xl mx-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111a22] text-slate-900 dark:text-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4">
              <div>
                <p className="text-xs text-slate-500">Review</p>
                <h3 className="text-xl font-bold">{selectedUser.name}</h3>
              </div>
              <button onClick={closePreview} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-5">
                  <div className="flex items-center gap-4">
                    <div className="size-14 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-lg font-semibold text-slate-700 dark:text-slate-200">
                      {selectedUser.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold">{selectedUser.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{selectedUser.role} • {selectedUser.email}</p>
                      <p className="text-xs text-slate-500 mt-1">Joined {selectedUser.submitted}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-5">
                  <h5 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Entity Information</h5>
                  {selectedUser.userType === 'StartupUser' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-slate-500">Startup Name</p>
                        <p className="text-slate-700 dark:text-slate-200">{selectedUser.raw.companyName || selectedUser.raw.name || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Industry</p>
                        <p className="text-slate-700 dark:text-slate-200">{selectedUser.raw.industry?.join(', ') || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Stage</p>
                        <p className="text-slate-700 dark:text-slate-200">{selectedUser.raw.stage || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Funding Range</p>
                        <p className="text-slate-700 dark:text-slate-200">
                          {formatCurrency(selectedUser.raw.fundingRequirement?.min || selectedUser.raw.fundingRequirementMin)} - {formatCurrency(selectedUser.raw.fundingRequirement?.max || selectedUser.raw.fundingRequirementMax)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Location</p>
                        <p className="text-slate-700 dark:text-slate-200">{selectedUser.raw.location || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Website</p>
                        <p className="text-slate-700 dark:text-slate-200">{selectedUser.raw.website || '—'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-xs text-slate-500">Mission Statement</p>
                        <p className="text-slate-600 dark:text-slate-300">{selectedUser.raw.description || '—'}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-slate-500">Firm Name</p>
                        <p className="text-slate-700 dark:text-slate-200">{selectedUser.raw.firmName || selectedUser.raw.name || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Check Size</p>
                        <p className="text-slate-700 dark:text-slate-200">{formatCurrency(selectedUser.raw.checkSize)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Industries</p>
                        <p className="text-slate-700 dark:text-slate-200">{selectedUser.raw.industriesInterestedIn?.join(', ') || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Stage Preferences</p>
                        <p className="text-slate-700 dark:text-slate-200">{selectedUser.raw.stagePreferences?.join(', ') || '—'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-xs text-slate-500">Thesis</p>
                        <p className="text-slate-600 dark:text-slate-300">{selectedUser.raw.thesis || '—'}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-5">
                  <h5 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Submitted Documents</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedUser.raw.pitchDeckUrl && (
                      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 text-sm">
                        <p className="text-slate-700 dark:text-slate-200 font-semibold">Pitch Deck</p>
                        <p className="text-xs text-slate-500 mt-1">{selectedUser.raw.pitchDeckUrl}</p>
                        <button className="mt-3 w-full rounded-lg bg-slate-100 dark:bg-slate-800 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200">View Document</button>
                      </div>
                    )}
                    {selectedUser.raw.logoUrl && (
                      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 text-sm">
                        <p className="text-slate-700 dark:text-slate-200 font-semibold">Logo</p>
                        <p className="text-xs text-slate-500 mt-1">{selectedUser.raw.logoUrl}</p>
                        <button className="mt-3 w-full rounded-lg bg-slate-100 dark:bg-slate-800 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200">View Document</button>
                      </div>
                    )}
                    {!selectedUser.raw.pitchDeckUrl && !selectedUser.raw.logoUrl && (
                      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 text-sm text-slate-500">
                        No documents provided.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-5 h-fit">
                <h5 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Verification Action</h5>
                <div className="mb-4">
                  <p className="text-xs text-slate-500">Current Status</p>
                  <div className="mt-2 h-10 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex items-center px-3 text-sm text-slate-600 dark:text-slate-300">
                    {(selectedUser.verificationStatus || 'pending').replace(/^./, (c) => c.toUpperCase())}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="text-xs text-slate-500">Admin Feedback (Optional)</label>
                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Provide reason for approval/rejection"
                    className="mt-2 w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-3 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0d93f2]/20"
                    rows="4"
                  />
                </div>
                <div className="space-y-2">
                  <button disabled={submittingId === selectedUser.id} onClick={() => handleApprove(selectedUser)} className="w-full rounded-xl bg-[#0d93f2] py-2.5 text-sm font-semibold hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed">
                    Approve Verification
                  </button>
                  <button className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700">
                    Request More Info
                  </button>
                  <button disabled={submittingId === selectedUser.id} onClick={() => handleReject(selectedUser)} className="w-full rounded-xl bg-red-500/10 py-2.5 text-sm font-semibold text-red-300 hover:bg-red-500/20 disabled:opacity-60 disabled:cursor-not-allowed">
                    Reject Application
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

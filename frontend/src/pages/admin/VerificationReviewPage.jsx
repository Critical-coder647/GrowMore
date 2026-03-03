import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import AdminSidebar from '../../components/AdminSidebar.jsx';

function formatCurrency(value) {
  if (value === undefined || value === null || value === '') return '—';
  return `$${Number(value).toLocaleString()}`;
}

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function toAssetUrl(value) {
  if (!value) return '';
  if (String(value).startsWith('http')) return value;
  if (String(value).startsWith('/uploads/')) return `http://localhost:5000${value}`;
  return value;
}

export default function VerificationReviewPage({ user, go }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState('pending');
  const [submitting, setSubmitting] = useState(false);

  const targetRaw = localStorage.getItem('adminVerificationTarget');
  const target = targetRaw ? JSON.parse(targetRaw) : null;

  useEffect(() => {
    const loadProfile = async () => {
      if (!target?.id || !target?.userType) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:5000/api/admin/profiles/${target.userType}/${target.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = response.data || null;
        setProfile(data);
        setStatus((data?.verificationStatus || 'pending').toLowerCase());
      } catch (error) {
        console.error('Error loading verification profile:', error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [target?.id, target?.userType]);

  const roleLabel = useMemo(() => {
    if (!target?.userType) return 'User';
    return target.userType === 'StartupUser' ? 'Startup' : 'Investor';
  }, [target?.userType]);

  const handleReview = async (nextStatus) => {
    if (!target?.id || !target?.userType) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/admin/profiles/${target.userType}/${target.id}/review`,
        { status: nextStatus, note: feedback },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStatus(nextStatus);
      go('admin-users');
    } catch (error) {
      console.error('Error reviewing profile:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const openPublicProfile = () => {
    if (!target?.id) return;
    localStorage.setItem('publicProfileUserId', String(target.id));
    go('public-profile');
  };

  const contactUser = () => {
    if (!profile?._id) return;
    localStorage.setItem(
      'messagePartner',
      JSON.stringify({
        id: String(profile._id),
        name: profile.name || profile.companyName || profile.firmName || 'User',
        role: target?.userType === 'StartupUser' ? 'startup' : 'investor',
        subtitle: target?.userType === 'StartupUser' ? profile.companyName || 'Startup' : profile.firmName || 'Investor'
      })
    );
    go('messages');
  };

  if (loading) {
    return <div className="min-h-screen grid place-items-center text-slate-500">Loading verification review...</div>;
  }

  if (!profile || !target) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Verification profile not found.</p>
          <button onClick={() => go('admin-users')} className="h-10 rounded-lg bg-[#0d93f2] px-4 text-sm font-bold text-white">
            Back to Verifications
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#f5f7f8] dark:bg-[#101b22] text-slate-900 dark:text-white flex" style={{ fontFamily: 'Manrope, sans-serif' }}>
      <AdminSidebar go={go} activeView="admin-users" />

      <main className="flex-1 overflow-y-auto">
        <div className="border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#0d1219]/90 backdrop-blur px-6 py-4">
          <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
            <button
              onClick={() => go('admin-users')}
              className="hover:text-[#0d93f2] transition-colors"
            >
              Verifications
            </button>
            <span>›</span>
            <span className="font-medium text-slate-600 dark:text-slate-300">
              {profile.name || profile.companyName || profile.firmName}
            </span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold leading-tight">Review: {profile.name || profile.companyName || profile.firmName}</h1>
              <p className="text-sm text-slate-500 mt-2">
                Application submitted on {formatDate(profile.createdAt)} • Case ID: #{String(profile._id).slice(-6)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={openPublicProfile} className="h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm font-semibold">
                View Profile Site
              </button>
              <button onClick={contactUser} className="h-10 rounded-full bg-[#0d93f2] px-4 text-sm font-semibold text-white">
                Contact User
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-6">
          <section className="space-y-6">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111a22] p-5">
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl font-bold">
                  {(profile.name || profile.companyName || profile.firmName || 'U').charAt(0)}
                </div>
                <div>
                  <p className="text-2xl font-bold">{profile.name || profile.companyName || profile.firmName}</p>
                  <p className="text-sm text-[#0d93f2]">{target.userType === 'StartupUser' ? `Founder & CEO at ${profile.companyName || profile.name}` : `Partner at ${profile.firmName || profile.name}`}</p>
                  <p className="text-xs text-slate-500 mt-1">{profile.location || 'Location not provided'} • Joined {formatDate(profile.createdAt)}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111a22] p-5">
              <h3 className="text-2xl font-bold mb-4">Entity Information</h3>

              {target.userType === 'StartupUser' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-slate-500">Startup Name</p>
                    <p className="mt-1 font-semibold">{profile.companyName || profile.name || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-slate-500">Industry</p>
                    <p className="mt-1 font-semibold">{profile.industry?.join(', ') || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-slate-500">Stage</p>
                    <p className="mt-1 font-semibold">{profile.stage || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-slate-500">Funding</p>
                    <p className="mt-1 font-semibold">{formatCurrency(profile.fundingRequirement?.min)} - {formatCurrency(profile.fundingRequirement?.max)}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-[11px] uppercase tracking-wider text-slate-500">Mission Statement</p>
                    <p className="mt-1 text-slate-600 dark:text-slate-300">{profile.description || 'No mission statement provided.'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-slate-500">Website</p>
                    <p className="mt-1 font-semibold break-all">{profile.website || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-slate-500">Location</p>
                    <p className="mt-1 font-semibold">{profile.location || '—'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-[11px] uppercase tracking-wider text-slate-500">Problem Statement</p>
                    <p className="mt-1 text-slate-600 dark:text-slate-300">{profile.problemStatement || '—'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-[11px] uppercase tracking-wider text-slate-500">Solution</p>
                    <p className="mt-1 text-slate-600 dark:text-slate-300">{profile.solution || '—'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-[11px] uppercase tracking-wider text-slate-500">Funding Purpose</p>
                    <p className="mt-1 text-slate-600 dark:text-slate-300">{profile.fundingPurpose || '—'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-[11px] uppercase tracking-wider text-slate-500">Usage Breakdown</p>
                    <p className="mt-1 text-slate-600 dark:text-slate-300">{profile.usageBreakdown || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-slate-500">TAM</p>
                    <p className="mt-1 font-semibold">{profile.tam || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-slate-500">SAM</p>
                    <p className="mt-1 font-semibold">{profile.sam || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-slate-500">SOM</p>
                    <p className="mt-1 font-semibold">{profile.som || '—'}</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-slate-500">Firm Name</p>
                    <p className="mt-1 font-semibold">{profile.firmName || profile.name || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-slate-500">Check Size</p>
                    <p className="mt-1 font-semibold">{formatCurrency(profile.checkSize)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-slate-500">Industries</p>
                    <p className="mt-1 font-semibold">{profile.industriesInterestedIn?.join(', ') || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-slate-500">Stages</p>
                    <p className="mt-1 font-semibold">{profile.stagePreferences?.join(', ') || '—'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-[11px] uppercase tracking-wider text-slate-500">Thesis</p>
                    <p className="mt-1 text-slate-600 dark:text-slate-300">{profile.thesis || 'No thesis provided.'}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111a22] p-5">
              <h3 className="text-2xl font-bold mb-4">Submitted Documents</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(profile.pitchDeckUrl || profile.logoUrl) ? (
                  <>
                    {profile.pitchDeckUrl && (
                      <a href={toAssetUrl(profile.pitchDeckUrl)} target="_blank" rel="noreferrer" className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-4 text-sm hover:border-[#0d93f2]">
                        <p className="font-semibold">Pitch Deck</p>
                        <p className="text-xs text-slate-500 mt-1 truncate">{toAssetUrl(profile.pitchDeckUrl)}</p>
                        <p className="mt-3 text-xs font-semibold text-[#0d93f2]">View Document</p>
                      </a>
                    )}
                    {profile.logoUrl && (
                      <a href={toAssetUrl(profile.logoUrl)} target="_blank" rel="noreferrer" className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-4 text-sm hover:border-[#0d93f2]">
                        <p className="font-semibold">Logo / ID Asset</p>
                        <p className="text-xs text-slate-500 mt-1 truncate">{toAssetUrl(profile.logoUrl)}</p>
                        <p className="mt-3 text-xs font-semibold text-[#0d93f2]">View Document</p>
                      </a>
                    )}
                  </>
                ) : (
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-4 text-sm text-slate-500">
                    No documents uploaded.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111a22] p-5">
              <h3 className="text-2xl font-bold mb-4">Verification History</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold">Application Received</p>
                  <p className="text-xs text-slate-500">{formatDate(profile.createdAt)}</p>
                </div>
                <div>
                  <p className="font-semibold">Current Status: <span className="capitalize">{status}</span></p>
                  <p className="text-xs text-slate-500">Last reviewed: {formatDate(profile.verificationReviewedAt)}</p>
                </div>
              </div>
            </div>
          </section>

          <aside className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111a22] p-5 h-fit sticky top-6">
            <h3 className="text-2xl font-bold mb-4">Verification Action</h3>
            <div className="mb-4">
              <p className="text-xs text-slate-500">Current Status</p>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="mt-2 h-10 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm"
              >
                <option value="pending">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="mb-4">
              <p className="text-xs text-slate-500">Admin Feedback (Optional)</p>
              <textarea
                rows={4}
                value={feedback}
                onChange={(event) => setFeedback(event.target.value)}
                placeholder="Provide reason for approval/rejection or missing documents..."
                className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-sm"
              />
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleReview('approved')}
                disabled={submitting}
                className="w-full h-11 rounded-full bg-[#0d93f2] text-white text-sm font-bold disabled:opacity-60"
              >
                Approve Verification
              </button>
              <button
                onClick={() => handleReview('pending')}
                disabled={submitting}
                className="w-full h-11 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold text-slate-700 dark:text-slate-200 disabled:opacity-60"
              >
                Request More Info
              </button>
              <button
                onClick={() => handleReview('rejected')}
                disabled={submitting}
                className="w-full h-11 rounded-full border border-red-200 bg-red-50 text-red-700 text-sm font-bold disabled:opacity-60"
              >
                Reject Application
              </button>
            </div>

            <button
              onClick={() => go('admin-users')}
              className="mt-4 w-full h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm font-semibold"
            >
              Back to Verification List
            </button>

            <p className="text-[10px] text-slate-400 mt-4">Shortcuts: A (Approve) / R (Reject)</p>
          </aside>
        </div>
      </main>
    </div>
  );
}

import React, { useEffect, useMemo, useState } from 'react';
import client from '../api/client.js';

function money(value) {
  return `$${Number(value || 0).toLocaleString()}`;
}

export default function PublicProfilePreview({ go, user, profileUserId }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionInfo, setConnectionInfo] = useState({
    relationship: 'none',
    requestId: null,
    connectionId: null,
    myConnectionCount: 0,
    targetConnectionCount: 0
  });
  const [connectionBusy, setConnectionBusy] = useState(false);

  const resolvedProfileId = profileUserId || localStorage.getItem('publicProfileUserId');

  useEffect(() => {
    const loadProfile = async () => {
      if (!resolvedProfileId) {
        setLoading(false);
        setProfile(null);
        return;
      }

      try {
        setLoading(true);
        const response = await client.get(`/auth/public-profile/${resolvedProfileId}`);
        setProfile(response.data || null);
      } catch (error) {
        console.error('Error loading public profile:', error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [resolvedProfileId]);

  const isOwnProfile = String(user?.id) === String(profile?.id);
  const isStartupProfile = profile?.role === 'startup';
  const isInvestorProfile = profile?.role === 'investor';

  const messageTarget = useMemo(() => {
    if (!profile) return null;
    return {
      id: profile.id,
      name: profile.name,
      role: profile.role,
      subtitle: profile.subtitle
    };
  }, [profile]);

  const handleMessage = () => {
    if (!messageTarget || isOwnProfile) return;
    localStorage.setItem('messagePartner', JSON.stringify(messageTarget));
    go('messages');
  };

  const handleConnect = async () => {
    if (!profile || isOwnProfile || !user?.role || user.role === 'admin') return;

    try {
      setConnectionBusy(true);
      const payload = user.role === 'startup' ? { investorId: profile.id } : { startupId: profile.id };
      await client.post('/connections/request', payload);
      await refreshConnectionStatus();
    } catch (error) {
      console.error('Connection request failed:', error);
    } finally {
      setConnectionBusy(false);
    }
  };

  const refreshConnectionStatus = async () => {
    if (!profile?.id || isOwnProfile) return;
    try {
      const response = await client.get(`/connections/status/${profile.id}`);
      setConnectionInfo((prev) => ({ ...prev, ...(response.data || {}) }));
    } catch (error) {
      console.error('Error loading connection status:', error);
    }
  };

  const handleAcceptConnection = async () => {
    if (!connectionInfo.requestId) return;
    try {
      setConnectionBusy(true);
      await client.post(`/connections/accept/${connectionInfo.requestId}`);
      await refreshConnectionStatus();
    } catch (error) {
      console.error('Error accepting connection:', error);
    } finally {
      setConnectionBusy(false);
    }
  };

  const handleIgnoreConnection = async () => {
    if (!connectionInfo.requestId) return;
    try {
      setConnectionBusy(true);
      await client.post(`/connections/reject/${connectionInfo.requestId}`);
      await refreshConnectionStatus();
    } catch (error) {
      console.error('Error ignoring connection:', error);
    } finally {
      setConnectionBusy(false);
    }
  };

  const handleWithdrawConnection = async () => {
    if (!connectionInfo.requestId) return;
    try {
      setConnectionBusy(true);
      await client.delete(`/connections/request/${connectionInfo.requestId}`);
      await refreshConnectionStatus();
    } catch (error) {
      console.error('Error withdrawing connection request:', error);
    } finally {
      setConnectionBusy(false);
    }
  };

  const handleRemoveConnection = async () => {
    if (!connectionInfo.connectionId) return;
    try {
      setConnectionBusy(true);
      await client.delete(`/connections/${connectionInfo.connectionId}`);
      await refreshConnectionStatus();
    } catch (error) {
      console.error('Error removing connection:', error);
    } finally {
      setConnectionBusy(false);
    }
  };

  const handleOpenWebsite = () => {
    if (!profile?.website) return;
    window.open(profile.website, '_blank', 'noopener,noreferrer');
  };

  const handleOpenPitchDeck = () => {
    const rawPath = profile?.startup?.pitchDeckPath;
    if (!rawPath) return;
    const normalized = String(rawPath).replace(/\\/g, '/');
    const fileName = normalized.split('/').pop();
    if (!fileName) return;
    window.open(`http://localhost:5000/uploads/${fileName}`, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    if (!profile?.id || isOwnProfile) return;
    refreshConnectionStatus();
  }, [profile?.id, isOwnProfile]);

  if (loading) {
    return <div className="min-h-screen grid place-items-center text-slate-500">Loading profile...</div>;
  }

  if (!profile) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Profile not found.</p>
          <button onClick={() => go(user?.role === 'startup' ? 'startup-dashboard' : user?.role === 'admin' ? 'admin-dashboard' : 'investor-dashboard')} className="h-10 px-4 rounded-lg bg-[#0d93f2] text-white text-sm font-bold">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const firstIndustry = isStartupProfile
    ? profile?.startup?.industries?.[0]
    : profile?.investor?.industries?.[0];

  const stageList = profile?.investor?.stagePreferences?.length
    ? profile.investor.stagePreferences
    : ['Pre-Seed', 'Seed', 'Series A'];

  const founders = profile?.startup?.founders?.length ? profile.startup.founders : [profile.name];
  const missionProblem = profile?.description || 'Legacy systems slow down execution and reduce team efficiency in fast-moving markets.';
  const missionSolution = profile?.startup?.traction || profile?.description || 'A focused, scalable approach with strong execution speed and reliable systems.';

  const startupFundingMin = Number(profile?.startup?.fundingRequirementMin || 0);
  const startupFundingMax = Number(profile?.startup?.fundingRequirementMax || startupFundingMin || 1);
  const startupFundingProgress = Math.max(5, Math.min(95, Math.round((startupFundingMin / startupFundingMax) * 100) || 65));

  const checkSize = Number(profile?.investor?.checkSize || profile?.investor?.investmentBudget?.max || 0);
  const portfolio = profile?.investor?.portfolioCompanies?.length
    ? profile.investor.portfolioCompanies
    : ['LUMINA', 'VERTEX', 'AERIS', 'PRISM', 'NEXUS'];

  const renderPrimaryConnectionButton = () => {
    if (isOwnProfile || user?.role === 'admin') return null;

    if (connectionInfo.relationship === 'connected') {
      return (
        <button onClick={handleRemoveConnection} disabled={connectionBusy} className="h-9 rounded-full bg-slate-900 px-4 text-xs font-bold text-white disabled:opacity-50">
          {connectionBusy ? 'Updating...' : 'Connected'}
        </button>
      );
    }

    if (connectionInfo.relationship === 'outgoing_pending') {
      return (
        <button onClick={handleWithdrawConnection} disabled={connectionBusy} className="h-9 rounded-full bg-slate-900 px-4 text-xs font-bold text-white disabled:opacity-50">
          {connectionBusy ? 'Updating...' : 'Pending'}
        </button>
      );
    }

    if (connectionInfo.relationship === 'incoming_pending') {
      return (
        <div className="flex items-center gap-2">
          <button onClick={handleAcceptConnection} disabled={connectionBusy} className="h-9 rounded-full bg-[#0d93f2] px-4 text-xs font-bold text-white disabled:opacity-50">
            {connectionBusy ? 'Updating...' : 'Accept'}
          </button>
          <button onClick={handleIgnoreConnection} disabled={connectionBusy} className="h-9 rounded-full border border-slate-300 bg-white px-4 text-xs font-bold text-slate-700 disabled:opacity-50">
            Ignore
          </button>
        </div>
      );
    }

    return (
      <button onClick={handleConnect} disabled={connectionBusy} className="h-9 rounded-full bg-slate-900 px-4 text-xs font-bold text-white disabled:opacity-50">
        {connectionBusy ? 'Connecting...' : 'Connect'}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-[#f3f5f7] text-slate-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
      <main className="mx-auto w-full max-w-[1280px]">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => go(user?.role === 'startup' ? 'startup-dashboard' : user?.role === 'admin' ? 'admin-dashboard' : 'investor-dashboard')}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold hover:bg-slate-50"
              >
                Back
              </button>
              <p className="text-sm font-bold">{profile.subtitle || profile.name}</p>
            </div>
            <div className="flex items-center gap-2">
              {profile.website && (
                <button onClick={handleOpenWebsite} className="h-9 rounded-full border border-slate-200 bg-white px-4 text-xs font-bold hover:bg-slate-50">
                  Website
                </button>
              )}
              {isStartupProfile && profile.startup?.pitchDeckPath && (
                <button onClick={handleOpenPitchDeck} className="h-9 rounded-full border border-slate-200 bg-white px-4 text-xs font-bold hover:bg-slate-50">
                  Pitch Deck
                </button>
              )}
              <button
                onClick={handleMessage}
                disabled={isOwnProfile}
                className="h-9 rounded-full bg-[#0d93f2] px-4 text-xs font-bold text-white disabled:opacity-50"
              >
                Message
              </button>
              {(isStartupProfile || isInvestorProfile) && renderPrimaryConnectionButton()}
            </div>
          </div>
        </header>

        {isStartupProfile && profile.startup && (
          <div className="px-6 py-8">
            <section className="rounded-2xl border border-slate-800 bg-gradient-to-r from-[#061126] via-[#0a2442] to-[#071329] p-8 text-white shadow-xl">
              <p className="mb-3 inline-flex rounded-full bg-[#0d93f2]/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                {profile.startup.stage || 'Seed Stage'} • {firstIndustry || 'Technology'}
              </p>
              <h1 className="max-w-2xl text-5xl font-extrabold leading-[1.02]">{profile.heroTitle}</h1>
              <p className="mt-4 max-w-3xl text-sm text-blue-100">{profile.description}</p>
              <div className="mt-6 flex items-center gap-3">
                {profile.startup.pitchDeckPath && (
                  <button onClick={handleOpenPitchDeck} className="h-10 rounded-full bg-[#0d93f2] px-5 text-sm font-bold text-white hover:bg-blue-600">
                    View Pitch Deck
                  </button>
                )}
                <button onClick={handleMessage} disabled={isOwnProfile} className="h-10 rounded-full border border-white/30 bg-white/10 px-5 text-sm font-bold text-white disabled:opacity-50">
                  Contact Founder
                </button>
                {connectionInfo.relationship === 'connected' && (
                  <span className="inline-flex h-10 items-center rounded-full border border-white/20 bg-white/10 px-4 text-xs font-bold text-white">
                    1st Degree Connection
                  </span>
                )}
              </div>
            </section>

            <section className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white p-5 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Founding Year</p>
                <p className="mt-2 text-2xl font-bold">{profile.startup.foundedYear}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-5 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Location</p>
                <p className="mt-2 text-2xl font-bold">{profile.location || 'San Francisco, CA'}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-5 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Connections</p>
                <p className="mt-2 text-2xl font-bold">{Number(connectionInfo.targetConnectionCount || 0)}</p>
              </div>
            </section>

            <section className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div>
                <h2 className="text-4xl font-extrabold">Pioneering the next level of efficiency</h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">{profile.description}</p>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  Built for durable growth, this startup focuses on scalable execution, faster iteration cycles, and practical technology adoption.
                </p>
              </div>
              <div className="relative">
                <div className="h-[320px] rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-200 to-slate-100 shadow-inner" />
                <button onClick={handleMessage} disabled={isOwnProfile} className="absolute bottom-4 left-4 h-12 rounded-xl bg-[#0d93f2] px-4 text-sm font-bold text-white shadow-lg disabled:opacity-50">
                  Message
                </button>
              </div>
            </section>

            <section className="mt-16">
              <h3 className="text-center text-4xl font-extrabold">The Mission</h3>
              <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h4 className="text-2xl font-bold">The Problem</h4>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{missionProblem}</p>
                  <ul className="mt-5 space-y-2 text-sm text-slate-500">
                    <li>• Manual scaling bottlenecks</li>
                    <li>• High infrastructure overhead</li>
                    <li>• Vulnerable security architecture</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-6">
                  <h4 className="text-2xl font-bold text-[#0d93f2]">The Solution</h4>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{missionSolution}</p>
                  <ul className="mt-5 space-y-2 text-sm text-slate-600">
                    <li>✓ AI-driven predictive scaling</li>
                    <li>✓ One-click multi-cloud deployment</li>
                    <li>✓ Zero-trust security by default</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mt-16 rounded-2xl bg-[#07142a] p-7 text-white">
              <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div>
                  <h3 className="text-3xl font-extrabold">Funding Status</h3>
                  <p className="mt-2 text-sm text-blue-100">We are currently raising and looking for aligned long-term partners.</p>
                </div>
                {renderPrimaryConnectionButton()}
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <p>
                  <span className="text-3xl font-extrabold text-[#0d93f2]">{money(startupFundingMin)}</span> of {money(startupFundingMax)}
                </p>
                <p className="font-bold">{startupFundingProgress}%</p>
              </div>
              <div className="mt-2 h-2.5 rounded-full bg-slate-800">
                <div className="h-2.5 rounded-full bg-[#0d93f2]" style={{ width: `${startupFundingProgress}%` }} />
              </div>
            </section>

            <section className="mt-16">
              <h3 className="text-center text-4xl font-extrabold">Our Leadership</h3>
              <p className="mt-2 text-center text-sm text-slate-500">The visionaries behind {profile.startup.companyName}</p>
              <div className="mt-8 flex flex-wrap justify-center gap-6">
                {founders.map((founder, index) => (
                  <div key={founder} className="w-44 text-center">
                    <div className="mx-auto mb-3 size-28 rounded-full border-2 border-slate-200 bg-gradient-to-br from-[#0d93f2]/20 to-slate-100" />
                    <p className="font-bold">{founder}</p>
                    <p className="text-xs text-[#0d93f2]">{index === 0 ? 'CEO & Founder' : 'Co-Founder'}</p>
                    <p className="mt-1 text-[11px] leading-5 text-slate-500">Driving execution and long-term product vision.</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {isInvestorProfile && profile.investor && (
          <div className="px-6 py-8">
            <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <p className="mb-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#0d93f2]">
                Early-Stage Investor
              </p>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[140px,1fr] lg:items-center">
                <div className="size-36 rounded-full border-4 border-slate-200 bg-gradient-to-br from-slate-200 to-slate-100" />
                <div>
                  <h1 className="text-6xl font-extrabold leading-[1.03]">
                    Backing the <span className="text-[#0d93f2] italic">misfits</span> of tomorrow.
                  </h1>
                  <p className="mt-3 max-w-3xl text-base text-slate-600">{profile.description}</p>
                  <div className="mt-5 flex gap-3">
                    <button onClick={handleMessage} disabled={isOwnProfile} className="h-11 rounded-full bg-slate-900 px-6 text-sm font-bold text-white disabled:opacity-50">
                      Get in Touch
                    </button>
                    {renderPrimaryConnectionButton()}
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-[10px] uppercase text-slate-500">AUM</p>
                <p className="mt-1 text-4xl font-extrabold">{money(profile.investor.investmentBudget?.max || checkSize)}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-[10px] uppercase text-slate-500">Investments</p>
                <p className="mt-1 text-4xl font-extrabold">{Math.max(10, portfolio.length * 6)}+</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-[10px] uppercase text-slate-500">Exits</p>
                <p className="mt-1 text-4xl font-extrabold">{Math.max(3, Math.floor(portfolio.length / 2))}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-[10px] uppercase text-slate-500">Check Size</p>
                <p className="mt-1 text-4xl font-extrabold">{money(checkSize)}</p>
              </div>
            </section>

            <section className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div>
                <h2 className="text-4xl font-extrabold">Investment Philosophy</h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">{profile.description}</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  <li>✓ First principles thinking</li>
                  <li>✓ Operational velocity</li>
                </ul>
              </div>
              <div className="h-[320px] rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-200 to-slate-100 shadow-sm" />
            </section>

            <section className="mt-16">
              <h3 className="text-center text-4xl font-extrabold">Investment Focus</h3>
              <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-[2fr,1fr]">
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="mb-3 text-sm font-bold">Industries</p>
                  <div className="flex flex-wrap gap-2">
                    {(profile.investor.industries?.length ? profile.investor.industries : ['Generative AI', 'Fintech', 'SaaS Infrastructure']).map((industry) => (
                      <span key={industry} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium">
                        {industry}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl bg-[#0d93f2] p-5 text-white">
                  <p className="mb-3 text-sm font-bold">Investment Stage</p>
                  <div className="space-y-2 text-sm">
                    {stageList.map((stage) => (
                      <p key={stage}>○ {stage}</p>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-16">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-4xl font-extrabold">Current Portfolio</h3>
                <button className="text-sm font-bold text-[#0d93f2]">View All Portfolio →</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {portfolio.map((company) => (
                  <div key={company} className="grid size-36 place-items-center rounded-2xl border border-slate-200 bg-white text-xs font-bold text-slate-500 shadow-sm">
                    {company}
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-16 rounded-3xl bg-[#07142a] p-8 text-white">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr,1.2fr]">
                <div>
                  <h3 className="text-4xl font-extrabold">Value Beyond Capital</h3>
                  <p className="mt-3 text-sm text-blue-100">
                    We don’t just write checks. We help founders solve hard problems and scale with confidence.
                  </p>
                  <button onClick={handleMessage} disabled={isOwnProfile} className="mt-6 h-10 rounded-full bg-[#0d93f2] px-5 text-sm font-bold text-white disabled:opacity-50">
                    Pitch Your Vision
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Unrivaled Network — direct access to operators and advisors.</div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Hiring & Talent — support for first critical hires.</div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Operational Playbooks — GTM and scaling guidance.</div>
                </div>
              </div>
            </section>

            <section className="mt-16 rounded-2xl border border-slate-200 bg-white py-16 text-center">
              <h3 className="text-5xl font-extrabold">Ready to build the future?</h3>
              <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-500">
                We review every application. If you have a clear vision and relentless drive, we want to hear from you.
              </p>
              <button onClick={handleMessage} disabled={isOwnProfile} className="mt-6 h-11 rounded-full bg-[#0d93f2] px-6 text-sm font-bold text-white disabled:opacity-50">
                Apply for Funding
              </button>
            </section>
          </div>
        )}

        {!isStartupProfile && !isInvestorProfile && (
          <div className="px-6 py-10">
            <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h1 className="text-4xl font-extrabold mb-3">{profile.name}</h1>
              <p className="text-sm text-slate-500 mb-6">{profile.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">Role</p>
                  <p className="text-lg font-bold mt-1 capitalize">{profile.role || 'member'}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">Location</p>
                  <p className="text-lg font-bold mt-1">{profile.location || 'Not shared'}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">Connections</p>
                  <p className="text-lg font-bold mt-1">{Number(connectionInfo.targetConnectionCount || 0)}</p>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

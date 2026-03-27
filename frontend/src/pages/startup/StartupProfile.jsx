import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StartupSidebar from '../../components/StartupSidebar.jsx';

function formatMoney(value) {
  const amount = Number(value || 0);
  if (!amount) return '$0';
  return `$${amount.toLocaleString()}`;
}

function initials(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'S';
  return parts.slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

function normalizeWebsite(website) {
  if (!website) return 'techflow.ai';
  return String(website).replace(/^https?:\/\//, '').replace(/\/$/, '');
}

export default function StartupProfile({ user, go }) {
  const [profile, setProfile] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const [profileResponse, unreadResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5000/api/notifications/unread-count', {
            headers: { Authorization: `Bearer ${token}` }
          }).catch(() => ({ data: { count: 0 } }))
        ]);

        setProfile(profileResponse.data || null);
        setNotificationCount(Number(unreadResponse.data?.count || 0));
      } catch (error) {
        console.error('Error loading startup profile preview:', error);
      }
    };

    loadProfile();
  }, []);

  const data = profile || user || {};
  const companyName = data.companyName || data.name || 'TechFlow AI';
  const subtitle = data.headline || data.description || 'Revolutionizing enterprise workflow automation with proprietary generative AI models.';
  const location = data.location || 'San Francisco, CA';
  const website = normalizeWebsite(data.website);
  const employeeRange = data.companySize || data.teamSize || '11-50 employees';

  const founders = Array.isArray(data.founders) && data.founders.length
    ? data.founders
    : ['Sarah Chen', 'David Park'];

  const stage = data.stage || 'Series A';
  const target = Number(data.fundingRequirement?.max || data.fundingRequirementMax || 5000000);
  const minTicket = Number(data.fundingRequirement?.min || data.fundingRequirementMin || 50000);
  const raised = target ? Math.round(target * 0.65) : 3250000;
  const progress = target ? Math.min(100, Math.round((raised / target) * 100)) : 65;

  const logoUrl = data.logoUrl
    ? (String(data.logoUrl).startsWith('http') ? data.logoUrl : `http://localhost:5000${data.logoUrl}`)
    : '';

  return (
    <div className="flex min-h-screen bg-[#edf1f5] text-slate-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
      <StartupSidebar user={user} go={go} activeView="startup-profile" notificationCount={notificationCount} />

      <main className="flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-[1040px] px-4 py-5 sm:px-6">
        <section className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-5">
            <div className="flex items-start gap-5">
              <div className="flex size-[95px] items-center justify-center overflow-hidden rounded-2xl bg-[#101827] text-2xl font-bold text-white ring-1 ring-slate-200">
                {logoUrl ? <img src={logoUrl} alt={companyName} className="h-full w-full object-cover" /> : initials(companyName)}
              </div>
              <div>
                <h1 className="text-[50px] font-extrabold leading-[1.02] tracking-[-0.02em]">{companyName}</h1>
                <p className="mt-1 max-w-[650px] text-[33px] leading-[1.16] text-slate-600">{subtitle}</p>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-[12px] text-slate-500">
                  <span className="inline-flex items-center gap-1.5"><span className="material-symbols-outlined text-[15px]">location_on</span>{location}</span>
                  <span className="inline-flex items-center gap-1.5"><span className="material-symbols-outlined text-[15px]">language</span>{website}</span>
                  <span className="inline-flex items-center gap-1.5"><span className="material-symbols-outlined text-[15px]">groups</span>{employeeRange}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => go('profile-step-1')}
              className="inline-flex h-8 items-center gap-1 rounded-full bg-[#e8f3ff] px-3 text-[12px] font-semibold text-[#0d93f2]"
            >
              <span className="material-symbols-outlined text-[14px]">edit</span>
              Edit Header
            </button>
          </div>
        </section>

        <section className="mt-5 rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-[38px] font-bold tracking-[-0.01em]">
              <span className="material-symbols-outlined text-[20px] text-[#0d93f2]">info</span>
              About {companyName}
            </h2>
            <button
              onClick={() => go('profile-step-2')}
              className="inline-flex h-8 items-center gap-1 rounded-full bg-[#e8f3ff] px-3 text-[12px] font-semibold text-[#0d93f2]"
            >
              <span className="material-symbols-outlined text-[14px]">edit</span>
              Edit About
            </button>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#0d93f2]">The Problem</p>
              <p className="mt-2 text-[18px] leading-[1.56] text-slate-600">{data.problemStatement || 'Modern enterprises lose over 30% of productivity due to manual data entry and fragmented communication across legacy systems.'}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#0d93f2]">Our Solution</p>
              <p className="mt-2 text-[18px] leading-[1.56] text-slate-600">{data.solution || 'TechFlow AI provides a zero-config AI layer that understands business workflows and auto-generates execution agents in minutes.'}</p>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-[38px] font-bold tracking-[-0.01em]">
              <span className="material-symbols-outlined text-[20px] text-[#0d93f2]">group</span>
              Founding Team
            </h2>
            <button
              onClick={() => go('profile-step-2')}
              className="inline-flex h-8 items-center gap-1 rounded-full bg-[#e8f3ff] px-3 text-[12px] font-semibold text-[#0d93f2]"
            >
              <span className="material-symbols-outlined text-[14px]">edit</span>
              Edit Team
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {founders.slice(0, 2).map((founderName, index) => (
              <article key={`${founderName}-${index}`} className="rounded-2xl border border-slate-200 bg-[#f8fbff] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-full bg-slate-300 text-xs font-bold text-slate-700">{initials(founderName)}</div>
                  <div>
                    <p className="text-[20px] font-semibold leading-tight">{founderName}</p>
                    <p className="text-[11px] font-semibold text-[#0d93f2]">{index === 0 ? 'CEO & Co-founder' : 'CTO & Co-founder'}</p>
                  </div>
                </div>
                <p className="mt-3 text-[13px] italic leading-6 text-slate-500">"{index === 0 ? 'Former ML lead. Passionate about practical human-AI collaboration.' : 'Built and scaled multiple SaaS products across fintech and enterprise.'}"</p>
              </article>
            ))}

            <article className="flex min-h-[165px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-[#fbfcfe] text-slate-400">
              <div className="text-center">
                <span className="material-symbols-outlined text-[22px]">person_add</span>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide">Add Team Member</p>
              </div>
            </article>
          </div>
        </section>

        <section className="mt-5 rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-[38px] font-bold tracking-[-0.01em]">
              <span className="material-symbols-outlined text-[20px] text-[#0d93f2]">payments</span>
              Funding & Rounds
            </h2>
            <button
              onClick={() => go('profile-step-3')}
              className="inline-flex h-8 items-center gap-1 rounded-full bg-[#e8f3ff] px-3 text-[12px] font-semibold text-[#0d93f2]"
            >
              <span className="material-symbols-outlined text-[14px]">edit</span>
              Edit Funding
            </button>
          </div>

          <div className="rounded-2xl border border-[#dbe8f6] bg-[#f3f8ff] p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#0d93f2]">Active Round</p>
                <p className="mt-1 text-[44px] font-extrabold leading-tight">{stage}</p>
              </div>
              <div className="text-right">
                <p className="text-[12px] text-slate-500">Target: {formatMoney(target)}</p>
                <p className="text-[42px] font-extrabold leading-tight">{formatMoney(raised)} raised</p>
              </div>
            </div>

            <div className="mt-5 h-[10px] rounded-full bg-[#dce6f2]">
              <div className="h-full rounded-full bg-[#0d93f2]" style={{ width: `${progress}%` }} />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-5 md:grid-cols-4">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-slate-500">Valuation</p>
                <p className="mt-1 text-[31px] font-bold">{data.valuation || '$20M Post'}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-slate-500">Min Ticket</p>
                <p className="mt-1 text-[31px] font-bold">{formatMoney(minTicket)}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-slate-500">Commitments</p>
                <p className="mt-1 text-[31px] font-bold">12 Investors</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-slate-500">Time Remaining</p>
                <p className="mt-1 text-[31px] font-bold">14 Days</p>
              </div>
            </div>
          </div>
        </section>
        
        <footer className="pb-6 text-center text-[11px] text-slate-400">© 2024 Startup Portal. Profile Preview System v2.4.0</footer>
      </div>
      </main>
    </div>
  );
}

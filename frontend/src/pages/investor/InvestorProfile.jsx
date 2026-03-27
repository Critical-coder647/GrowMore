import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InvestorSidebar from '../../components/InvestorSidebar.jsx';

function initials(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'I';
  return parts.slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

function formatCheckSize(minValue, maxValue) {
  const min = Number(minValue || 0);
  const max = Number(maxValue || 0);
  if (!min && !max) return '$250k - $2M Ticket size';

  const compact = (amount) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(amount % 1000000 === 0 ? 0 : 1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}k`;
    return `$${amount}`;
  };

  if (min && max) return `${compact(min)} - ${compact(max)} Ticket size`;
  return `${compact(max || min)} Ticket size`;
}

function sanitizeWebsite(url) {
  if (!url) return 'globalventures.vc';
  return String(url).replace(/^https?:\/\//, '').replace(/\/$/, '');
}

export default function InvestorProfile({ user, go }) {
  const [profile, setProfile] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const [profileRes, unreadRes] = await Promise.all([
          axios.get('http://localhost:5000/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5000/api/notifications/unread-count', {
            headers: { Authorization: `Bearer ${token}` }
          }).catch(() => ({ data: { count: 0 } }))
        ]);

        setProfile(profileRes.data || null);
        setNotificationCount(Number(unreadRes.data?.count || 0));
      } catch (error) {
        console.error('Error loading investor profile preview:', error);
      }
    };

    fetchProfile();
  }, []);

  const data = profile || user || {};
  const firmName = data.firmName || data.name || 'Global Ventures Capital';
  const headline = data.headline || 'Empowering early-stage tech founders across North America and Europe.';
  const thesis = data.thesis || 'We believe that the next decade of innovation will be driven by sustainable infrastructure and decentralized software solutions. Our fund focuses on founders who are leveraging AI to solve real-world logistical problems.';
  const location = data.location || 'San Francisco, CA';
  const website = sanitizeWebsite(data.website);
  const investmentsCount = data.portfolioCompanies?.length ? `${data.portfolioCompanies.length} Investments` : '42 Investments';
  const checkSize = formatCheckSize(data.investmentBudget?.min || data.checkSize, data.investmentBudget?.max);

  const stageTags = (Array.isArray(data.stagePreferences) && data.stagePreferences.length
    ? data.stagePreferences
    : ['Pre-Seed', 'Seed', 'Series A']).slice(0, 3);

  const sectorTags = (Array.isArray(data.industriesInterestedIn) && data.industriesInterestedIn.length
    ? data.industriesInterestedIn
    : ['FinTech', 'SaaS', 'AI/ML', 'CleanTech']).slice(0, 4);

  const portfolioCompanies = (Array.isArray(data.portfolioCompanies) && data.portfolioCompanies.length
    ? data.portfolioCompanies
    : ['LogiTech AI', 'Nexus Cloud', 'Solar Stream', 'Vortex Pay']).slice(0, 4);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#edf2f7] text-slate-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
      <InvestorSidebar user={user} go={go} activeView="investor-profile" notificationCount={notificationCount} />

      <main className="flex-1 overflow-y-auto">
        <div className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex h-[52px] w-full max-w-[1096px] items-center justify-between px-6">
            <div className="flex items-center gap-2 text-[13px] text-slate-500">
              <button onClick={() => go('investor-dashboard')} className="hover:text-slate-700">Dashboard</button>
              <span>›</span>
              <span className="font-semibold text-slate-700">Profile Preview</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-[#eef3f8] p-1 text-[11px] font-semibold text-slate-600">
                <button className="rounded-md bg-white px-3 py-1 text-[#0d93f2] shadow-sm">Owner View</button>
                <button className="rounded-md px-3 py-1">Public View</button>
              </div>
              <button className="h-10 rounded-full bg-[#0d93f2] px-6 text-sm font-semibold text-white shadow-[0_8px_14px_rgba(13,147,242,0.28)] hover:bg-[#0b84d9]">
                Save All Changes
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[1096px] px-6 py-6">
          <section className="rounded-[22px] border border-slate-200 bg-white px-7 py-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-5">
                <div className="relative">
                  <div className="flex size-[92px] items-center justify-center rounded-full bg-[#1f5a56] text-2xl font-bold text-white ring-2 ring-slate-100">
                    {initials(firmName)}
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full border border-slate-200 bg-white text-[#0d93f2]">
                    <span className="material-symbols-outlined text-[14px]">photo_camera</span>
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-[43px] font-extrabold leading-[1.03] tracking-[-0.02em]">{firmName}</h1>
                    <span className="rounded-full bg-[#e7f9ee] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#1fa35b]">Live Profile</span>
                  </div>
                  <p className="mt-1 max-w-[660px] text-[29px] leading-[1.18] text-slate-600">{headline}</p>

                  <div className="mt-4 flex flex-wrap items-center gap-5 text-[12px] text-slate-500">
                    <span className="inline-flex items-center gap-1.5"><span className="material-symbols-outlined text-[15px]">location_on</span>{location}</span>
                    <span className="inline-flex items-center gap-1.5"><span className="material-symbols-outlined text-[15px]">bar_chart</span>{investmentsCount}</span>
                    <span className="inline-flex items-center gap-1.5"><span className="material-symbols-outlined text-[15px]">payments</span>{checkSize}</span>
                  </div>
                </div>
              </div>

              <button className="inline-flex h-8 items-center gap-1 rounded-full bg-[#e8f3ff] px-3 text-[12px] font-semibold text-[#0d93f2]">
                <span className="material-symbols-outlined text-[14px]">edit</span>
                Edit Header
              </button>
            </div>
          </section>

          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[2.15fr_1fr]">
            <section className="rounded-[22px] border border-slate-200 bg-white px-6 py-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-[35px] font-bold tracking-[-0.01em]">
                <span className="material-symbols-outlined text-[20px] text-[#0d93f2]">description</span>
                Investment Thesis
              </h2>
              <p className="mt-3 text-[17px] leading-[1.62] text-slate-600">{thesis}</p>
              <p className="mt-4 text-[17px] leading-[1.62] text-slate-600">We don’t just provide capital; we provide a deep network of industry veterans and operational support to help portfolio companies scale from Seed to Series B.</p>
            </section>

            <section className="rounded-[22px] border border-slate-200 bg-white px-6 py-5 shadow-sm">
              <h2 className="text-[35px] font-bold tracking-[-0.01em]">Target Focus</h2>
              <div className="mt-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Preferred Stages</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {stageTags.map((stage) => (
                    <span key={stage} className="rounded-full bg-[#edf4fc] px-3 py-1 text-[11px] font-semibold text-[#0d93f2]">{stage}</span>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Sectors</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {sectorTags.map((sector) => (
                    <span key={sector} className="rounded-full bg-[#edf1f6] px-3 py-1 text-[11px] font-semibold text-slate-600">{sector}</span>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[2.15fr_1fr]">
            <section className="rounded-[22px] border border-slate-200 bg-white px-6 py-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-[35px] font-bold tracking-[-0.01em]">
                <span className="material-symbols-outlined text-[20px] text-[#0d93f2]">business_center</span>
                Portfolio Highlights
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {portfolioCompanies.slice(0, 3).map((companyNameItem, index) => (
                  <article key={companyNameItem} className="min-h-[132px] rounded-2xl border border-slate-200 bg-[#fbfcfe] px-4 py-3.5">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-[#eaf2fb] text-sm font-bold text-[#0d93f2]">{initials(companyNameItem).charAt(0)}</div>
                    <p className="mt-3 text-[20px] font-semibold leading-tight">{companyNameItem}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-400">{index === 0 ? 'Series A • 2022' : 'Seed • 2021'}</p>
                  </article>
                ))}

                {portfolioCompanies[3] && (
                  <article className="min-h-[132px] rounded-2xl border border-slate-200 bg-[#fbfcfe] px-4 py-3.5">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-[#fff3dd] text-sm font-bold text-[#d18f1e]">{initials(portfolioCompanies[3]).charAt(0)}</div>
                    <p className="mt-3 text-[20px] font-semibold leading-tight">{portfolioCompanies[3]}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-400">Series B • 2020</p>
                  </article>
                )}

                <article className="flex min-h-[132px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-[#fbfcfe] text-slate-400">
                  <div className="text-center">
                    <span className="material-symbols-outlined text-[21px]">add</span>
                    <p className="mt-1 text-[11px] font-semibold">Add New</p>
                  </div>
                </article>
              </div>
            </section>

            <div className="space-y-5">
              <section className="rounded-[22px] border border-slate-200 bg-white px-6 py-5 shadow-sm">
                <h2 className="text-[35px] font-bold tracking-[-0.01em]">Connect</h2>
                <div className="mt-4 space-y-3.5">
                  <a href={`https://${website}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2.5 text-[14px] text-slate-700 hover:text-[#0d93f2]">
                    <span className="material-symbols-outlined rounded-full bg-[#edf1f6] p-1 text-[14px]">language</span>
                    {website}
                  </a>
                  <a href={data.linkedin || '#'} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2.5 text-[14px] text-slate-700 hover:text-[#0d93f2]">
                    <span className="material-symbols-outlined rounded-full bg-[#edf1f6] p-1 text-[14px]">share</span>
                    LinkedIn Profile
                  </a>
                  <a href={data.twitter || '#'} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2.5 text-[14px] text-slate-700 hover:text-[#0d93f2]">
                    <span className="material-symbols-outlined rounded-full bg-[#edf1f6] p-1 text-[14px]">alternate_email</span>
                    Twitter / X
                  </a>
                </div>
              </section>

              <section className="rounded-[22px] bg-[#0d93f2] px-6 py-5 text-white shadow-[0_8px_14px_rgba(13,147,242,0.28)]">
                <h3 className="text-[24px] font-bold">Ready for the world?</h3>
                <p className="mt-2 text-[14px] text-white/90">Your profile is currently live and discoverable by founders looking for funding.</p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InvestorSidebar from '../../components/InvestorSidebar.jsx';

export default function InvestorProfile({ user, go }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data || null);
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const data = profile || user || {};

  return (
    <div className="min-h-screen w-full bg-[#f5f7f8] dark:bg-[#101b22] text-slate-900 dark:text-white flex" style={{ fontFamily: 'Manrope, sans-serif' }}>
      <InvestorSidebar user={user} go={go} activeView="investor-profile" />
      <main className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Investor Profile</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Your public profile visible to startups.</p>
          </div>
          <button
            onClick={() => go('investor-dashboard')}
            className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111a22] p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-2xl bg-[#0d93f2]/10 text-[#0d93f2] flex items-center justify-center text-2xl font-bold">
              {(data.firmName || data.name || 'I')[0]}
            </div>
            <div>
              <h2 className="text-xl font-bold">{data.firmName || data.name || 'Investor'}</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">{data.email || 'Email not set'}</p>
              <p className="text-xs text-slate-500 mt-1">{data.location || 'Location not set'}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111a22] p-6">
              <h3 className="text-lg font-bold mb-3">Investment Thesis</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">{data.thesis || 'Add your investment thesis.'}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111a22] p-6">
              <h3 className="text-lg font-bold mb-3">Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-slate-500">Check Size</p>
                  <p className="text-slate-700 dark:text-slate-200">${Number(data.checkSize || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Industries</p>
                  <p className="text-slate-700 dark:text-slate-200">{data.industriesInterestedIn?.join(', ') || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Stage Preferences</p>
                  <p className="text-slate-700 dark:text-slate-200">{data.stagePreferences?.join(', ') || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Keywords</p>
                  <p className="text-slate-700 dark:text-slate-200">{data.keywords?.join(', ') || '—'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111a22] p-6">
              <h3 className="text-lg font-bold mb-3">Portfolio</h3>
              <div className="flex flex-wrap gap-2">
                {(data.portfolioCompanies && data.portfolioCompanies.length > 0 ? data.portfolioCompanies : ['Add', 'Portfolio']).map((company) => (
                  <span key={company} className="px-2.5 py-1 rounded-full bg-[#0d93f2]/10 text-[#0d93f2] text-xs font-semibold">
                    {company}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111a22] p-6">
              <h3 className="text-lg font-bold mb-3">Budget</h3>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div>
                  <p className="text-xs text-slate-500">Min</p>
                  <p className="text-slate-700 dark:text-slate-200">${Number(data.investmentBudget?.min || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Max</p>
                  <p className="text-slate-700 dark:text-slate-200">${Number(data.investmentBudget?.max || 0).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </main>
    </div>
  );
}

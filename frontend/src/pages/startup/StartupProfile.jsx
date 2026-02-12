import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function StartupProfile({ user, go }) {
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
    <div className="min-h-screen w-full bg-[#f5f7f8] dark:bg-[#101b22] text-slate-900 dark:text-white" style={{ fontFamily: 'Manrope, sans-serif' }}>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Startup Profile</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Your public profile visible to investors.</p>
          </div>
          <button
            onClick={() => go('startup-dashboard')}
            className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111a22] p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-2xl bg-[#0d93f2]/10 text-[#0d93f2] flex items-center justify-center text-2xl font-bold">
              {(data.companyName || data.name || 'S')[0]}
            </div>
            <div>
              <h2 className="text-xl font-bold">{data.companyName || data.name || 'Your Company'}</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">{data.industry?.join(', ') || 'Industry not set'}</p>
              <p className="text-xs text-slate-500 mt-1">{data.location || 'Location not set'}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111a22] p-6">
              <h3 className="text-lg font-bold mb-3">About</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">{data.description || 'Add a short description of your startup.'}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111a22] p-6">
              <h3 className="text-lg font-bold mb-3">Funding</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-slate-500">Stage</p>
                  <p className="text-slate-700 dark:text-slate-200">{data.stage || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Funding Range</p>
                  <p className="text-slate-700 dark:text-slate-200">
                    ${Number(data.fundingRequirement?.min || data.fundingRequirementMin || 0).toLocaleString()} - ${Number(data.fundingRequirement?.max || data.fundingRequirementMax || 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Traction</p>
                  <p className="text-slate-700 dark:text-slate-200">{data.traction || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Website</p>
                  <p className="text-slate-700 dark:text-slate-200">{data.website || '—'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111a22] p-6">
              <h3 className="text-lg font-bold mb-3">Founders</h3>
              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {(data.founders && data.founders.length > 0 ? data.founders : [data.name || 'Founder']).map((founder) => (
                  <div key={founder} className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-[#0d93f2]">person</span>
                    <span>{founder}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111a22] p-6">
              <h3 className="text-lg font-bold mb-3">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {(data.keywords && data.keywords.length > 0 ? data.keywords : ['Add', 'Keywords']).map((keyword) => (
                  <span key={keyword} className="px-2.5 py-1 rounded-full bg-[#0d93f2]/10 text-[#0d93f2] text-xs font-semibold">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

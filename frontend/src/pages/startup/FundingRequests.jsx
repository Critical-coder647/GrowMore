import React, { useMemo, useState } from 'react';
import StartupSidebar from '../../components/StartupSidebar.jsx';

export default function FundingRequests({ user, go }) {
  const [form, setForm] = useState({
    targetAmount: '',
    minTicket: '',
    stage: '',
    valuation: '',
    elevatorPitch: '',
    summary: '',
    shareToFeed: false
  });
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleRequestCancel = () => {
    setShowCancelConfirm(true);
  };

  const handleConfirmCancel = () => {
    setShowCancelConfirm(false);
    go('startup-dashboard');
  };

  const completionLabel = useMemo(() => {
    const filled = [
      form.targetAmount,
      form.minTicket,
      form.stage,
      form.valuation,
      form.elevatorPitch,
      form.summary
    ].filter(Boolean).length;
    const progress = Math.round((filled / 6) * 100);
    return `${progress}% Complete`;
  }, [form]);

  return (
    <div className="min-h-screen w-full bg-[#f6f8fb] text-slate-900 flex" style={{ fontFamily: 'Manrope, sans-serif' }}>
      <StartupSidebar user={user} go={go} activeView="startup-funding" />
      <main className="flex-1 overflow-y-auto">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <button
            type="button"
            onClick={handleRequestCancel}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white">
              ←
            </span>
            Back to Dashboard
          </button>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            Draft auto-saved 2m ago
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-6">
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold">Create New Funding Request</h1>
                  <p className="text-sm text-slate-500">Share your vision with our network of 500+ investors.</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {completionLabel}
                </span>
              </div>
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Step 1: The Ask</span>
                  <span className="text-slate-400">Next: The Pitch</span>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-slate-100">
                  <div className="h-full w-1/4 rounded-full bg-blue-500"></div>
                </div>
                <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-600">The Ask</span>
                  <span>The Pitch</span>
                  <span>Materials</span>
                  <span>Review</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">S</span>
                  <h2 className="text-base font-semibold">Investment Details</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500">Target Amount ($)</label>
                    <input
                      value={form.targetAmount}
                      onChange={handleChange('targetAmount')}
                      placeholder="e.g. 1,000,000"
                      className="mt-2 w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500">Minimum Ticket Size ($)</label>
                    <input
                      value={form.minTicket}
                      onChange={handleChange('minTicket')}
                      placeholder="e.g. 10,000"
                      className="mt-2 w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500">Funding Stage</label>
                    <select
                      value={form.stage}
                      onChange={handleChange('stage')}
                      className="mt-2 w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900"
                    >
                      <option value="">Select Stage</option>
                      <option>Pre-Seed</option>
                      <option>Seed</option>
                      <option>Series A</option>
                      <option>Series B</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500">Equity Offered / Valuation Cap</label>
                    <input
                      value={form.valuation}
                      onChange={handleChange('valuation')}
                      placeholder="e.g. 10% or $5M Cap"
                      className="mt-2 w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">P</span>
                  <h2 className="text-base font-semibold">The Pitch</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                      <span>Elevator Pitch</span>
                      <span className="text-slate-400">Max 140 chars</span>
                    </div>
                    <input
                      value={form.elevatorPitch}
                      onChange={handleChange('elevatorPitch')}
                      placeholder="Briefly describe your startup in one sentence..."
                      className="mt-2 w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900"
                      maxLength={140}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                      <span>Executive Summary</span>
                      <span className="text-slate-400">B  I  S</span>
                    </div>
                    <textarea
                      value={form.summary}
                      onChange={handleChange('summary')}
                      placeholder="Tell us about the problem, your solution, market size, and traction..."
                      rows={5}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">M</span>
                  <h2 className="text-base font-semibold">Materials</h2>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500">Pitch Deck (PDF/PPT)</label>
                  <div className="mt-3 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
                    <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400">⬆</div>
                    <p className="mt-3 text-sm font-semibold text-slate-600">Click to upload</p>
                    <p className="text-xs text-slate-400">or drag and drop</p>
                    <p className="mt-2 text-[11px] text-slate-400">PDF/PPT (max 25MB)</p>
                  </div>
                </div>
                <div className="mt-5 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={form.shareToFeed}
                    onChange={handleChange('shareToFeed')}
                    className="mt-1 h-4 w-4 rounded border-slate-300"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-600">Share to Community Feed?</p>
                    <p className="text-xs text-slate-400">
                      Post a teaser of this request to your followers. Financial details will remain hidden until access is granted.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleRequestCancel}
                  className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600"
                >
                  Next Step →
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-xs font-semibold text-blue-600">INVESTOR TIPS</div>
              <h3 className="mt-2 text-sm font-semibold text-slate-800">Be Realistic with Valuation</h3>
              <p className="mt-2 text-xs text-slate-500">
                Investors appreciate grounded financial projections. Compare your valuation with similar startups in your sector and stage.
              </p>
              <button type="button" className="mt-3 text-xs font-semibold text-blue-600">
                Read our Valuation Guide →
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-xs font-semibold text-slate-600">Upload Checklist</div>
              <ul className="mt-3 space-y-2 text-xs text-slate-500">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                  High-res logo
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                  Pitch Deck (10-15 slides)
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                  Cap Table Summary
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      </main>

      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900">Cancel funding request?</h3>
            <p className="mt-2 text-sm text-slate-500">Are you sure you want to cancel? Your unsaved changes will be lost.</p>
            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCancelConfirm(false)}
                className="h-9 px-4 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Keep Editing
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="h-9 px-4 rounded-xl bg-slate-900 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import AdminSidebar from '../../components/AdminSidebar.jsx';

function formatMoney(value) {
  const amount = Number(value || 0);
  if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  return `$${amount.toFixed(0)}`;
}

function formatCompactMoney(value) {
  return formatMoney(value).replace('.0', '');
}

function normalizeStage(stage) {
  const value = String(stage || '').trim();
  if (!value) return 'Pre-Seed';
  return value;
}

function deriveRoundStatus(progress) {
  if (progress >= 100) return 'Closed';
  if (progress >= 60) return 'Active';
  if (progress >= 25) return 'Pending Approval';
  return 'On Hold';
}

export default function FundingRoundsManagement({ user, go }) {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('Active');
  const [industryFilter, setIndustryFilter] = useState('All');
  const [page, setPage] = useState(1);

  const pageSize = 10;

  useEffect(() => {
    const fetchRounds = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/startups', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const list = Array.isArray(response.data) ? response.data : [];
        setStartups(list);
      } catch (error) {
        console.error('Error loading funding rounds:', error);
        setStartups([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRounds();
  }, []);

  const mappedRounds = useMemo(() => {
    return startups.map((startup) => {
      const raised = Number(startup.fundingRequirementMin || 0);
      const target = Math.max(Number(startup.fundingRequirementMax || startup.fundingRequirementMin || 1), 1);
      const progress = Math.max(0, Math.min(100, Math.round((raised / target) * 100)));
      const status = deriveRoundStatus(progress);
      const investors = Array.isArray(startup.aiMatches) ? startup.aiMatches.length : 0;
      const industries = Array.isArray(startup.industry) ? startup.industry : [];

      return {
        id: startup._id,
        startup: startup.name || 'Unnamed Startup',
        stage: normalizeStage(startup.stage),
        raised,
        target,
        progress,
        status,
        investors,
        industries,
        createdAt: startup.createdAt
      };
    });
  }, [startups]);

  const stageOptions = useMemo(() => {
    const set = new Set(['All']);
    mappedRounds.forEach((round) => set.add(round.stage));
    return [...set];
  }, [mappedRounds]);

  const industryOptions = useMemo(() => {
    const set = new Set(['All']);
    mappedRounds.forEach((round) => {
      round.industries.forEach((industry) => set.add(industry));
    });
    return [...set];
  }, [mappedRounds]);

  const filteredRounds = useMemo(() => {
    return mappedRounds.filter((round) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !query ||
        round.startup.toLowerCase().includes(query) ||
        round.stage.toLowerCase().includes(query) ||
        round.industries.join(' ').toLowerCase().includes(query);

      const matchesStage = stageFilter === 'All' || round.stage === stageFilter;
      const matchesStatus = statusFilter === 'All' || round.status === statusFilter;
      const matchesIndustry = industryFilter === 'All' || round.industries.includes(industryFilter);

      return matchesQuery && matchesStage && matchesStatus && matchesIndustry;
    });
  }, [mappedRounds, searchQuery, stageFilter, statusFilter, industryFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRounds.length / pageSize));

  useEffect(() => {
    setPage(1);
  }, [searchQuery, stageFilter, statusFilter, industryFilter]);

  const paginatedRounds = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRounds.slice(start, start + pageSize);
  }, [filteredRounds, page]);

  const kpis = useMemo(() => {
    const active = mappedRounds.filter((round) => round.status === 'Active').length;
    const totalRaised = mappedRounds.reduce((sum, round) => sum + round.raised, 0);
    const avgRoundSize = mappedRounds.length
      ? mappedRounds.reduce((sum, round) => sum + ((round.raised + round.target) / 2), 0) / mappedRounds.length
      : 0;
    const exits = mappedRounds.filter((round) => round.status === 'Closed').length;

    return {
      active,
      totalRaised,
      avgRoundSize,
      exits
    };
  }, [mappedRounds]);

  const topIndustries = useMemo(() => {
    const totals = new Map();
    mappedRounds.forEach((round) => {
      if (!round.industries.length) {
        totals.set('General', (totals.get('General') || 0) + round.target);
        return;
      }
      round.industries.forEach((industry) => {
        totals.set(industry, (totals.get(industry) || 0) + round.target);
      });
    });

    return [...totals.entries()]
      .map(([industry, amount]) => ({ industry, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [mappedRounds]);

  const maxIndustryAmount = Math.max(...topIndustries.map((item) => item.amount), 1);

  const fundingTrend = useMemo(() => {
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'];
    const now = new Date();
    const buckets = monthNames.map((label, index) => {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      const key = `${monthDate.getFullYear()}-${monthDate.getMonth()}`;
      return { label, key, value: 0 };
    });

    mappedRounds.forEach((round) => {
      const date = new Date(round.createdAt || Date.now());
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const bucket = buckets.find((item) => item.key === key);
      if (bucket) {
        bucket.value += round.target;
      }
    });

    return buckets;
  }, [mappedRounds]);

  const maxTrend = Math.max(...fundingTrend.map((item) => item.value), 1);

  const recentActivity = useMemo(() => {
    return [...mappedRounds]
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 4)
      .map((round) => ({
        text:
          round.status === 'Closed'
            ? `${round.startup} round closed successfully.`
            : round.status === 'Pending Approval'
            ? `${round.startup} awaiting approval.`
            : round.status === 'On Hold'
            ? `${round.startup} round put on hold.`
            : `${round.startup} round is active.`,
        date: new Date(round.createdAt || Date.now())
      }));
  }, [mappedRounds]);

  const exportCsv = () => {
    const headers = ['Startup', 'Stage', 'Raised', 'Target', 'Progress', 'Status', 'Investors'];
    const rows = filteredRounds.map((round) => [
      round.startup,
      round.stage,
      round.raised,
      round.target,
      `${round.progress}%`,
      round.status,
      round.investors
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'funding-rounds.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const statusColor = (status) => {
    if (status === 'Active') return 'text-emerald-500';
    if (status === 'Closed') return 'text-slate-500';
    if (status === 'Pending Approval') return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen w-full bg-[#f5f7f8] dark:bg-[#0d1219] text-slate-900 dark:text-white flex" style={{ fontFamily: 'Manrope, sans-serif' }}>
      <AdminSidebar go={go} activeView="admin-funding-rounds" />

      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-20 bg-white/90 dark:bg-[#0d1219]/90 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-extrabold">Funding Rounds Management</h1>
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search rounds or startups..."
                  className="h-10 w-72 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d93f2]/20"
                />
              </div>
              <button className="h-10 rounded-full bg-[#0d93f2] px-4 text-sm font-bold text-white">+ Create New Round</button>
            </div>
          </div>
        </header>

        <div className="p-6">
          <div className="mb-5 flex flex-wrap gap-2">
            <select value={stageFilter} onChange={(event) => setStageFilter(event.target.value)} className="h-9 rounded-full border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600">
              {stageOptions.map((stage) => (
                <option key={stage} value={stage}>{`Stage: ${stage}`}</option>
              ))}
            </select>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-9 rounded-full border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600">
              {['All', 'Active', 'Pending Approval', 'On Hold', 'Closed'].map((status) => (
                <option key={status} value={status}>{`Status: ${status}`}</option>
              ))}
            </select>
            <select value={industryFilter} onChange={(event) => setIndustryFilter(event.target.value)} className="h-9 rounded-full border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600">
              {industryOptions.map((industry) => (
                <option key={industry} value={industry}>{`Industry: ${industry}`}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <p className="text-xs text-slate-500">Total Active Rounds</p>
              <p className="mt-2 text-4xl font-extrabold">{kpis.active}</p>
              <p className="text-xs font-bold text-emerald-500 mt-1">Live data</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <p className="text-xs text-slate-500">Total Funds Raised</p>
              <p className="mt-2 text-4xl font-extrabold">{formatMoney(kpis.totalRaised)}</p>
              <p className="text-xs font-bold text-emerald-500 mt-1">From startup rounds</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <p className="text-xs text-slate-500">Avg. Round Size</p>
              <p className="mt-2 text-4xl font-extrabold">{formatMoney(kpis.avgRoundSize)}</p>
              <p className="text-xs font-bold text-emerald-500 mt-1">Computed average</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <p className="text-xs text-slate-500">Successful Exits</p>
              <p className="mt-2 text-4xl font-extrabold">{kpis.exits}</p>
              <p className="text-xs font-bold text-red-500 mt-1">Closed rounds</p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr,280px] gap-6">
            <section className="rounded-3xl border border-slate-200 bg-white overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                <h2 className="text-xl font-bold">Active Funding Rounds</h2>
                <button onClick={exportCsv} className="text-sm font-bold text-[#0d93f2]">Export CSV</button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr className="text-[11px] uppercase tracking-wider text-slate-500">
                      <th className="px-4 py-3">Startup</th>
                      <th className="px-4 py-3">Stage</th>
                      <th className="px-4 py-3">Progress</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Investors</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td className="px-4 py-6 text-sm text-slate-500" colSpan={5}>Loading rounds...</td>
                      </tr>
                    ) : paginatedRounds.length === 0 ? (
                      <tr>
                        <td className="px-4 py-6 text-sm text-slate-500" colSpan={5}>No rounds found for current filters.</td>
                      </tr>
                    ) : (
                      paginatedRounds.map((round) => (
                        <tr key={round.id} className="border-b border-slate-100 text-sm">
                          <td className="px-4 py-4">
                            <p className="font-semibold">{round.startup}</p>
                            <p className="text-xs text-slate-500">{round.industries[0] || 'General'}</p>
                          </td>
                          <td className="px-4 py-4">
                            <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">{round.stage}</span>
                          </td>
                          <td className="px-4 py-4 min-w-[200px]">
                            <p className="text-[11px] text-slate-500 mb-1">{`${formatCompactMoney(round.raised)} raised`}</p>
                            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                              <div className="h-2 rounded-full bg-[#0d93f2]" style={{ width: `${round.progress}%` }} />
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1">Target: {formatCompactMoney(round.target)}</p>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`text-xs font-bold ${statusColor(round.status)}`}>● {round.status}</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm font-semibold">{round.investors}</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between px-4 py-3 text-xs text-slate-500">
                <p>{`Showing ${(page - 1) * pageSize + 1}-${Math.min(page * pageSize, filteredRounds.length)} of ${filteredRounds.length} rounds`}</p>
                <div className="flex items-center gap-2">
                  <button disabled={page <= 1} onClick={() => setPage((prev) => Math.max(1, prev - 1))} className="size-7 rounded-full border border-slate-200 disabled:opacity-40">‹</button>
                  {Array.from({ length: Math.min(totalPages, 4) }).map((_, index) => {
                    const number = index + 1;
                    return (
                      <button
                        key={number}
                        onClick={() => setPage(number)}
                        className={`size-7 rounded-full border text-[11px] font-bold ${page === number ? 'bg-[#0d93f2] border-[#0d93f2] text-white' : 'border-slate-200 text-slate-500'}`}
                      >
                        {number}
                      </button>
                    );
                  })}
                  <button disabled={page >= totalPages} onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} className="size-7 rounded-full border border-slate-200 disabled:opacity-40">›</button>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-5">
                <h3 className="text-sm font-bold mb-4">TOP INDUSTRIES</h3>
                <div className="space-y-3">
                  {topIndustries.length === 0 ? (
                    <p className="text-xs text-slate-500">No data yet</p>
                  ) : (
                    topIndustries.map((item) => (
                      <div key={item.industry}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <p className="font-medium text-slate-600">{item.industry}</p>
                          <p className="text-slate-500">{formatCompactMoney(item.amount)}</p>
                        </div>
                        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-2 rounded-full bg-[#0d93f2]" style={{ width: `${Math.max(8, (item.amount / maxIndustryAmount) * 100)}%` }} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold">FUNDING TREND</h3>
                  <span className="text-[10px] font-bold text-emerald-500">6 MONTHS</span>
                </div>
                <div className="h-40 flex items-end gap-2">
                  {fundingTrend.map((item) => (
                    <div key={item.key} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t-xl bg-[#0d93f2]/80"
                        style={{ height: `${Math.max(14, (item.value / maxTrend) * 100)}px` }}
                      />
                      <span className="text-[10px] text-slate-500">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5">
                <h3 className="text-sm font-bold mb-4">RECENT ACTIVITY</h3>
                <div className="space-y-3">
                  {recentActivity.length === 0 ? (
                    <p className="text-xs text-slate-500">No recent activity</p>
                  ) : (
                    recentActivity.map((activity, index) => (
                      <div key={`${activity.text}-${index}`} className="flex items-start gap-2">
                        <span className="mt-0.5 text-emerald-500 text-xs">●</span>
                        <div>
                          <p className="text-xs font-medium text-slate-700 leading-5">{activity.text}</p>
                          <p className="text-[10px] text-slate-500">
                            {new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

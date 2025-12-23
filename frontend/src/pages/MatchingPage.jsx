import React, { useEffect, useState } from 'react';
import client from '../api/client.js';
import MatchCard from '../components/MatchCard.jsx';

export default function MatchingPage({ user, go }) {
  const startupId = localStorage.getItem('activeStartup');
  const [matches, setMatches] = useState([]);
  const [investors, setInvestors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true); setError(null);
    try {
      const { data } = await client.get(`/ai/match/${startupId}`);
      setMatches(data.topMatches || []);
      const allIds = [...new Set((data.topMatches||[]).map(m=>m.investorId))];
      // naive fetch of all investors list
      const { data: invList } = await client.get('/investors');
      const map = {}; invList.forEach(i => { map[i._id] = i; });
      setInvestors(map);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{ if (startupId) load(); }, [startupId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-indigo-50/40 p-8">
      <div className="max-w-6xl mx-auto">
        <button 
          className="text-sm text-gray-600 hover:text-teal-600 mb-6 flex items-center gap-2 transition" 
          onClick={()=>go('startup-dashboard')}
        >
          ← Back to Dashboard
        </button>
        <h2 className="text-3xl font-bold mb-2">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">🤖 AI Investor Matches</span>
        </h2>
        <p className="text-gray-600 mb-8">Top recommended investors for your startup based on AI analysis.</p>
        {loading && (
          <div className="bg-white/80 backdrop-blur p-8 rounded-2xl border border-gray-100 text-center">
            <p className="text-gray-500">Loading your matches...</p>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-2xl mb-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        <div className="grid gap-6 md:grid-cols-2">
          {matches.map(m => <MatchCard key={m.investorId} match={m} investor={investors[m.investorId]} />)}
        </div>
        {!loading && !matches.length && (
          <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 p-12 rounded-2xl text-center border border-gray-100">
            <p className="text-gray-500 text-lg">No matches yet</p>
            <p className="text-gray-400 text-sm mt-2">Add more keywords or industries to improve matching.</p>
          </div>
        )}
      </div>
    </div>
  );
}

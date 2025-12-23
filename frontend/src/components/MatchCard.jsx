import React from 'react';

export default function MatchCard({ match, investor }) {
  return (
    <div className="border border-gray-100 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">{investor?.name || 'Investor'}</h3>
        <span className={`px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm ${
          match.score >= 80 
            ? 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700' 
            : 'bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700'
        }`}>
          {match.score}% Match
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-teal-500 to-blue-600 rounded-full transition-all" 
          style={{ width: match.score + '%' }} 
        />
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{match.reason}</p>
      <button className="text-sm bg-gradient-to-r from-teal-500 to-blue-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition mt-2 self-start">
        Email Investor
      </button>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import client from '../api/client.js';

function roleLabel(role) {
  if (!role) return 'User';
  return String(role).charAt(0).toUpperCase() + String(role).slice(1);
}

export default function UserSearchResults({ query, isOpen, user, go, onSelect }) {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;

    const normalizedQuery = String(query || '').trim();
    if (normalizedQuery.length < 2) {
      setResults([]);
      setIsLoading(false);
      return undefined;
    }

    const timer = setTimeout(async () => {
      try {
        setIsLoading(true);
        const response = await client.get('/auth/search-users', {
          params: { q: normalizedQuery, limit: 8 }
        });
        setResults(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error searching users:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  const handleOpenProfile = (selectedUser) => {
    if (!selectedUser?.id) return;

    localStorage.setItem('publicProfileUserId', String(selectedUser.id));

    if (onSelect) onSelect();
    go('public-profile');
  };

  const handleMessageUser = (selectedUser) => {
    if (!selectedUser?.id) return;

    localStorage.setItem(
      'messagePartner',
      JSON.stringify({
        id: selectedUser.id,
        name: selectedUser.name,
        role: selectedUser.role,
        subtitle: selectedUser.subtitle
      })
    );

    if (onSelect) onSelect();
    go('messages');
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 right-0 z-30 mt-2 max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-[#111a22]">
      {String(query || '').trim().length < 2 ? (
        <p className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">Type at least 2 letters to search</p>
      ) : isLoading ? (
        <p className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">Searching...</p>
      ) : results.length === 0 ? (
        <p className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">No users found</p>
      ) : (
        results.map((result) => {
          const isSelf = String(result.id) === String(user?.id);

          return (
            <div key={result.id} className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0 dark:border-slate-800">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => !isSelf && handleOpenProfile(result)}
                disabled={isSelf}
                className="min-w-0 flex-1 text-left disabled:cursor-not-allowed disabled:opacity-60"
              >
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{result.name}</p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">{result.subtitle || roleLabel(result.role)}</p>
              </button>
              <div className="flex items-center gap-2 shrink-0">
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {isSelf ? 'You' : roleLabel(result.role)}
                </span>
                {!isSelf && (
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleMessageUser(result)}
                    className="rounded-lg bg-[#0d93f2] px-3 py-1.5 text-[11px] font-bold text-white hover:bg-blue-600"
                  >
                    Message
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

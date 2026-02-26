import React from 'react';

export default function AdminSidebar({ go, activeView = 'admin-dashboard' }) {
  const isActive = (view) => activeView === view;

  const baseItemClass = 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors w-full text-left';

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0d1219] sticky top-0 h-screen">
      <div className="p-6 flex items-center gap-3 cursor-pointer" onClick={() => go('admin-dashboard')}>
        <div className="bg-[#0d93f2] size-10 rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-white">admin_panel_settings</span>
        </div>
        <div>
          <h1 className="font-bold text-base leading-tight text-slate-900 dark:text-white">Admin Central</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Platform Management</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        <button
          onClick={() => go('admin-dashboard')}
          className={`${baseItemClass} ${isActive('admin-dashboard') ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'hover:bg-slate-100 text-slate-600 dark:hover:bg-slate-800 dark:text-slate-400'}`}
        >
          <span className="material-symbols-outlined text-xl">dashboard</span>
          <span className={`text-sm ${isActive('admin-dashboard') ? 'font-semibold' : 'font-medium'}`}>Dashboard</span>
        </button>

        <button
          onClick={() => go('admin-users')}
          className={`${baseItemClass} ${isActive('admin-users') ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'hover:bg-slate-100 text-slate-600 dark:hover:bg-slate-800 dark:text-slate-400'}`}
        >
          <span className="material-symbols-outlined text-xl">group</span>
          <span className={`text-sm ${isActive('admin-users') ? 'font-semibold' : 'font-medium'}`}>User Management</span>
        </button>

        <button className={`${baseItemClass} hover:bg-slate-100 text-slate-600 dark:hover:bg-slate-800 dark:text-slate-400`}>
          <span className="material-symbols-outlined text-xl">trending_up</span>
          <span className="text-sm font-medium">Funding Rounds</span>
        </button>

        <button
          onClick={() => go('community')}
          className={`${baseItemClass} ${isActive('community') ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'hover:bg-slate-100 text-slate-600 dark:hover:bg-slate-800 dark:text-slate-400'}`}
        >
          <span className="material-symbols-outlined text-xl">forum</span>
          <span className={`text-sm ${isActive('community') ? 'font-semibold' : 'font-medium'}`}>Community Feed</span>
        </button>

        <button
          onClick={() => go('admin-moderation')}
          className={`${baseItemClass} ${isActive('admin-moderation') ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'hover:bg-slate-100 text-slate-600 dark:hover:bg-slate-800 dark:text-slate-400'}`}
        >
          <span className="material-symbols-outlined text-xl">shield_person</span>
          <span className={`text-sm ${isActive('admin-moderation') ? 'font-semibold' : 'font-medium'}`}>Moderation</span>
        </button>
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 mt-auto">
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 relative overflow-hidden border border-slate-200 dark:border-slate-700">
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full blur-2xl" />
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">System</span>
              <div className="size-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">System Healthy</p>
            <p className="text-[10px] text-slate-500">v4.2.0 - Stable</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

import React from 'react';

export default function StartupSidebar({ user, go, activeView = 'startup-dashboard', notificationCount = 0 }) {
  const isActive = (view) => activeView === view;
  const baseItemClass = 'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors';

  const itemClass = (view) =>
    `${baseItemClass} ${
      isActive(view)
        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
    }`;

  return (
    <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-[#111a22] lg:flex">
      <div className="flex h-full flex-col justify-between overflow-y-auto">
        <div>
          <div className="flex cursor-pointer items-center gap-3 px-6 py-6" onClick={() => go('landing')}>
            <div className="flex size-10 items-center justify-center rounded-lg bg-[#0d93f2]/15">
              <span className="material-symbols-outlined text-[#0d93f2]">rocket_launch</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-base font-bold leading-tight text-slate-900 dark:text-white">{user?.name || 'Startup'}</h1>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Startup</p>
            </div>
          </div>

          <nav className="space-y-1 px-4 py-4">
            <button onClick={() => go('startup-dashboard')} className={itemClass('startup-dashboard')}>
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: isActive('startup-dashboard') ? '"FILL" 1' : '"FILL" 0' }}>dashboard</span>
              <span className={`text-sm ${isActive('startup-dashboard') ? 'font-semibold' : 'font-medium'}`}>Dashboard</span>
            </button>
            <button onClick={() => go('startup-profile')} className={itemClass('startup-profile')}>
              <span className="material-symbols-outlined text-xl">person</span>
              <span className={`text-sm ${isActive('startup-profile') ? 'font-semibold' : 'font-medium'}`}>Profile</span>
            </button>
            <button onClick={() => go('startup-funding')} className={itemClass('startup-funding')}>
              <span className="material-symbols-outlined text-xl">monetization_on</span>
              <span className={`text-sm ${isActive('startup-funding') ? 'font-semibold' : 'font-medium'}`}>Funding Requests</span>
            </button>
            <button onClick={() => go('startup-connect')} className={itemClass('startup-connect')}>
              <span className="material-symbols-outlined text-xl">groups</span>
              <span className={`text-sm ${isActive('startup-connect') ? 'font-semibold' : 'font-medium'}`}>Investor Connect</span>
            </button>
            <button onClick={() => go('community')} className={itemClass('community')}>
              <span className="material-symbols-outlined text-xl">forum</span>
              <span className={`text-sm ${isActive('community') ? 'font-semibold' : 'font-medium'}`}>Community Feed</span>
            </button>
            <button onClick={() => go('messages')} className={itemClass('messages')}>
              <span className="material-symbols-outlined text-xl">chat</span>
              <span className={`text-sm ${isActive('messages') ? 'font-semibold' : 'font-medium'}`}>Messages</span>
            </button>
            <button onClick={() => go('notifications')} className={itemClass('notifications')}>
              <div className="relative">
                <span className="material-symbols-outlined text-xl">notifications</span>
                {notificationCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-[#111a22]">{notificationCount}</span>
                )}
              </div>
              <span className={`text-sm ${isActive('notifications') ? 'font-semibold' : 'font-medium'}`}>Notifications</span>
            </button>
            <button onClick={() => go('settings')} className={itemClass('settings')}>
              <span className="material-symbols-outlined text-xl">settings</span>
              <span className={`text-sm ${isActive('settings') ? 'font-semibold' : 'font-medium'}`}>Settings</span>
            </button>
          </nav>
        </div>
      </div>
    </aside>
  );
}

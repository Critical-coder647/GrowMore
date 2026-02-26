import React from 'react';

export default function InvestorSidebar({ user, go, activeView = 'investor-dashboard', notificationCount = 0 }) {
  const isActive = (view) => activeView === view;
  const baseItemClass = 'flex w-full items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left';

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
          <div className="flex items-center gap-3 px-6 py-6 cursor-pointer" onClick={() => go('landing')}>
            <div className="size-10 rounded-lg bg-[#0d93f2]/15 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#0d93f2]">paid</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-slate-900 dark:text-white text-base font-bold leading-tight">{user?.name || 'Investor'}</h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium leading-normal">Investor</p>
            </div>
          </div>

          <nav className="space-y-1 px-4 py-4">
            <button onClick={() => go('investor-dashboard')} className={itemClass('investor-dashboard')}>
              <span className="material-symbols-outlined text-xl">dashboard</span>
              <p className={`text-sm ${isActive('investor-dashboard') ? 'font-semibold' : 'font-medium'} leading-normal`}>Dashboard</p>
            </button>
            <button onClick={() => go('investor-profile')} className={itemClass('investor-profile')}>
              <span className="material-symbols-outlined text-xl">person</span>
              <p className={`text-sm ${isActive('investor-profile') ? 'font-semibold' : 'font-medium'} leading-normal`}>Profile</p>
            </button>
            <button onClick={() => go('investor-connect')} className={itemClass('investor-connect')}>
              <span className="material-symbols-outlined text-xl">rocket_launch</span>
              <p className={`text-sm ${isActive('investor-connect') ? 'font-semibold' : 'font-medium'} leading-normal`}>Discover Startups</p>
            </button>
            <button onClick={() => go('community')} className={itemClass('community')}>
              <span className="material-symbols-outlined text-xl">groups</span>
              <p className={`text-sm ${isActive('community') ? 'font-semibold' : 'font-medium'} leading-normal`}>Community</p>
            </button>
            <button onClick={() => go('messages')} className={itemClass('messages')}>
              <span className="material-symbols-outlined text-xl">chat</span>
              <p className={`text-sm ${isActive('messages') ? 'font-semibold' : 'font-medium'} leading-normal`}>Messages</p>
            </button>
            <button onClick={() => go('notifications')} className={itemClass('notifications')}>
              <span className="material-symbols-outlined text-xl">notifications</span>
              <div className="flex flex-1 items-center justify-between">
                <p className={`text-sm ${isActive('notifications') ? 'font-semibold' : 'font-medium'} leading-normal`}>Notifications</p>
                {notificationCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">{notificationCount}</span>
                )}
              </div>
            </button>
            <button onClick={() => go('settings')} className={itemClass('settings')}>
              <span className="material-symbols-outlined text-xl">settings</span>
              <p className={`text-sm ${isActive('settings') ? 'font-semibold' : 'font-medium'} leading-normal`}>Settings</p>
            </button>
          </nav>
        </div>
      </div>
    </aside>
  );
}

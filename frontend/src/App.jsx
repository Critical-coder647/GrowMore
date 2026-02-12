import React, { useState, useEffect } from 'react';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import StartupDashboard from './pages/startup/StartupDashboard.jsx';
import StartupConnectPage from './pages/startup/StartupConnectPage.jsx';
import StartupProfile from './pages/startup/StartupProfile.jsx';
import ProfileStep1BasicDetails from './pages/startup/ProfileStep1BasicDetails.jsx';
import ProfileStep2BusinessDetails from './pages/startup/ProfileStep2BusinessDetails.jsx';
import ProfileStep3FundingRequirements from './pages/startup/ProfileStep3FundingRequirements.jsx';
import ProfileStep4ProfilePreview from './pages/startup/ProfileStep4ProfilePreview.jsx';
import ProfileStep5ProfileAcceptance from './pages/startup/ProfileStep5ProfileAcceptance.jsx';
import MatchingPage from './pages/MatchingPage.jsx';
import Landing from './pages/Landing.jsx';
import InvestorDashboard from './pages/investor/InvestorDashboard.jsx';
import InvestorConnectPage from './pages/investor/InvestorConnectPage.jsx';
import InvestorProfile from './pages/investor/InvestorProfile.jsx';
import CommunityFeed from './pages/CommunityFeed.jsx';
import Settings from './pages/Settings.jsx';
import NotificationPage from './pages/Notficationpg.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import CommunityModeration from './pages/admin/CommunityModeration.jsx';
import UserVerification from './pages/admin/UserVerification.jsx';
import MessagesPage from './pages/Messages.jsx';

export default function App() {
  const storedToken = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  
  // If there's a token but no valid user, clear everything
  if (storedToken && (!storedUser || storedUser === 'null')) {
    localStorage.clear();
  }
  
  const [view, setView] = useState(storedToken && storedUser && storedUser !== 'null' ? 
    (JSON.parse(storedUser).role === 'startup' ? 'startup-dashboard' : JSON.parse(storedUser).role === 'admin' ? 'admin-dashboard' : 'investor-dashboard') : 
    'landing'
  );
  const [token, setToken] = useState(storedToken && storedUser && storedUser !== 'null' ? storedToken : null);
  const [user, setUser] = useState(storedToken && storedUser && storedUser !== 'null' ? JSON.parse(storedUser) : null);
  const go = v => setView(v);

  // Apply saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  function handleAuth({ token, user }) {
    setToken(token);
    setUser(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    if (user.role === 'startup') setView('profile-step-1');
    else if (user.role === 'investor') setView('investor-dashboard');
    else if (user.role === 'admin') setView('admin-dashboard');
    else setView('login');
  }

  function logout() {
    localStorage.clear();
    setToken(null); setUser(null); setView('landing');
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f7f8] dark:bg-[#101b22]">
      {view !== 'investor-dashboard' && view !== 'startup-dashboard' && view !== 'admin-dashboard' && view !== 'admin-moderation' && view !== 'admin-users' && view !== 'startup-profile' && view !== 'investor-profile' && view !== 'landing' && view !== 'register' && view !== 'settings' && view !== 'community' && view !== 'notifications' && view !== 'messages' && view !== 'profile-step-1' && view !== 'profile-step-2' && view !== 'profile-step-3' && view !== 'profile-step-4' && view !== 'profile-step-5' && (
        <nav className="sticky top-0 z-50 bg-[#f5f7f8]/90 dark:bg-[#101b22]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <div className="flex justify-center w-full">
            <div className="flex items-center justify-between w-full max-w-7xl px-6 py-4">
              <div 
                className="flex items-center gap-3 cursor-pointer" 
                onClick={()=>go(token? (user?.role === 'startup' ? 'startup-dashboard' : user?.role === 'admin' ? 'admin-dashboard' : 'investor-dashboard') : 'landing')}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#0d93f2]/10 text-[#0d93f2]">
                  <span className="material-symbols-outlined text-2xl">rocket_launch</span>
                </div>
                <h2 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight">GrowMore</h2>
              </div>
              <div className="flex items-center gap-4">
                {!token && (
                  <>
                    <button 
                      onClick={()=>go('login')} 
                      className="hidden sm:flex items-center justify-center h-10 px-5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold transition-colors"
                    >
                      Login
                    </button>
                    <button 
                      onClick={()=>go('register')} 
                      className="flex items-center justify-center h-10 px-5 rounded-lg bg-[#0d93f2] hover:bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition-all transform hover:scale-105"
                    >
                      Get Started
                    </button>
                  </>
                )}
                {token && (
                  <>
                    <button 
                      onClick={()=>go(user?.role === 'startup' ? 'startup-dashboard' : user?.role === 'admin' ? 'admin-dashboard' : 'investor-dashboard')} 
                      className="text-slate-600 dark:text-slate-300 hover:text-[#0d93f2] font-medium text-sm transition-colors"
                    >
                      Dashboard
                    </button>
                    <button 
                      onClick={()=>go('settings')} 
                      className="h-10 px-5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold transition-colors"
                    >
                      Settings
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
      )}
      <main className="flex-1">
        {!token && view === 'landing' && <Landing go={go} />}
        {!token && view === 'login' && <Login onAuth={handleAuth} go={go} />}
        {!token && view === 'register' && <Register onAuth={handleAuth} go={go} />}
        {token && view === 'profile-step-1' && <ProfileStep1BasicDetails user={user} go={go} />}
        {token && view === 'profile-step-2' && <ProfileStep2BusinessDetails user={user} go={go} />}
        {token && view === 'profile-step-3' && <ProfileStep3FundingRequirements user={user} go={go} />}
        {token && view === 'profile-step-4' && <ProfileStep4ProfilePreview user={user} go={go} />}
        {token && view === 'profile-step-5' && <ProfileStep5ProfileAcceptance user={user} go={go} />}
        {token && view === 'startup-dashboard' && <StartupDashboard user={user} go={go} />}
        {token && view === 'startup-profile' && <StartupProfile user={user} go={go} />}
        {token && view === 'startup-connect' && <StartupConnectPage user={user} go={go} />}
        {token && view === 'investor-dashboard' && <InvestorDashboard user={user} go={go} />}
        {token && view === 'investor-profile' && <InvestorProfile user={user} go={go} />}
        {token && view === 'investor-connect' && <InvestorConnectPage user={user} go={go} />}
        {token && view === 'admin-dashboard' && <AdminDashboard user={user} go={go} />}
        {token && view === 'admin-moderation' && <CommunityModeration user={user} go={go} />}
        {token && view === 'admin-users' && <UserVerification user={user} go={go} />}
        {token && view === 'messages' && <MessagesPage user={user} go={go} />}
        {token && view === 'community' && <CommunityFeed user={user} go={go} />}
        {token && view === 'notifications' && <NotificationPage user={user} go={go} />}
        {token && view === 'settings' && <Settings user={user} go={go} logout={logout} />}
        {token && view === 'matching' && <div className="max-w-6xl mx-auto p-6"><MatchingPage user={user} go={go} /></div>}
      </main>
      {view !== 'investor-dashboard' && view !== 'startup-dashboard' && view !== 'admin-dashboard' && view !== 'admin-moderation' && view !== 'admin-users' && view !== 'startup-profile' && view !== 'investor-profile' && view !== 'landing' && view !== 'register' && view !== 'community' && view !== 'settings' && view !== 'messages' && view !== 'profile-step-1' && view !== 'profile-step-2' && view !== 'profile-step-3' && view !== 'profile-step-4' && view !== 'profile-step-5' && view !== 'investor-connect' && (
        <footer className="py-8 text-center border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} GrowMore Inc. All rights reserved.
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Made with <span className="text-red-500">♥</span> for builders
          </p>
        </footer>
      )}
    </div>
  );
}

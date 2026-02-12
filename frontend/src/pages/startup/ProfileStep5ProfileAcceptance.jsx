import React from 'react';

function ProfileStep5ProfileAcceptance({ user, go }) {
  const handleDashboard = () => {
    go('startup-dashboard');
  };

  const handlePreview = () => {
    go('profile-step-4');
  };

  const handleEdit = () => {
    go('profile-step-1');
  };

  const handleCommunity = () => {
    go('community-feed');
  };

  return (
    <>
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        {/* Navbar */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark px-6 lg:px-10 py-3 sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <button onClick={handleDashboard} className="size-8 text-primary flex items-center justify-center hover:opacity-80 transition-opacity">
              <span className="material-symbols-outlined !text-[32px]">
                rocket_launch
              </span>
            </button>
            <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
              FundRaise
            </h2>
          </div>
          {/* Desktop Nav */}
          <div className="hidden lg:flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <button
                onClick={handleDashboard}
                className="text-slate-900 dark:text-white text-sm font-medium hover:text-primary transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={handleCommunity}
                className="text-slate-900 dark:text-white text-sm font-medium hover:text-primary transition-colors"
              >
                Community
              </button>
              <button
                onClick={() => go('matching-page')}
                className="text-slate-900 dark:text-white text-sm font-medium hover:text-primary transition-colors"
              >
                Investors
              </button>
              <button
                onClick={() => go('messages')}
                className="text-slate-900 dark:text-white text-sm font-medium hover:text-primary transition-colors"
              >
                Messages
              </button>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => go('notifications')}
                className="flex items-center justify-center rounded-xl size-10 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button 
                onClick={() => go('settings')}
                className="flex items-center justify-center rounded-xl size-10 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <span className="material-symbols-outlined">account_circle</span>
              </button>
            </div>
          </div>
          {/* Mobile Menu Icon (Placeholder) */}
          <button className="lg:hidden flex items-center justify-center text-slate-900 dark:text-white">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </header>
    {/* Main Content */}
    <div className="flex-1 flex flex-col items-center py-8 lg:py-12 px-4 sm:px-6">
      <div className="w-full max-w-[960px] flex flex-col gap-10">
        {/* Success Hero Section */}
        <div className="flex flex-col items-center gap-6 text-center animate-fade-in-up">
          <div className="flex items-center justify-center size-24 rounded-full bg-green-100 dark:bg-green-900/30 text-green-500 mb-2">
            <span className="material-symbols-outlined !text-[64px]">
              check_circle
            </span>
          </div>
          <div className="max-w-[600px] flex flex-col gap-3">
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Profile Submitted Successfully!
            </h1>
            <p className="text-base lg:text-lg text-slate-600 dark:text-slate-400">
              Thanks for completing your startup profile. We've received your
              data and our team is already on it.
            </p>
          </div>
        </div>
        {/* Status & Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 mt-4">
          {/* Timeline Section */}
          <div className="bg-white dark:bg-slate-800/50 rounded-xl p-6 lg:p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">
              Application Status
            </h3>
            <div className="grid grid-cols-[32px_1fr] gap-x-4">
              {/* Step 1: Done */}
              <div className="flex flex-col items-center">
                <div className="text-green-500 bg-white dark:bg-slate-800 z-10">
                  <span className="material-symbols-outlined fill-1">
                    check_circle
                  </span>
                </div>
                <div className="w-[2px] bg-green-500 h-full min-h-[40px]" />
              </div>
              <div className="pb-8 pt-0.5">
                <p className="text-slate-900 dark:text-white text-base font-bold leading-none mb-1">
                  Submission Received
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Completed just now
                </p>
              </div>
              {/* Step 2: Active */}
              <div className="flex flex-col items-center">
                <div className="text-primary bg-white dark:bg-slate-800 z-10 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-20" />
                  <span className="material-symbols-outlined relative z-10 fill-1">
                    sync
                  </span>
                </div>
                <div className="w-[2px] bg-slate-200 dark:bg-slate-700 h-full min-h-[40px]" />
              </div>
              <div className="pb-8 pt-0.5">
                <p className="text-slate-900 dark:text-white text-base font-bold leading-none mb-1">
                  Quality Review
                </p>
                <p className="text-primary text-sm font-medium">
                  In progress (approx 24-48h)
                </p>
              </div>
              {/* Step 3: Pending */}
              <div className="flex flex-col items-center">
                <div className="text-slate-300 dark:text-slate-600 bg-white dark:bg-slate-800 z-10">
                  <span className="material-symbols-outlined">visibility</span>
                </div>
              </div>
              <div className="pt-0.5">
                <p className="text-slate-400 dark:text-slate-500 text-base font-bold leading-none mb-1">
                  Visible to Investors
                </p>
                <p className="text-slate-400 dark:text-slate-500 text-sm">
                  Pending approval
                </p>
              </div>
            </div>
          </div>
          {/* Info Card Section */}
          <div className="flex flex-col h-full">
            <div className="bg-primary/5 dark:bg-primary/10 border border-primary/10 rounded-xl p-6 lg:p-8 flex flex-col justify-center h-full gap-6">
              <div className="flex items-center gap-3 text-primary">
                <span className="material-symbols-outlined !text-[28px]">
                  info
                </span>
                <span className="font-bold text-lg">
                  What happens during review?
                </span>
              </div>
              <div className="space-y-4">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  Our team manually reviews all startups to ensure quality for
                  our investor network. We verify your:
                </p>
                <ul className="space-y-3">
                  <li className="flex gap-3 text-slate-700 dark:text-slate-300 text-sm font-medium">
                    <span className="material-symbols-outlined text-primary !text-[20px]">
                      assignment_turned_in
                    </span>
                    Pitch deck completeness
                  </li>
                  <li className="flex gap-3 text-slate-700 dark:text-slate-300 text-sm font-medium">
                    <span className="material-symbols-outlined text-primary !text-[20px]">
                      domain_verification
                    </span>
                    Business registration validity
                  </li>
                  <li className="flex gap-3 text-slate-700 dark:text-slate-300 text-sm font-medium">
                    <span className="material-symbols-outlined text-primary !text-[20px]">
                      verified_user
                    </span>
                    Founder identity check
                  </li>
                </ul>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-4 border-t border-primary/10 pt-4">
                  You will receive an email notification immediately once your
                  profile is live.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex flex-col items-center gap-6 mt-6">
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-[580px]">
            <button 
              onClick={handleDashboard}
              className="flex-1 h-12 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined">dashboard</span>
              Go to Founder Dashboard
            </button>
            <button 
              onClick={handlePreview}
              className="flex-1 h-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <span className="material-symbols-outlined">preview</span>
              Preview Public Profile
            </button>
          </div>
          <button 
            onClick={handleEdit}
            className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary underline decoration-slate-300 underline-offset-4 transition-colors"
          >
            Made a mistake? Edit Submission
          </button>
        </div>
        {/* Community Teaser */}
        <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-8 w-full flex justify-center">
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 max-w-2xl">
            <div className="size-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
              <span className="material-symbols-outlined">groups</span>
            </div>
            <div className="text-center sm:text-left">
              <h4 className="font-bold text-slate-900 dark:text-white">
                Join the conversation
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                While you wait for approval, introduce your startup to our
                community of 5,000+ founders.
              </p>
            </div>
            <button 
              onClick={handleCommunity}
              className="shrink-0 text-primary font-bold text-sm hover:underline px-4"
            >
              Go to Community →
            </button>
          </div>
        </div>
      </div>
    </div>
      </div>
    </>
  );
}

export default ProfileStep5ProfileAcceptance;

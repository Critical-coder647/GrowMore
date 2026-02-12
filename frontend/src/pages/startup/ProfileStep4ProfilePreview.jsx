import React, { useState, useEffect } from 'react';

function ProfileStep4ProfilePreview({ user, go }) {
  const [profileData, setProfileData] = useState({});
  const [logoPreview, setLogoPreview] = useState('');
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    // Load saved data from all previous steps
    const saved = localStorage.getItem('profileSetupData');
    if (saved) {
      const data = JSON.parse(saved);
      setProfileData(data);
      
      // Load logo preview if exists
      if (data.logo) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setLogoPreview(reader.result);
        };
        if (data.logo instanceof File) {
          reader.readAsDataURL(data.logo);
        }
      }
    }
  }, []);

  const handlePrevious = () => {
    go('profile-step-3');
  };

  const handleSubmit = () => {
    go('profile-step-5');
  };

  const handleEdit = (step) => {
    go(`profile-step-${step}`);
  };

  const handleExit = () => {
    go('startup-dashboard');
  };

  return (
    <>
      <div className="relative flex min-h-screen flex-col overflow-x-hidden">
        {/* Top Navigation */}
        <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e7eef4] dark:border-b-gray-800 bg-white dark:bg-[#111a22] px-10 py-3 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={handleExit} className="size-8 text-primary hover:opacity-80 transition-opacity">
              <svg
                className="w-full h-full"
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z"
                  fill="currentColor"
                  fillRule="evenodd"
                />
                <path
                  clipRule="evenodd"
                  d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z"
                  fill="currentColor"
                  fillRule="evenodd"
                />
              </svg>
            </button>
            <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">
              FundRaise - Step 4
            </h2>
          </div>
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-9">
              <button
                onClick={() => go('startup-dashboard')}
                className="text-sm font-medium leading-normal hover:text-primary transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={() => go('community-feed')}
                className="text-sm font-medium leading-normal hover:text-primary transition-colors"
              >
                Community
              </button>
              <button
                onClick={() => go('matching-page')}
                className="text-sm font-medium leading-normal hover:text-primary transition-colors"
              >
                Investors
              </button>
            </div>
            {user && (
              <div className="flex items-center gap-4">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 border border-gray-200"
                  style={{
                    backgroundImage: user.profilePicture 
                      ? `url(${user.profilePicture})`
                      : 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAvgoi_6c4Sgbja1b24BpD_nLRSersdYNTAe45yclG543LNOuWC8oQZN9zbGKMZeNM269V_MYRUnSk7xfeSoREEPArNCqEMnzi--eHRmJs8aqLnQ2Lm7dhs2r8EkdWLCtaE6nN5od3jYupfKWcDDzjknzSrpb7iJFyY8BlEHeccQN0eObEqfU1GhzE5QkbTKjrNOzQ7hKZU4AoH4HbxmTkyyFES9VCC09IVxH6J3Be1_XEnQlTEWtzzO-hcq4ItcOJc5vG5b5ivDr0")'
                  }}
                />
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 px-4 py-8 md:px-10 lg:px-40">
          <div className="mx-auto max-w-[1200px] flex flex-col gap-6">
        {/* Page Heading & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-[#0d161c] dark:text-white">
              Profile Preview
            </h1>
            <p className="text-[#497a9c] dark:text-slate-400 mt-1">
              Review your startup profile exactly as investors will see it.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handlePrevious}
              className="flex items-center justify-center h-10 px-6 rounded-xl bg-white dark:bg-slate-800 border border-[#e7eef4] dark:border-slate-700 text-[#0d161c] dark:text-white text-sm font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <span className="material-symbols-outlined mr-2 text-base">arrow_back</span>
              Previous
            </button>
            <button 
              onClick={handleSubmit}
              className="flex items-center justify-center h-10 px-6 rounded-xl bg-primary text-white text-sm font-bold hover:bg-blue-600 transition-colors shadow-md shadow-blue-200 dark:shadow-none"
            >
              Submit Profile
              <span className="material-symbols-outlined ml-2 text-base">send</span>
            </button>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-white dark:bg-[#111a22] rounded-xl p-6 border border-[#e7eef4] dark:border-slate-800 shadow-sm">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-end">
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                Step 4 of 5
              </span>
              <span className="text-sm font-medium text-slate-500">
                Ready to launch
              </span>
            </div>
            <div className="w-full h-2 bg-[#cedde8] dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-700"
                style={{ width: "80%" }}
              />
            </div>
            <div className="flex justify-between text-xs font-medium text-slate-400 mt-1">
              <span>Basic Info</span>
              <span>Business Details</span>
              <span>Funding</span>
              <span className="text-primary font-bold">Preview</span>
              <span>Submit</span>
            </div>
          </div>
        </div>
        {/* Warning/Info Banner */}
        {showBanner && (
          <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 text-blue-900 dark:text-blue-100">
            <span className="material-symbols-outlined text-primary mt-0.5">
              info
            </span>
            <div>
              <p className="font-bold text-sm">Review Carefully</p>
              <p className="text-sm opacity-90">
                Once submitted, your profile will be locked for review for
                approximately 24 hours. Ensure all financial figures are accurate.
              </p>
            </div>
            <button 
              onClick={() => setShowBanner(false)}
              className="ml-auto text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-white"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        )}
        {/* Main Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (Main Content) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Header Card */}
            <div className="bg-white dark:bg-[#111a22] rounded-xl border border-[#e7eef4] dark:border-slate-800 shadow-sm overflow-hidden">
              <div
                className="h-32 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-slate-800 dark:to-slate-700"
                data-alt="Abstract blue gradient background pattern"
              />
              <div className="px-6 pb-6">
                <div className="relative flex justify-between items-start -mt-12 mb-4">
                  <div className="bg-white dark:bg-[#111a22] p-1.5 rounded-2xl shadow-sm inline-block">
                    <div
                      className="size-24 rounded-xl bg-cover bg-center border border-slate-100 dark:border-slate-700"
                      style={{
                        backgroundImage: logoPreview 
                          ? `url(${logoPreview})`
                          : 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCerLYM-UMEJzQOzqzNHqSJ1HoOyftqRwasF32xOOsof2R67k2dXKJmQEuOjjJM0D3HpgdNrHje8DitsOwhLNaok9u8vrhJuV7IaqJuurVamund9jh-W9bbgK1RcLCwTJDYxCTsQBD25LUabXdlqRKlKu63A595LOpj1FTQ4o6XQpwpVaQCdkdDYv3qqmfYi7fsqPlqJiEEgCI0cNlccUNKGkwPM2YZZpJxKsR76RuXZlKheDfiYiNVr9aaK62W6JUzMxKbqoD9aOU")'
                      }}
                    />
                  </div>
                  <button 
                    onClick={() => handleEdit(1)}
                    className="mt-14 flex items-center gap-2 text-primary hover:text-blue-700 text-sm font-bold bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      edit
                    </span>
                    Edit
                  </button>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[#0d161c] dark:text-white mb-1">
                    {profileData.companyName || 'Your Company Name'}
                  </h2>
                  <p className="text-lg text-[#497a9c] dark:text-slate-400 font-medium mb-3">
                    {profileData.elevatorPitch || 'Your elevator pitch will appear here'}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {profileData.location && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wide">
                        <span className="material-symbols-outlined text-[16px]">
                          location_on
                        </span>
                        {profileData.location}
                      </div>
                    )}
                    {profileData.foundingDate && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wide">
                        <span className="material-symbols-outlined text-[16px]">
                          calendar_month
                        </span>
                        Founded {new Date(profileData.foundingDate).getFullYear()}
                      </div>
                    )}
                    {profileData.fundingStage && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wide">
                        <span className="material-symbols-outlined text-[16px]">
                          rocket_launch
                        </span>
                        {profileData.fundingStage}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Business Details */}
            <div className="bg-white dark:bg-[#111a22] rounded-xl border border-[#e7eef4] dark:border-slate-800 shadow-sm p-6">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-bold text-[#0d161c] dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    business_center
                  </span>
                  Business Details
                </h3>
                <button 
                  onClick={() => handleEdit(2)}
                  className="text-slate-400 hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined">edit</span>
                </button>
              </div>
              <div className="space-y-6">
                {profileData.problemStatement && (
                  <div>
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
                      The Problem
                    </h4>
                    <p className="text-[#0d161c] dark:text-slate-300 leading-relaxed">
                      {profileData.problemStatement}
                    </p>
                  </div>
                )}
                {profileData.solution && (
                  <div>
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
                      The Solution
                    </h4>
                    <p className="text-[#0d161c] dark:text-slate-300 leading-relaxed">
                      {profileData.solution}
                    </p>
                  </div>
                )}
                {(profileData.tam || profileData.sam || profileData.som) && (
                  <div>
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Market Size
                    </h4>
                    <div className="flex gap-4 mt-3">
                      {profileData.tam && (
                        <div className="flex-1 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg text-center">
                          <p className="text-xs text-slate-500 mb-1">TAM</p>
                          <p className="text-xl font-black text-[#0d161c] dark:text-white">
                            ${profileData.tam}
                          </p>
                        </div>
                      )}
                      {profileData.sam && (
                        <div className="flex-1 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg text-center">
                          <p className="text-xs text-slate-500 mb-1">SAM</p>
                          <p className="text-xl font-black text-[#0d161c] dark:text-white">
                            ${profileData.sam}
                          </p>
                        </div>
                      )}
                      {profileData.som && (
                        <div className="flex-1 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg text-center">
                          <p className="text-xs text-slate-500 mb-1">SOM</p>
                          <p className="text-xl font-black text-[#0d161c] dark:text-white">
                            ${profileData.som}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Team & Media */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Team */}
              <div className="bg-white dark:bg-[#111a22] rounded-xl border border-[#e7eef4] dark:border-slate-800 shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-[#0d161c] dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">
                      diversity_3
                    </span>
                    Team
                  </h3>
                  <button className="text-slate-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="size-12 rounded-full bg-cover bg-center"
                      data-alt="Portrait of Sarah Jenkins, CEO"
                      style={{
                        backgroundImage:
                          'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBKWfILaKLKeLBqbbcF_we4ugdraC-KkcHGpj9K1z3yYnFS328D5dnxHtWnJlLKbqV2t3siKv863L_fJkNv8RwV8I7RztHo2x6ZShUJrL_mlT1L2rVOnwtyhrDCul02QNZ8ES7z1XV2DMN9iHpB294g5GZk9yiPxFGZDzW0RpsTACsf9OQ5bEb9lkn2FKejf32p7D-f-Tqp6kEyLhZ2jtnVG_qEoC0MNwQjnnEhlsmkHVhLgdNaSP66iL2HgzI1NTtiPDb92wKBAl0")'
                      }}
                    />
                    <div>
                      <p className="font-bold text-[#0d161c] dark:text-white">
                        Sarah Jenkins
                      </p>
                      <p className="text-sm text-slate-500">
                        CEO &amp; Co-Founder
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className="size-12 rounded-full bg-cover bg-center"
                      data-alt="Portrait of David Chen, CTO"
                      style={{
                        backgroundImage:
                          'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAC7X8EpAliYrR2SUWUBDoyUm2bXt1RTuHf5jz9w2tNVDkmpECnMKaYnDjx6QY2FSv3N8BoGBq2BeRuzwiZr2Iq8qADhBb7UKmXEkfvzzsiegkVkupZHosCSrKs9hxRrZkCNA2Ttd-VM-ZgWKrJCTKqjcPvHEwc-yUDCvNa5CbzK88Yd6abpx1XaBcXru23fSoDHrMonbGXw5nCTt9XwKSK92pQptwZkElQcoWT_d0_aAzzj3zfJLGRY08lzjMfoOZBp8UpPv_-V9E")'
                      }}
                    />
                    <div>
                      <p className="font-bold text-[#0d161c] dark:text-white">
                        David Chen
                      </p>
                      <p className="text-sm text-slate-500">CTO</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className="size-12 rounded-full bg-cover bg-center"
                      data-alt="Portrait of Emily Rodriguez, COO"
                      style={{
                        backgroundImage:
                          'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCD-KTNpcCLfe7WMQsstlIhKHNmRs1v756bA9Im_ouHpHgL6OCDDWbxPTpEyeEkTCWhCcb7nqKaTznK_XJYcWT1Ilg4dbB7XhIMeeQt6vhRHC607JXKfEYjXmnPNr5IIf39VauE7pRnigXdsbaAWnEdSHlo97jWUF25XKqeQoM5qBgjoPG46kLG--J3eTSGZPYf7h55g1GtC8AU_qw4JRFl1zMuSt0t3B2EvD1c8RJzUOdN8xIs57vhIrvf_Pg5yEDUmMqX2UmKk5s")'
                      }}
                    />
                    <div>
                      <p className="font-bold text-[#0d161c] dark:text-white">
                        Emily Rodriguez
                      </p>
                      <p className="text-sm text-slate-500">Head of Product</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Pitch Deck/Media */}
              <div className="bg-white dark:bg-[#111a22] rounded-xl border border-[#e7eef4] dark:border-slate-800 shadow-sm p-6 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-[#0d161c] dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">
                      play_circle
                    </span>
                    Pitch &amp; Demo
                  </h3>
                  <button className="text-slate-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                </div>
                <div className="flex-1 flex flex-col gap-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group">
                    <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 size-10 rounded-lg flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined">
                        picture_as_pdf
                      </span>
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-medium text-sm truncate dark:text-white group-hover:text-primary transition-colors">
                        TechNova_SeriesA_Deck.pdf
                      </p>
                      <p className="text-xs text-slate-500">
                        3.2 MB • Uploaded 2 hrs ago
                      </p>
                    </div>
                  </div>
                  <div
                    className="flex-1 relative rounded-lg overflow-hidden bg-black group cursor-pointer"
                    style={{ minHeight: 120 }}
                  >
                    <img
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-50 transition-opacity"
                      data-alt="Video thumbnail showing a dashboard interface"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcB1J8jmN38CpLNzZYfOEBMYdIElOftG456XH-G9g1aD2jBJFwP-yC9uaJMvz_Cvc7yeXDGD3kwRHEk5NZpr-AZuwa81LSNtjhBTwfHG_ebsIJE4_X59G1yiPREFrr6yARU9oHcTTUbk_01D0moGM_wIUJQNdK_odd_OSZrdqa5yQCGASUFwa-k9qmKK7TT5BjayS6qCKxXJ4iDooVU9Q31olg31UdaAJyetdhVHt76bWvFdXvq1niqtRrM_s4i4Yj2YU3oMk9uXE"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="size-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-white text-3xl">
                          play_arrow
                        </span>
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 rounded text-xs text-white font-medium">
                      02:15
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Right Sidebar */}
          <div className="flex flex-col gap-6">
            {/* Funding Ask Card */}
            <div className="bg-white dark:bg-[#111a22] rounded-xl border border-primary/20 dark:border-primary/40 shadow-sm p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <span className="material-symbols-outlined text-9xl text-primary transform rotate-12">
                  monetization_on
                </span>
              </div>
              <div className="flex justify-between items-center mb-6 relative z-10">
                <h3 className="text-lg font-bold text-[#0d161c] dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    savings
                  </span>
                  Funding Ask
                </h3>
                <button 
                  onClick={() => handleEdit(3)}
                  className="text-slate-400 hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined">edit</span>
                </button>
              </div>
              <div className="flex flex-col gap-6 relative z-10">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">
                    Target Raise
                  </p>
                  <p className="text-4xl font-black text-primary tracking-tight">
                    ${profileData.fundingGoal ? Number(profileData.fundingGoal).toLocaleString() : '0'}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {profileData.minInvestment && (
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-1">
                        Min Investment
                      </p>
                      <p className="text-2xl font-bold text-[#0d161c] dark:text-white">
                        ${Number(profileData.minInvestment).toLocaleString()}
                      </p>
                    </div>
                  )}
                  {profileData.maxInvestment && (
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-1">
                        Max Investment
                      </p>
                      <p className="text-2xl font-bold text-[#0d161c] dark:text-white">
                        ${Number(profileData.maxInvestment).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
                {profileData.fundingPurpose && (
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-2">
                      Funding Purpose
                    </p>
                    <p className="text-sm text-[#0d161c] dark:text-slate-300">
                      {profileData.fundingPurpose}
                    </p>
                  </div>
                )}
              </div>
            </div>
            {/* Info & Tags */}
            <div className="bg-white dark:bg-[#111a22] rounded-xl border border-[#e7eef4] dark:border-slate-800 shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-[#0d161c] dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    info
                  </span>
                  Details
                </h3>
                <button 
                  onClick={() => handleEdit(1)}
                  className="text-slate-400 hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined">edit</span>
                </button>
              </div>
              <div className="space-y-4">
                {profileData.industry && (
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                      Industry
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center justify-center px-3 py-1.5 rounded-lg bg-[#e7eef4] dark:bg-slate-800 text-[#0d161c] dark:text-slate-200 text-sm font-medium">
                        {profileData.industry}
                      </div>
                    </div>
                  </div>
                )}
                <hr className="border-slate-100 dark:border-slate-800" />
                {profileData.website && (
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                      Website
                    </p>
                    <ul className="space-y-2">
                      <li>
                        <a
                          className="flex items-center gap-2 text-sm text-[#0d161c] dark:text-slate-300 hover:text-primary transition-colors"
                          href={profileData.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="material-symbols-outlined text-slate-400 text-[18px]">
                            language
                          </span>
                          {profileData.website}
                          <span className="material-symbols-outlined text-slate-300 text-[14px] ml-auto">
                            open_in_new
                          </span>
                        </a>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
          </div> 
        </main>
      </div>
    </>
  );
}

export default ProfileStep4ProfilePreview;

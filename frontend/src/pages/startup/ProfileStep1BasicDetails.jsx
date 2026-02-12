import React, { useState, useEffect } from 'react';

function ProfileStep1BasicDetails({ user, go }) {
  const [formData, setFormData] = useState({
    logo: null,
    companyName: '',
    industry: '',
    location: '',
    website: '',
    elevatorPitch: '',
    description: ''
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load saved data
    const saved = localStorage.getItem('profileSetupData');
    if (saved) {
      const data = JSON.parse(saved);
      setFormData(prev => ({
        ...prev,
        companyName: data.companyName || '',
        industry: data.industry || '',
        location: data.location || '',
        website: data.website || '',
        elevatorPitch: data.elevatorPitch || '',
        description: data.description || ''
      }));
      if (data.logoPreview) {
        setLogoPreview(data.logoPreview);
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, logo: file }));
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = () => {
    if (!formData.companyName.trim() || !formData.industry) {
      setError('Please fill in company name and industry');
      return;
    }

    // Save data
    const dataToSave = {
      ...formData,
      logoPreview: logoPreview
    };
    localStorage.setItem('profileSetupData', JSON.stringify(dataToSave));
    go('profile-step-2');
  };

  const handleExit = () => {
    go('startup-dashboard');
  };

  const handleSaveDraft = () => {
    const dataToSave = { ...formData, logoPreview };
    localStorage.setItem('profileSetupData', JSON.stringify(dataToSave));
    alert('Draft saved successfully!');
  };

  const pitchLength = formData.elevatorPitch.length;

  return (
    <>
      <meta charSet="utf-8" />
      <meta content="width=device-width, initial-scale=1.0" name="viewport" />
      <title>GrowMore - Startup Profile Setup</title>
      <style>{`
        textarea::-webkit-scrollbar {
          width: 8px;
        }
        textarea::-webkit-scrollbar-track {
          background: transparent;
        }
        textarea::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
        .dark textarea::-webkit-scrollbar-thumb {
          background-color: #334155;
        }
      `}</style>
      <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-[#15232d] px-6 md:px-10 py-3 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0d93f2] text-white">
            <span className="material-symbols-outlined text-xl">rocket_launch</span>
          </div>
          <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">
            GrowMore
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleSaveDraft}
            className="hidden sm:flex text-slate-500 dark:text-slate-400 text-sm font-semibold hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            Save as Draft
          </button>
          <button 
            onClick={handleExit}
            className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-sm font-bold leading-normal transition-colors border border-slate-200 dark:border-slate-700"
          >
            <span className="mr-2">Exit Setup</span>
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      </header>
      <main className="flex-1 w-full max-w-[1200px] mx-auto p-6 md:p-10 flex flex-col gap-8">
        {/* Progress Steps */}
        <div className="w-full mb-4">
          <div className="relative flex items-center justify-between w-full max-w-4xl mx-auto px-2">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg -z-10" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#0d93f2] rounded-lg -z-10 w-[5%] sm:w-[10%] transition-all duration-700" />
            
            {[
              { num: 1, label: 'Basic Info' },
              { num: 2, label: 'Team Info' },
              { num: 3, label: 'Market & Product' },
              { num: 4, label: 'Financials' },
              { num: 5, label: 'Review' }
            ].map((step) => (
              <div key={step.num} className="relative flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ring-4 transition-transform hover:scale-105 cursor-default z-10 ${
                  step.num === 1 
                    ? 'bg-[#0d93f2] text-white ring-[#0d93f2]/20 shadow-sm' 
                    : 'bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 ring-slate-100 dark:ring-slate-800'
                }`}>
                  {step.num}
                </div>
                <span className={`absolute top-12 text-xs font-bold whitespace-nowrap hidden sm:block ${
                  step.num === 1 ? 'text-[#0d93f2]' : 'text-slate-500 dark:text-slate-400 font-medium'
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
          <div className="h-16" />
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Title */}
            <div className="flex flex-col gap-2">
              <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-extrabold tracking-tight">
                Let's start with the basics
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-lg">
                This information helps investors find you based on their investment thesis.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Form Container */}
            <div className="flex flex-col gap-6 bg-white dark:bg-[#15232d] p-6 md:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              {/* Logo Upload */}
              <div className="flex flex-col gap-4">
                <label className="text-slate-900 dark:text-slate-200 text-base font-semibold">
                  Company Logo
                </label>
                <div className="flex items-center gap-6">
                  <div className="relative group cursor-pointer w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center hover:border-[#0d93f2] transition-colors overflow-hidden">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-3xl text-slate-400 group-hover:text-[#0d93f2] transition-colors">
                        add_photo_alternate
                      </span>
                    )}
                    <input
                      accept="image/*"
                      aria-label="Upload logo"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      type="file"
                      onChange={handleLogoChange}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="logo-input" className="text-[#0d93f2] font-bold text-sm hover:underline text-left cursor-pointer">
                      Upload Image
                    </label>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">
                      JPG, PNG or GIF. Max size 2MB.
                      <br />
                      Recommended size: 400x400px
                    </p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-100 dark:bg-slate-800 w-full" />

              {/* Company Name & Industry */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="flex flex-col w-full">
                  <p className="text-slate-900 dark:text-slate-200 text-base font-semibold pb-2">
                    Company Name
                  </p>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-12 px-4 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#0d93f2] focus:ring-1 focus:ring-[#0d93f2] focus:outline-none transition-shadow"
                    placeholder="e.g. Acme Corp"
                  />
                </label>
                <label className="flex flex-col w-full">
                  <p className="text-slate-900 dark:text-slate-200 text-base font-semibold pb-2">
                    Industry / Sector
                  </p>
                  <div className="relative">
                    <select 
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      className="w-full appearance-none rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-12 px-4 pr-10 text-base text-slate-900 dark:text-white focus:border-[#0d93f2] focus:ring-1 focus:ring-[#0d93f2] focus:outline-none transition-shadow cursor-pointer"
                    >
                      <option value="">Select an industry</option>
                      <option value="fintech">Fintech</option>
                      <option value="saas">SaaS</option>
                      <option value="healthtech">HealthTech</option>
                      <option value="ecommerce">E-commerce</option>
                      <option value="ai">Artificial Intelligence</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </label>
              </div>

              {/* Location & Website */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="flex flex-col w-full">
                  <p className="text-slate-900 dark:text-slate-200 text-base font-semibold pb-2">
                    Location
                  </p>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      location_on
                    </span>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-12 pl-10 pr-4 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#0d93f2] focus:ring-1 focus:ring-[#0d93f2] focus:outline-none transition-shadow"
                      placeholder="City, Country"
                    />
                  </div>
                </label>
                <label className="flex flex-col w-full">
                  <p className="text-slate-900 dark:text-slate-200 text-base font-semibold pb-2">
                    Website URL
                  </p>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      language
                    </span>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-12 pl-10 pr-4 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#0d93f2] focus:ring-1 focus:ring-[#0d93f2] focus:outline-none transition-shadow"
                      placeholder="https://"
                    />
                  </div>
                </label>
              </div>

              {/* Elevator Pitch */}
              <label className="flex flex-col w-full">
                <div className="flex justify-between items-baseline pb-2">
                  <p className="text-slate-900 dark:text-slate-200 text-base font-semibold">
                    Elevator Pitch
                  </p>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    {pitchLength}/140
                  </span>
                </div>
                <textarea
                  name="elevatorPitch"
                  value={formData.elevatorPitch}
                  onChange={handleInputChange}
                  maxLength={140}
                  className="w-full resize-none rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#0d93f2] focus:ring-1 focus:ring-[#0d93f2] focus:outline-none transition-shadow min-h-[100px]"
                  placeholder="Briefly describe your startup in one sentence."
                />
                <p className="text-slate-500 text-sm mt-2">
                  This will appear on your card in the investor feed.
                </p>
              </label>

              {/* Company Description */}
              <label className="flex flex-col w-full">
                <p className="text-slate-900 dark:text-slate-200 text-base font-semibold pb-2">
                  Company Description
                </p>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full resize-y rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#0d93f2] focus:ring-1 focus:ring-[#0d93f2] focus:outline-none transition-shadow min-h-[200px]"
                  placeholder="Tell us more about the problem you are solving, your solution, and your vision..."
                />
              </label>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button 
                onClick={handleSaveDraft}
                className="flex sm:hidden text-slate-500 dark:text-slate-400 font-semibold px-4 py-2"
              >
                Save Draft
              </button>
              <button 
                onClick={handleContinue}
                className="flex items-center justify-center rounded-lg bg-[#0d93f2] hover:bg-blue-600 text-white text-base font-bold h-12 px-8 transition-colors shadow-lg shadow-blue-500/30"
              >
                Save & Continue
                <span className="material-symbols-outlined ml-2 text-lg">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-6 sticky top-24">
            {/* Pro Tip Card */}
            <div className="flex flex-col gap-4 rounded-xl bg-[#0d93f2]/10 dark:bg-[#0d93f2]/5 p-6 border border-[#0d93f2]/20">
              <div className="flex items-center gap-3 text-[#0d93f2]">
                <span className="material-symbols-outlined">lightbulb</span>
                <h3 className="font-bold text-lg">Pro Tip</h3>
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                Startups with a clear, jargon-free 1-sentence pitch get{" "}
                <span className="font-bold">2x more profile views</span> from investors.
              </p>
              <div className="bg-white dark:bg-[#15232d] p-4 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm mt-2">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-2 font-bold">
                  Good Example
                </p>
                <p className="text-slate-600 dark:text-slate-400 italic text-sm">
                  "We help remote teams collaborate 30% faster through AI-powered meeting summaries."
                </p>
              </div>
            </div>

            {/* Card Preview */}
            <div className="flex flex-col gap-3">
              <p className="text-slate-900 dark:text-white text-sm font-semibold ml-1">
                Card Preview
              </p>
              <div className="bg-white dark:bg-[#15232d] rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100 transition-opacity">
                <div className="h-24 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-slate-800 dark:to-slate-700" />
                <div className="p-4 -mt-8">
                  <div className="w-16 h-16 rounded-xl bg-white dark:bg-slate-800 shadow-md flex items-center justify-center text-slate-300 border border-slate-100 dark:border-slate-700 mb-3 overflow-hidden">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-3xl">
                        storefront
                      </span>
                    )}
                  </div>
                  <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-slate-50 dark:bg-slate-800 rounded w-1/2 mb-4" />
                  <div className="h-16 bg-slate-50 dark:bg-slate-800 rounded w-full border border-slate-100 dark:border-slate-700 border-dashed flex items-center justify-center text-xs text-slate-400 text-center px-4">
                    {formData.elevatorPitch || 'Your pitch will appear here'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 text-center text-slate-400 dark:text-slate-600 text-sm">
        <p>© 2024 GrowMore. All rights reserved.</p>
      </footer>
    </>
  );
}

export default ProfileStep1BasicDetails;
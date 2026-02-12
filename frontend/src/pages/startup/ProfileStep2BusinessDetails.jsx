import React, { useState, useEffect } from 'react';

function ProfileStep2BusinessDetails({ user, go }) {
  const [formData, setFormData] = useState({
    website: '',
    foundingDate: '',
    fundingStage: '',
    industry: '',
    problemStatement: '',
    solution: '',
    tam: '',
    sam: '',
    som: '',
    pitchDeck: null
  });

  const [teamMembers, setTeamMembers] = useState([]);
  const [error, setError] = useState('');
  const [postToFeed, setPostToFeed] = useState(false);

  useEffect(() => {
    // Load saved data from Step 1 and Step 2
    const saved = localStorage.getItem('profileSetupData');
    if (saved) {
      const data = JSON.parse(saved);
      setFormData(prev => ({
        ...prev,
        website: data.website || '',
        foundingDate: data.foundingDate || '',
        fundingStage: data.fundingStage || '',
        industry: data.industry || '',
        problemStatement: data.problemStatement || '',
        solution: data.solution || '',
        tam: data.tam || '',
        sam: data.sam || '',
        som: data.som || ''
      }));
      if (data.teamMembers) setTeamMembers(data.teamMembers);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf' && file.size <= 10 * 1024 * 1024) {
        setFormData(prev => ({ ...prev, pitchDeck: file }));
        setError('');
      } else {
        setError('Please upload a PDF file smaller than 10MB');
      }
    }
  };

  const handleContinue = () => {
    if (!formData.problemStatement.trim() || !formData.solution.trim()) {
      setError('Please fill in problem statement and solution');
      return;
    }

    // Save data
    const dataToSave = {
      ...formData,
      teamMembers,
      postToFeed
    };
    localStorage.setItem('profileSetupData', JSON.stringify(dataToSave));
    go('profile-step-3');
  };

  const handlePrevious = () => {
    const dataToSave = { ...formData, teamMembers, postToFeed };
    localStorage.setItem('profileSetupData', JSON.stringify(dataToSave));
    go('profile-step-1');
  };

  const handleExit = () => {
    go('startup-dashboard');
  };

  const handleSaveDraft = () => {
    const dataToSave = { ...formData, teamMembers, postToFeed };
    localStorage.setItem('profileSetupData', JSON.stringify(dataToSave));
    alert('Draft saved successfully!');
  };

  return (
    
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 md:px-10 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button onClick={handleExit} className="flex items-center justify-center rounded-full size-10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex items-center gap-2 text-slate-900 dark:text-white">
            <span className="material-symbols-outlined text-2xl text-[#0d93f2]">
              rocket_launch
            </span>
            <h2 className="text-slate-900 dark:text-white text-lg font-bold">
              FundRaise - Step 2
            </h2>
          </div>
        </div>
        <button 
          onClick={handleSaveDraft}
          className="hidden sm:flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 font-semibold text-sm"
        >
          <span className="material-symbols-outlined text-lg">save</span>
          Save Draft
        </button>
      </header>
      <main className="flex-1 w-full max-w-[1200px] mx-auto p-6 md:p-10 flex flex-col gap-8">
        {/* Progress Steps */}
        <div className="w-full mb-4">
          <div className="relative flex items-center justify-between w-full max-w-4xl mx-auto px-2">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg -z-10" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#0d93f2] rounded-lg -z-10 w-[40%] transition-all duration-700" />
            
            {[
              { num: 1, label: 'Basic Info' },
              { num: 2, label: 'Business Details' },
              { num: 3, label: 'Funding' },
              { num: 4, label: 'Preview' },
              { num: 5, label: 'Submit' }
            ].map((step) => (
              <div key={step.num} className="relative flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ring-4 transition-transform hover:scale-105 cursor-default z-10 ${
                  step.num <= 2
                    ? 'bg-[#0d93f2] text-white ring-[#0d93f2]/20 shadow-sm' 
                    : 'bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 ring-slate-100 dark:ring-slate-800'
                }`}>
                  {step.num === 1 && <span className="material-symbols-outlined text-base">check</span>}
                  {step.num !== 1 && step.num}
                </div>
                <span className={`absolute top-12 text-xs font-bold whitespace-nowrap hidden sm:block ${
                  step.num <= 2 ? 'text-[#0d93f2]' : 'text-slate-500 dark:text-slate-400 font-medium'
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
          <div className="h-16" />
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Title */}
        <div className="flex flex-col gap-2 mb-4">
          <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-extrabold tracking-tight">
            Business Details
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Tell investors why your startup is the next big thing. Be specific and concise.
          </p>
        </div>
        <div className="flex flex-col gap-8 bg-white dark:bg-[#15232d] p-6 md:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          {/* Core Details Section */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Core Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="flex flex-col">
                <p className="text-slate-900 dark:text-slate-200 text-base font-semibold pb-2">
                  Company Website
                </p>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-12 px-4 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#0d93f2] focus:ring-1 focus:ring-[#0d93f2] focus:outline-none transition-shadow"
                  placeholder="https://www.yourstartup.com"
                />
              </label>
              <label className="flex flex-col">
                <p className="text-slate-900 dark:text-slate-200 text-base font-semibold pb-2">
                  Founding Date
                </p>
                <input
                  type="date"
                  name="foundingDate"
                  value={formData.foundingDate}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-12 px-4 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#0d93f2] focus:ring-1 focus:ring-[#0d93f2] focus:outline-none transition-shadow"
                />
              </label>
              <label className="flex flex-col">
                <p className="text-slate-900 dark:text-slate-200 text-base font-semibold pb-2">
                  Funding Stage
                </p>
                <select 
                  name="fundingStage"
                  value={formData.fundingStage}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-12 px-4 text-base text-slate-900 dark:text-white focus:border-[#0d93f2] focus:ring-1 focus:ring-[#0d93f2] focus:outline-none transition-shadow cursor-pointer"
                >
                  <option value="">Select your current stage</option>
                  <option value="pre-seed">Pre-Seed</option>
                  <option value="seed">Seed</option>
                  <option value="series-a">Series A</option>
                  <option value="series-b">Series B+</option>
                </select>
              </label>
              <label className="flex flex-col">
                <p className="text-slate-900 dark:text-slate-200 text-base font-semibold pb-2">
                  Industry
                </p>
                <select 
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-12 px-4 text-base text-slate-900 dark:text-white focus:border-[#0d93f2] focus:ring-1 focus:ring-[#0d93f2] focus:outline-none transition-shadow cursor-pointer"
                >
                  <option value="">Select primary industry</option>
                  <option value="fintech">FinTech</option>
                  <option value="healthtech">HealthTech</option>
                  <option value="saas">SaaS</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="ai">Artificial Intelligence</option>
                </select>
              </label>
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800 w-full" />

          {/* Narrative Section */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">The Narrative</h3>
            <label className="flex flex-col">
              <div className="flex justify-between items-baseline pb-2">
                <p className="text-slate-900 dark:text-slate-200 text-base font-semibold">
                  Problem Statement
                </p>
                <span className="text-xs text-slate-400">{formData.problemStatement.length}/500</span>
              </div>
              <textarea
                name="problemStatement"
                value={formData.problemStatement}
                onChange={handleInputChange}
                maxLength={500}
                className="w-full resize-y rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#0d93f2] focus:ring-1 focus:ring-[#0d93f2] focus:outline-none transition-shadow min-h-[120px]"
                placeholder="Describe the pain point your customers are facing..."
              />
            </label>
            <label className="flex flex-col">
              <div className="flex justify-between items-baseline pb-2">
                <p className="text-slate-900 dark:text-slate-200 text-base font-semibold">
                  Solution & Product
                </p>
                <span className="text-xs text-slate-400">{formData.solution.length}/500</span>
              </div>
              <textarea
                name="solution"
                value={formData.solution}
                onChange={handleInputChange}
                maxLength={500}
                className="w-full resize-y rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#0d93f2] focus:ring-1 focus:ring-[#0d93f2] focus:outline-none transition-shadow min-h-[120px]"
                placeholder="How does your product solve the problem?"
              />
            </label>
            <label className="flex flex-col gap-3">
              <p className="text-slate-900 dark:text-slate-200 text-base font-semibold">
                Pitch Deck
              </p>
              <div className="group border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:border-[#0d93f2] hover:bg-blue-50/50 dark:hover:bg-slate-800 transition-all cursor-pointer relative">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <span className="material-symbols-outlined text-4xl text-slate-400 mb-3 group-hover:text-[#0d93f2] transition-colors">
                  cloud_upload
                </span>
                <p className="text-slate-900 dark:text-white font-medium text-sm">
                  Click to upload or drag and drop
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  PDF only (max. 10MB)
                </p>
                {formData.pitchDeck && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                    ✓ {formData.pitchDeck.name}
                  </p>
                )}
              </div>
            </label>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800 w-full" />

          {/* Market Size Section */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Market Size</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex flex-col">
                <p className="text-slate-900 dark:text-slate-200 text-base font-semibold pb-2">
                  TAM ($)
                </p>
                <input
                  type="text"
                  name="tam"
                  value={formData.tam}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-12 px-4 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#0d93f2] focus:ring-1 focus:ring-[#0d93f2] focus:outline-none transition-shadow"
                  placeholder="e.g. 50B"
                />
              </label>
              <label className="flex flex-col">
                <p className="text-slate-900 dark:text-slate-200 text-base font-semibold pb-2">
                  SAM ($)
                </p>
                <input
                  type="text"
                  name="sam"
                  value={formData.sam}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-12 px-4 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#0d93f2] focus:ring-1 focus:ring-[#0d93f2] focus:outline-none transition-shadow"
                  placeholder="e.g. 10B"
                />
              </label>
              <label className="flex flex-col">
                <p className="text-slate-900 dark:text-slate-200 text-base font-semibold pb-2">
                  SOM ($)
                </p>
                <input
                  type="text"
                  name="som"
                  value={formData.som}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-12 px-4 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#0d93f2] focus:ring-1 focus:ring-[#0d93f2] focus:outline-none transition-shadow"
                  placeholder="e.g. 100M"
                />
              </label>
            </div>
          </div>

          {/* Community Feed Checkbox */}
          <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <input
              type="checkbox"
              id="postToFeed"
              checked={postToFeed}
              onChange={(e) => setPostToFeed(e.target.checked)}
              className="w-5 h-5 rounded cursor-pointer"
            />
            <label htmlFor="postToFeed" className="text-slate-700 dark:text-slate-300 text-sm font-medium cursor-pointer flex-1">
              Post update to community feed
            </label>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          <button 
            onClick={handlePrevious}
            className="flex items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-base font-bold h-12 px-8 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined mr-2">arrow_back</span>
            Previous
          </button>
          <div className="flex items-center gap-3 flex-1 justify-end">
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
              <span className="material-symbols-outlined ml-2 text-lg">arrow_forward</span>
            </button>
          </div>
        </div>
      </main>

      <footer className="mt-auto py-8 text-center text-slate-400 dark:text-slate-600 text-sm">
        <p>© 2024 GrowMore. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default ProfileStep2BusinessDetails;
import React, { useState, useEffect } from 'react';

function ProfileStep3FundingRequirements({ user, go }) {
  const [formData, setFormData] = useState({
    fundingGoal: '',
    minInvestment: '',
    maxInvestment: '',
    fundingPurpose: '',
    usageBreakdown: '',
    traction: ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    // Load saved data from previous steps
    const saved = localStorage.getItem('profileSetupData');
    if (saved) {
      const data = JSON.parse(saved);
      setFormData(prev => ({
        ...prev,
        fundingGoal: data.fundingGoal || '',
        minInvestment: data.minInvestment || '',
        maxInvestment: data.maxInvestment || '',
        fundingPurpose: data.fundingPurpose || '',
        usageBreakdown: data.usageBreakdown || '',
        traction: data.traction || ''
      }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleContinue = () => {
    if (!formData.fundingGoal.trim() || !formData.fundingPurpose.trim()) {
      setError('Please fill in funding goal and purpose');
      return;
    }

    // Save data
    const dataToSave = formData;
    localStorage.setItem('profileSetupData', JSON.stringify(dataToSave));
    go('profile-step-4');
  };

  const handlePrevious = () => {
    const dataToSave = formData;
    localStorage.setItem('profileSetupData', JSON.stringify(dataToSave));
    go('profile-step-2');
  };

  const handleExit = () => {
    go('startup-dashboard');
  };

  const handleSaveDraft = () => {
    localStorage.setItem('profileSetupData', JSON.stringify(formData));
    alert('Draft saved successfully!');
  };

  return (
    <>
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
                FundRaise - Step 3
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
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#0d93f2] rounded-lg -z-10 w-[60%] transition-all duration-700" />
            
            {[
              { num: 1, label: 'Basic Info' },
              { num: 2, label: 'Business Details' },
              { num: 3, label: 'Funding' },
              { num: 4, label: 'Preview' },
              { num: 5, label: 'Submit' }
            ].map((step) => (
              <div key={step.num} className="relative flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ring-4 transition-transform hover:scale-105 cursor-default z-10 ${
                  step.num <= 3
                    ? 'bg-[#0d93f2] text-white ring-[#0d93f2]/20 shadow-sm' 
                    : 'bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 ring-slate-100 dark:ring-slate-800'
                }`}>
                  {step.num === 1 && <span className="material-symbols-outlined text-base">check</span>}
                  {step.num === 2 && <span className="material-symbols-outlined text-base">check</span>}
                  {step.num !== 1 && step.num !== 2 && step.num}
                </div>
                <span className={`absolute top-12 text-xs font-bold whitespace-nowrap hidden sm:block ${
                  step.num <= 3 ? 'text-[#0d93f2]' : 'text-slate-500 dark:text-slate-400 font-medium'
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
            Funding Requirements
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Define your financial goals and investment structure.
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-8 bg-white dark:bg-[#15232d] p-6 md:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          {/* Funding Goal */}
          <label className="flex flex-col">
            <p className="text-slate-900 dark:text-slate-200 text-base font-semibold pb-2">
              Funding Goal ($)
            </p>
            <input
              type="number"
              name="fundingGoal"
              value={formData.fundingGoal}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-12 px-4 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#0d93f2] focus:ring-1 focus:ring-[#0d93f2] focus:outline-none transition-shadow"
              placeholder="e.g. 500000"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Total amount you're looking to raise
            </p>
          </label>

          <div className="h-px bg-slate-100 dark:bg-slate-800 w-full" />

          {/* Investment Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="flex flex-col">
              <p className="text-slate-900 dark:text-slate-200 text-base font-semibold pb-2">
                Minimum Investment
              </p>
              <input
                type="number"
                name="minInvestment"
                value={formData.minInvestment}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-12 px-4 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#0d93f2] focus:ring-1 focus:ring-[#0d93f2] focus:outline-none transition-shadow"
                placeholder="e.g. 25000"
              />
            </label>
            <label className="flex flex-col">
              <p className="text-slate-900 dark:text-slate-200 text-base font-semibold pb-2">
                Maximum Investment
              </p>
              <input
                type="number"
                name="maxInvestment"
                value={formData.maxInvestment}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-12 px-4 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#0d93f2] focus:ring-1 focus:ring-[#0d93f2] focus:outline-none transition-shadow"
                placeholder="e.g. 250000"
              />
            </label>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800 w-full" />

          {/* Funding Purpose */}
          <label className="flex flex-col">
            <div className="flex justify-between items-baseline pb-2">
              <p className="text-slate-900 dark:text-slate-200 text-base font-semibold">
                Funding Purpose
              </p>
              <span className="text-xs text-slate-400">{formData.fundingPurpose.length}/300</span>
            </div>
            <textarea
              name="fundingPurpose"
              value={formData.fundingPurpose}
              onChange={handleInputChange}
              maxLength={300}
              className="w-full resize-y rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#0d93f2] focus:ring-1 focus:ring-[#0d93f2] focus:outline-none transition-shadow min-h-[100px]"
              placeholder="What will you use the funding for?"
            />
          </label>

          {/* Usage Breakdown */}
          <label className="flex flex-col">
            <div className="flex justify-between items-baseline pb-2">
              <p className="text-slate-900 dark:text-slate-200 text-base font-semibold">
                Usage Breakdown
              </p>
              <span className="text-xs text-slate-400">{formData.usageBreakdown.length}/500</span>
            </div>
            <textarea
              name="usageBreakdown"
              value={formData.usageBreakdown}
              onChange={handleInputChange}
              maxLength={500}
              className="w-full resize-y rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#0d93f2] focus:ring-1 focus:ring-[#0d93f2] focus:outline-none transition-shadow min-h-[120px]"
              placeholder="How will the funds be allocated? (e.g., Product development: 40%, Marketing: 35%, Operations: 25%)"
            />
          </label>

          {/* Traction */}
          <label className="flex flex-col">
            <div className="flex justify-between items-baseline pb-2">
              <p className="text-slate-900 dark:text-slate-200 text-base font-semibold">
                Current Traction & Milestones
              </p>
              <span className="text-xs text-slate-400">{formData.traction.length}/500</span>
            </div>
            <textarea
              name="traction"
              value={formData.traction}
              onChange={handleInputChange}
              maxLength={500}
              className="w-full resize-y rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#0d93f2] focus:ring-1 focus:ring-[#0d93f2] focus:outline-none transition-shadow min-h-[120px]"
              placeholder="Share your achievements, user metrics, revenue, or other relevant traction..."
            />
          </label>
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
    </>
  );
}

export default ProfileStep3FundingRequirements; 
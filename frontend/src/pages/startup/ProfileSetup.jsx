import React, { useState } from 'react';
import axios from 'axios';

function ProfileSetup({ user, go }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    // Step 1: Basic Details
    foundersCount: '',
    foundersNames: '',
    
    // Step 2: Business Details
    companyName: '',
    tagline: '',
    industry: '',
    businessStage: '',
    description: '',
    website: '',
    
    // Step 3: Funding Requirements
    fundingGoal: '',
    fundingMin: '',
    fundingMax: '',
    fundingPurpose: '',
    traction: '',
    
    // Files
    logo: null,
    pitchDeck: null
  });

  const [logoPreview, setLogoPreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
      
      if (name === 'logo') {
        const reader = new FileReader();
        reader.onload = (event) => {
          setLogoPreview(event.target.result);
        };
        reader.readAsDataURL(files[0]);
      }
    }
  };

  const validateStep = () => {
    switch(currentStep) {
      case 1:
        if (!formData.foundersCount || !formData.foundersNames.trim()) {
          setError('Please provide number of founders and their names');
          return false;
        }
        return true;
      case 2:
        if (!formData.companyName.trim() || !formData.industry || !formData.businessStage) {
          setError('Please fill in company name, industry, and business stage');
          return false;
        }
        return true;
      case 3:
        if (!formData.fundingGoal || !formData.fundingPurpose.trim()) {
          setError('Please provide funding goal and purpose');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();

      // Add all text fields
      formDataToSend.append('name', formData.companyName);
      formDataToSend.append('founders', formData.foundersNames);
      formDataToSend.append('industry', formData.industry);
      formDataToSend.append('stage', formData.businessStage);
      formDataToSend.append('fundingGoal', formData.fundingGoal);
      formDataToSend.append('traction', formData.traction);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('keywords', formData.fundingPurpose);

      // Add files if they exist
      if (formData.logo) {
        formDataToSend.append('logo', formData.logo);
      }
      if (formData.pitchDeck) {
        formDataToSend.append('pitchDeck', formData.pitchDeck);
      }

      const response = await axios.post('http://localhost:5000/api/startups', formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      // Move to step 5 (acceptance)
      setCurrentStep(5);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDone = () => {
    go('startup-dashboard');
  };

  return (
    <div className="min-h-screen w-full bg-[#f5f7f8] dark:bg-[#0f1419]" style={{ fontFamily: 'Manrope, sans-serif' }}>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-[#1a1f26] border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0d93f2]/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#0d93f2]">rocket_launch</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">GrowMore - Startup Setup</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Step {currentStep} of 5</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto px-6 pb-4">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`flex-1 h-1 rounded-full transition-all ${
                  step < currentStep
                    ? 'bg-green-500'
                    : step === currentStep
                    ? 'bg-[#0d93f2]'
                    : 'bg-slate-300 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white dark:bg-[#1a1f26] rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Basic Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Basic Details</h2>
                <p className="text-slate-600 dark:text-slate-400">Tell us about your founding team</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Number of Founders
                </label>
                <input
                  type="number"
                  name="foundersCount"
                  value={formData.foundersCount}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0d93f2] outline-none"
                  placeholder="e.g., 2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Founders' Names (comma separated)
                </label>
                <textarea
                  name="foundersNames"
                  value={formData.foundersNames}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0d93f2] outline-none resize-none"
                  placeholder="John Doe, Jane Smith"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Separate multiple names with commas</p>
              </div>
            </div>
          )}

          {/* Step 2: Business Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Business Details</h2>
                <p className="text-slate-600 dark:text-slate-400">Tell us about your company</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0d93f2] outline-none"
                  placeholder="Your Company Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Tagline
                </label>
                <input
                  type="text"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0d93f2] outline-none"
                  placeholder="e.g., AI-powered market intelligence platform"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Industry
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0d93f2] outline-none"
                  >
                    <option value="">Select Industry</option>
                    <option value="FinTech">FinTech</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="SaaS">SaaS</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="EdTech">EdTech</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Business Stage
                  </label>
                  <select
                    name="businessStage"
                    value={formData.businessStage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0d93f2] outline-none"
                  >
                    <option value="">Select Stage</option>
                    <option value="Idea">Idea</option>
                    <option value="MVP">MVP</option>
                    <option value="Growth">Growth</option>
                    <option value="Scaling">Scaling</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Company Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0d93f2] outline-none resize-none"
                  placeholder="Tell us about your company, what problem you solve, and your unique value proposition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Website (Optional)
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0d93f2] outline-none"
                  placeholder="https://yourcompany.com"
                />
              </div>
            </div>
          )}

          {/* Step 3: Funding Requirements */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Funding Requirements</h2>
                <p className="text-slate-600 dark:text-slate-400">Tell us about your funding needs</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Target Funding Amount (USD)
                </label>
                <input
                  type="number"
                  name="fundingGoal"
                  value={formData.fundingGoal}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0d93f2] outline-none"
                  placeholder="e.g., 500000"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">The ideal amount you're looking to raise</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Minimum Amount (USD)
                  </label>
                  <input
                    type="number"
                    name="fundingMin"
                    value={formData.fundingMin}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0d93f2] outline-none"
                    placeholder="e.g., 250000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Maximum Amount (USD)
                  </label>
                  <input
                    type="number"
                    name="fundingMax"
                    value={formData.fundingMax}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0d93f2] outline-none"
                    placeholder="e.g., 1000000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  What will you use the funding for?
                </label>
                <textarea
                  name="fundingPurpose"
                  value={formData.fundingPurpose}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0d93f2] outline-none resize-none"
                  placeholder="e.g., Product development, marketing, hiring, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Traction & Milestones (Optional)
                </label>
                <textarea
                  name="traction"
                  value={formData.traction}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0d93f2] outline-none resize-none"
                  placeholder="e.g., 10k users, $100k MRR, partnerships with major brands..."
                />
              </div>
            </div>
          )}

          {/* Step 4: Profile Preview */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Profile Preview</h2>
                <p className="text-slate-600 dark:text-slate-400">Review your startup profile before submission</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Company Name</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{formData.companyName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Industry</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{formData.industry || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Business Stage</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{formData.businessStage || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Funding Goal</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">${Number(formData.fundingGoal || 0).toLocaleString()}</p>
                  </div>
                </div>

                {formData.tagline && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase mb-1">Tagline</p>
                    <p className="text-slate-700 dark:text-slate-300">{formData.tagline}</p>
                  </div>
                )}

                {formData.description && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase mb-1">Description</p>
                    <p className="text-slate-700 dark:text-slate-300">{formData.description}</p>
                  </div>
                )}

                {formData.foundersNames && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase mb-1">Founders</p>
                    <p className="text-slate-700 dark:text-slate-300">{formData.foundersNames}</p>
                  </div>
                )}

                {formData.traction && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase mb-1">Traction</p>
                    <p className="text-slate-700 dark:text-slate-300">{formData.traction}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Company Logo (Optional)
                </label>
                <div className="flex gap-4">
                  {logoPreview && (
                    <div className="w-32 h-32 rounded-lg border-2 border-slate-200 dark:border-slate-700 overflow-hidden">
                      <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <label className="flex-1 flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:border-[#0d93f2] transition-colors">
                    <span className="material-symbols-outlined text-slate-400">cloud_upload</span>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Click to upload logo</span>
                    <input
                      type="file"
                      name="logo"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Pitch Deck (Optional)
                </label>
                <label className="flex items-center gap-2 p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:border-[#0d93f2] transition-colors">
                  <span className="material-symbols-outlined text-slate-400">description</span>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {formData.pitchDeck ? formData.pitchDeck.name : 'Click to upload pitch deck (PDF)'}
                  </span>
                  <input
                    type="file"
                    name="pitchDeck"
                    onChange={handleFileChange}
                    accept=".pdf"
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Step 5: Profile Acceptance */}
          {currentStep === 5 && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-green-600 dark:text-green-400">check_circle</span>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Profile Submitted!</h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg">Your startup profile has been successfully submitted.</p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 space-y-2 text-left">
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-400">What happens next?</p>
                <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-2">
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Our admin team will review your profile within 24-48 hours</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>You'll receive an email notification once your profile is approved</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Once approved, your profile will be visible to investors on our platform</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>You can start connecting with investors and exploring partnership opportunities</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4">
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  In the meantime, you can explore the community feed and check out investor profiles.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex gap-3 justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1 || currentStep === 5}
              className="px-6 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            {currentStep < 4 && (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 bg-[#0d93f2] hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
              >
                Next
              </button>
            )}

            {currentStep === 4 && (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">check</span>
                    Submit Profile
                  </>
                )}
              </button>
            )}

            {currentStep === 5 && (
              <button
                onClick={handleDone}
                className="px-6 py-2.5 bg-[#0d93f2] hover:bg-blue-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2 ml-auto"
              >
                <span className="material-symbols-outlined">arrow_forward</span>
                Go to Dashboard
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSetup;

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, Info, Stethoscope } from 'lucide-react';
import DisclaimerBanner from './DisclaimerBanner';

export default function AssessmentForm({ onSubmit, loading, error }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    age: 54,
    sex: 'Male',
    chest_pain: 'Asymptomatic',

    // Step 2: Vitals
    resting_blood_pressure: 135,
    cholesterol: 230,
    Max_heart_rate: 145,
    fasting_blood_sugar: 'No',

    // Step 3: Test Results
    rest_ecg: 'Normal',
    exercise_induced: 'No',
    oldpeak: 1.2,
    slope: 'Flat',
    vessels_colored: 1,
    thalassemia: 'Normal'
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Form Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
        {/* Header & Step Indicator */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-xl text-white">Patient Assessment</h2>
                <p className="text-slate-300 text-xs">Complete all 3 sections for risk calculation</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full border border-teal-500/30">
              Step {step} of 3
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
            <div 
              className="bg-gradient-to-r from-teal-400 to-cyan-400 h-full transition-all duration-300 ease-out"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          {/* Step Labels */}
          <div className="grid grid-cols-3 text-center text-xs mt-3 font-medium text-slate-400">
            <span className={step >= 1 ? "text-teal-300 font-semibold" : ""}>1. Basic Info</span>
            <span className={step >= 2 ? "text-teal-300 font-semibold" : ""}>2. Vitals</span>
            <span className={step >= 3 ? "text-teal-300 font-semibold" : ""}>3. Test Results</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-lg">Step 1 — Basic Demographics & Symptoms</h3>
                <p className="text-slate-500 text-xs">Patient age, biological sex, and chest pain presentation</p>
              </div>

              {/* Age */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-slate-800">Age (years)</label>
                  <span className="text-teal-600 font-bold bg-teal-50 px-3 py-1 rounded-lg text-sm border border-teal-200">
                    {formData.age} years
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={formData.age}
                  onChange={(e) => updateField('age', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>20 yrs</span>
                  <span>60 yrs</span>
                  <span>100 yrs</span>
                </div>
              </div>

              {/* Sex */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-800 block">Biological Sex</label>
                <div className="grid grid-cols-2 gap-4">
                  {['Male', 'Female'].map(sex => (
                    <button
                      key={sex}
                      type="button"
                      onClick={() => updateField('sex', sex)}
                      className={`py-3 px-4 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        formData.sex === sex
                          ? 'border-teal-600 bg-teal-50 text-teal-800 ring-2 ring-teal-500/20'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {formData.sex === sex && <CheckCircle className="w-4 h-4 text-teal-600" />}
                      {sex}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chest Pain Type */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-800 block">Chest Pain Type</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'Typical angina', label: 'Typical Angina', desc: 'Chest discomfort triggered by exertion' },
                    { key: 'Atypical angina', label: 'Atypical Angina', desc: 'Uncharacteristic chest tightness' },
                    { key: 'Non-anginal', label: 'Non-Anginal Pain', desc: 'Pain not related to coronary arteries' },
                    { key: 'Asymptomatic', label: 'Asymptomatic', desc: 'No active chest discomfort reported' }
                  ].map(cp => (
                    <div
                      key={cp.key}
                      onClick={() => updateField('chest_pain', cp.key)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        formData.chest_pain === cp.key
                          ? 'border-teal-600 bg-teal-50/80 text-teal-900 ring-2 ring-teal-500/20'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="font-semibold text-sm">{cp.label}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{cp.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Vitals */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-lg">Step 2 — Vital Signs & Blood Metrics</h3>
                <p className="text-slate-500 text-xs">Blood pressure, lipid levels, heart rate, and fasting glucose</p>
              </div>

              {/* Resting Blood Pressure */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-slate-800">Resting Blood Pressure (mm Hg)</label>
                  <span className="text-teal-600 font-bold bg-teal-50 px-3 py-1 rounded-lg text-sm border border-teal-200">
                    {formData.resting_blood_pressure} mm Hg
                  </span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="220"
                  value={formData.resting_blood_pressure}
                  onChange={(e) => updateField('resting_blood_pressure', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>80 (Normal)</span>
                  <span>140 (Stage 2)</span>
                  <span>220 (High)</span>
                </div>
              </div>

              {/* Serum Cholesterol */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-slate-800">Serum Cholesterol (mg/dl)</label>
                  <span className="text-teal-600 font-bold bg-teal-50 px-3 py-1 rounded-lg text-sm border border-teal-200">
                    {formData.cholesterol} mg/dl
                  </span>
                </div>
                <input
                  type="range"
                  min="120"
                  max="500"
                  value={formData.cholesterol}
                  onChange={(e) => updateField('cholesterol', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>120 (Optimal)</span>
                  <span>200 (Desirable)</span>
                  <span>500 (Elevated)</span>
                </div>
              </div>

              {/* Max Heart Rate */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-slate-800">Maximum Heart Rate Achieved (bpm)</label>
                  <span className="text-teal-600 font-bold bg-teal-50 px-3 py-1 rounded-lg text-sm border border-teal-200">
                    {formData.Max_heart_rate} bpm
                  </span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="210"
                  value={formData.Max_heart_rate}
                  onChange={(e) => updateField('Max_heart_rate', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>70 bpm</span>
                  <span>140 bpm</span>
                  <span>210 bpm</span>
                </div>
              </div>

              {/* Fasting Blood Sugar > 120 mg/dl */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-800 block">
                  Fasting Blood Sugar &gt; 120 mg/dl?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: 'No', label: 'No (≤ 120 mg/dl)' },
                    { key: 'Yes', label: 'Yes (> 120 mg/dl)' }
                  ].map(fbs => (
                    <button
                      key={fbs.key}
                      type="button"
                      onClick={() => updateField('fasting_blood_sugar', fbs.key)}
                      className={`py-3 px-4 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        formData.fasting_blood_sugar === fbs.key
                          ? 'border-teal-600 bg-teal-50 text-teal-800 ring-2 ring-teal-500/20'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {formData.fasting_blood_sugar === fbs.key && <CheckCircle className="w-4 h-4 text-teal-600" />}
                      {fbs.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Test Results */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-lg">Step 3 — Cardiac Diagnostics & Exercise Test</h3>
                <p className="text-slate-500 text-xs">ECG, ST depression, exercise tolerance, fluoroscopy, and thalassemia</p>
              </div>

              {/* Rest ECG */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-800 block">Resting ECG Results</label>
                <select
                  value={formData.rest_ecg}
                  onChange={(e) => updateField('rest_ecg', e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="Normal">Normal</option>
                  <option value="ST-T wave abnormality">ST-T wave abnormality</option>
                  <option value="Left ventricular hypertrophy">Left ventricular hypertrophy</option>
                </select>
              </div>

              {/* Exercise Induced Angina */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-800 block">Exercise Induced Angina?</label>
                <div className="grid grid-cols-2 gap-4">
                  {['No', 'Yes'].map(ex => (
                    <button
                      key={ex}
                      type="button"
                      onClick={() => updateField('exercise_induced', ex)}
                      className={`py-3 px-4 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        formData.exercise_induced === ex
                          ? 'border-teal-600 bg-teal-50 text-teal-800 ring-2 ring-teal-500/20'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {formData.exercise_induced === ex && <CheckCircle className="w-4 h-4 text-teal-600" />}
                      {ex === 'Yes' ? 'Yes (Angina on Exertion)' : 'No (No Pain on Exertion)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Oldpeak ST Depression */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-slate-800">Oldpeak — ST Depression (mm)</label>
                  <span className="text-teal-600 font-bold bg-teal-50 px-3 py-1 rounded-lg text-sm border border-teal-200">
                    {formData.oldpeak} mm
                  </span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="6.0"
                  step="0.1"
                  value={formData.oldpeak}
                  onChange={(e) => updateField('oldpeak', parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>0.0 (Normal)</span>
                  <span>3.0 (Moderate)</span>
                  <span>6.0 (Severe)</span>
                </div>
              </div>

              {/* ST Segment Slope */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-800 block">Slope of Peak Exercise ST Segment</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Upsloping', 'Flat', 'Downsloping'].map(sl => (
                    <button
                      key={sl}
                      type="button"
                      onClick={() => updateField('slope', sl)}
                      className={`py-3 px-3 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-center cursor-pointer transition-all ${
                        formData.slope === sl
                          ? 'border-teal-600 bg-teal-50 text-teal-800 ring-2 ring-teal-500/20'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {sl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vessels Colored (0-3) */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-800 block">
                  Major Vessels Colored by Fluoroscopy (0-3)
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {[0, 1, 2, 3].map(vc => (
                    <button
                      key={vc}
                      type="button"
                      onClick={() => updateField('vessels_colored', vc)}
                      className={`py-3 px-3 rounded-xl border text-sm font-bold flex items-center justify-center cursor-pointer transition-all ${
                        formData.vessels_colored === vc
                          ? 'border-teal-600 bg-teal-50 text-teal-800 ring-2 ring-teal-500/20'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {vc} {vc === 1 ? 'vessel' : 'vessels'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Thalassemia */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-800 block">Thalassemia Perfusion Status</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {['Normal', 'Fixed Defect', 'Reversible Defect'].map(th => (
                    <button
                      key={th}
                      type="button"
                      onClick={() => updateField('thalassemia', th)}
                      className={`py-3 px-3 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-center cursor-pointer transition-all ${
                        formData.thalassemia === th
                          ? 'border-teal-600 bg-teal-50 text-teal-800 ring-2 ring-teal-500/20'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {th}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : <div />}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm flex items-center gap-2 cursor-pointer shadow-md shadow-teal-600/20 transition-all"
              >
                Next Section
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-teal-600/25 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Risk Model...</span>
                  </>
                ) : (
                  <>
                    <Stethoscope className="w-5 h-5" />
                    <span>Calculate Risk Profile</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="mt-6">
        <DisclaimerBanner />
      </div>
    </div>
  );
}

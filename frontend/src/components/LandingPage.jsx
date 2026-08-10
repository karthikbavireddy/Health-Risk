import React from 'react';
import { Heart, Activity, ShieldCheck, ArrowRight, History } from 'lucide-react';
import DisclaimerBanner from './DisclaimerBanner';

export default function LandingPage({ onStartAssessment, onViewHistory }) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Hero Banner */}
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/80 border border-teal-200 text-teal-800 text-xs font-semibold tracking-wide uppercase">
          <ShieldCheck className="w-4 h-4 text-teal-600" /> Clinical Machine Learning Assessment
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Evaluate Cardiovascular Risk with <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">AI Intelligence</span>
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          Input vital parameters, clinical symptoms, and cardiac test results to calculate a validated heart disease risk score with plain-language diagnostic insights.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={onStartAssessment}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold rounded-xl shadow-lg shadow-teal-600/25 flex items-center justify-center gap-3 group transition-all hover:scale-[1.02] cursor-pointer"
          >
            <span>Start Risk Assessment</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={onViewHistory}
            className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <History className="w-5 h-5 text-slate-500" />
            <span>View Previous Records</span>
          </button>
        </div>
      </div>

      {/* Disclaimer Box */}
      <div className="max-w-3xl mx-auto">
        <DisclaimerBanner />
      </div>

      {/* Informational Highlights Grid with Subtle Hover Elevation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {/* Card 1: Multi-Factor Analysis */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-slate-300">
          <div className="w-12 h-12 rounded-xl bg-teal-100/80 text-teal-700 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">Multi-Factor Analysis</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Evaluates 13 key physiological factors including ST depression, fluoroscopy vessel staining, serum cholesterol, and exercise tolerance.
          </p>
        </div>

        {/* Card 2: 91.8% Validated Model */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-slate-300">
          <div className="w-12 h-12 rounded-xl bg-cyan-100/80 text-cyan-700 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">91.8% Validated Model</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Powered by scikit-learn models trained on benchmark clinical dataset records with stratified cross-validation.
          </p>
        </div>

        {/* Card 3: Actionable Plain Language */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-slate-300">
          <div className="w-12 h-12 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">Actionable Plain Language</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Clear visual gauges paired with the top 3 contributing risk factors written in patient-friendly medical language.
          </p>
        </div>
      </div>
    </div>
  );
}

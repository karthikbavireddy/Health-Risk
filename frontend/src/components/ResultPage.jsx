import React from 'react';
import { ArrowLeft, CheckCircle2, AlertCircle, RefreshCw, History, ShieldAlert, FileText } from 'lucide-react';
import CircularGauge from './CircularGauge';
import DisclaimerBanner from './DisclaimerBanner';

export default function ResultPage({ result, onReset, onViewHistory }) {
  if (!result) return null;

  const { risk_score, risk_level, contributing_factors = [] } = result;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Assessment Complete
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Cardiovascular Risk Analysis
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-slate-500" />
            <span>New Assessment</span>
          </button>
          <button
            onClick={onViewHistory}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <History className="w-4 h-4" />
            <span>History Log</span>
          </button>
        </div>
      </div>

      {/* Main Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Gauge & Level */}
        <div className="md:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-md text-center">
          <h3 className="font-bold text-slate-800 text-lg border-b border-slate-100 pb-3">
            Estimated Risk Score
          </h3>
          <CircularGauge score={risk_score} level={risk_level} />

          <div className="mt-2 text-xs text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
            {risk_level === 'Low' && 'Statistical indicators suggest low probability of heart disease presence.'}
            {risk_level === 'Moderate' && 'Moderate cardiovascular risk markers detected. Further medical evaluation recommended.'}
            {risk_level === 'High' && 'Elevated clinical risk parameters present. Prompt medical consultation advised.'}
          </div>
        </div>

        {/* Right Column: Contributing Factors */}
        <div className="md:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileText className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-lg">Top 3 Contributing Risk Factors</h3>
          </div>

          <div className="space-y-4">
            {contributing_factors.map((factor, index) => (
              <div 
                key={index} 
                className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5 transition-all hover:bg-slate-100/70"
              >
                <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 font-extrabold text-sm flex items-center justify-center shrink-0 mt-0.5">
                  #{index + 1}
                </div>
                <div className="text-sm font-medium text-slate-800 leading-relaxed">
                  {factor}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Medical Disclaimer */}
      <DisclaimerBanner />
    </div>
  );
}

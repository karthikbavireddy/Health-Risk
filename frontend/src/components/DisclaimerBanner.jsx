import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function DisclaimerBanner({ className = "" }) {
  return (
    <div className={`bg-amber-50 border border-amber-200/80 rounded-xl p-4 flex gap-3 text-amber-900 shadow-xs ${className}`}>
      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
      <div className="text-xs sm:text-sm leading-relaxed">
        <span className="font-semibold block text-amber-950 mb-0.5">Medical Disclaimer</span>
        This tool provides an estimate based on statistical patterns and is not a medical diagnosis. Please consult a healthcare professional for medical advice.
      </div>
    </div>
  );
}

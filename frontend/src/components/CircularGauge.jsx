import React from 'react';

export default function CircularGauge({ score, level }) {
  // Gauge math
  const radius = 60;
  const circumference = 2 * Math.PI * radius; // ~376.99
  const scorePercent = Math.min(Math.max(score, 0), 100);
  const strokeDashoffset = circumference - (scorePercent / 100) * circumference;

  let strokeColor = "stroke-emerald-500";
  let textColor = "text-emerald-700";
  let badgeBg = "bg-emerald-100 text-emerald-800 border-emerald-300";
  let ringBg = "text-emerald-100";

  if (level === "Moderate") {
    strokeColor = "stroke-amber-500";
    textColor = "text-amber-700";
    badgeBg = "bg-amber-100 text-amber-800 border-amber-300";
    ringBg = "text-amber-100";
  } else if (level === "High") {
    strokeColor = "stroke-rose-500";
    textColor = "text-rose-700";
    badgeBg = "bg-rose-100 text-rose-800 border-rose-300";
    ringBg = "text-rose-100";
  }

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
          {/* Background circle */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            className="stroke-slate-200"
            strokeWidth="12"
            fill="transparent"
          />
          {/* Animated progress circle */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            className={`${strokeColor} transition-all duration-1000 ease-out`}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        {/* Center score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`text-4xl font-extrabold tracking-tight ${textColor}`}>
            {score}%
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1">
            Calculated Risk
          </span>
        </div>
      </div>

      <div className={`mt-4 px-4 py-1.5 rounded-full border font-bold text-sm shadow-xs ${badgeBg}`}>
        {level} Risk Profile
      </div>
    </div>
  );
}

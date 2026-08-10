import React from 'react';
import { HeartPulse, History, PlusCircle, ShieldAlert } from 'lucide-react';

export default function Navbar({ currentView, setView }) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setView('landing')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
            <HeartPulse className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="font-bold text-lg text-slate-900 tracking-tight block leading-none">
              Cardio<span className="text-teal-600">Pulse</span> AI
            </span>
            <span className="text-xs text-slate-500 font-medium">Health Risk Predictor</span>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <button
            onClick={() => setView('form')}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              currentView === 'form' 
                ? 'bg-teal-50 text-teal-700 border border-teal-200' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Assessment</span>
          </button>

          <button
            onClick={() => setView('history')}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              currentView === 'history' 
                ? 'bg-teal-50 text-teal-700 border border-teal-200' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <History className="w-4 h-4" />
            <span>History</span>
          </button>
        </nav>
      </div>
    </header>
  );
}

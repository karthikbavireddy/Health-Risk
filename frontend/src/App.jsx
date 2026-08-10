import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import AssessmentForm from './components/AssessmentForm';
import ResultPage from './components/ResultPage';
import HistoryPage from './components/HistoryPage';

const API_BASE = import.meta.env.VITE_BACKEND_URL || '';

export default function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'form' | 'result' | 'history'
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/predict-risk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Prediction request failed.');
      }

      const data = await response.json();
      setResult(data);
      setView('result');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar currentView={view} setView={setView} />

      <main className="flex-1 pb-16">
        {view === 'landing' && (
          <LandingPage
            onStartAssessment={() => setView('form')}
            onViewHistory={() => setView('history')}
          />
        )}

        {view === 'form' && (
          <AssessmentForm
            onSubmit={handleFormSubmit}
            loading={loading}
            error={error}
          />
        )}

        {view === 'result' && (
          <ResultPage
            result={result}
            onReset={() => {
              setResult(null);
              setView('form');
            }}
            onViewHistory={() => setView('history')}
          />
        )}

        {view === 'history' && (
          <HistoryPage
            onStartNew={() => setView('form')}
          />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            CardioPulse AI &copy; {new Date().getFullYear()} — Advanced Health Risk Machine Learning Model
          </div>
          <div className="text-slate-400">
            For Demonstration &amp; Statistical Evaluation Purposes Only
          </div>
        </div>
      </footer>
    </div>
  );
}

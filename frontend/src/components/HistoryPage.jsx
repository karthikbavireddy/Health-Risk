import React, { useEffect, useState } from 'react';
import { History, PlusCircle, Calendar, User, Activity, AlertCircle, RefreshCw } from 'lucide-react';
import DisclaimerBanner from './DisclaimerBanner';

const API_BASE = import.meta.env.VITE_BACKEND_URL || '';

export default function HistoryPage({ onStartNew }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/history`);
      if (!res.ok) throw new Error('Failed to fetch history data.');
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const getBadgeStyle = (level) => {
    if (level === 'High') return 'bg-rose-100 text-rose-800 border-rose-300';
    if (level === 'Moderate') return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-emerald-100 text-emerald-800 border-emerald-300';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 mb-1">
            <History className="w-3.5 h-3.5" /> Assessment Logs
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Prediction History
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchHistory}
            className="p-2.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-slate-700 transition-colors cursor-pointer"
            title="Refresh History"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onStartNew}
            className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold rounded-xl text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Assessment</span>
          </button>
        </div>
      </div>

      {/* History Table / Card list */}
      {loading ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 text-sm font-medium">Loading historical predictions...</p>
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
          <p className="text-rose-800 font-semibold text-sm">{error}</p>
          <button
            onClick={fetchHistory}
            className="px-4 py-2 bg-rose-600 text-white font-semibold text-xs rounded-lg hover:bg-rose-700"
          >
            Retry Connection
          </button>
        </div>
      ) : history.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4">
          <Activity className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Assessment Records Found</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Complete your first 3-step risk assessment to record predictions and track risk profiles over time.
          </p>
          <button
            onClick={onStartNew}
            className="px-6 py-3 bg-teal-600 text-white font-bold text-sm rounded-xl hover:bg-teal-700"
          >
            Start Assessment Now
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Patient Info</th>
                  <th className="px-6 py-4">Vitals Summary</th>
                  <th className="px-6 py-4 text-center">Risk Score</th>
                  <th className="px-6 py-4 text-center">Risk Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-500 text-xs">
                      #{item.id}
                    </td>
                    <td className="px-6 py-4 text-slate-600 whitespace-nowrap text-xs">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {item.created_at ? new Date(item.created_at).toLocaleString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-teal-600" />
                        {item.age} yrs ({item.sex})
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600">
                      <div>BP: {item.resting_blood_pressure} mm Hg | Chol: {item.cholesterol}</div>
                      <div className="text-slate-400 mt-0.5">{item.chest_pain}</div>
                    </td>
                    <td className="px-6 py-4 text-center font-extrabold text-slate-900 text-base">
                      {item.predicted_risk_score}%
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getBadgeStyle(item.predicted_risk_level)}`}>
                        {item.predicted_risk_level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <DisclaimerBanner />
    </div>
  );
}

import { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../api/settings';
import LoadingSpinner from '../components/LoadingSpinner';
import { HiOutlineCheck, HiOutlineCog, HiOutlineInformationCircle, HiOutlineShieldCheck } from 'react-icons/hi';

export default function Settings() {
  const [threshold, setThreshold] = useState(10);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await getSettings();
        setThreshold(response.data.defaultLowStockThreshold ?? 10);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const parsed = parseInt(threshold, 10);
      await updateSettings({ defaultLowStockThreshold: isNaN(parsed) ? 10 : parsed });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading Settings..." />;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
        <span className="text-[11px] font-bold text-teal-600 uppercase tracking-widest">
          Workspace Preferences
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-[#172554] tracking-tight mt-0.5 flex items-center gap-2.5">
          <HiOutlineCog className="w-7 h-7 text-teal-600" />
          <span>Organization Settings</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure default thresholds and global inventory monitoring policies for your multi-tenant workspace.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm rounded-2xl font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-teal-50 border border-teal-200 text-teal-800 text-xs sm:text-sm rounded-2xl flex items-center gap-2.5 font-bold shadow-xs">
          <HiOutlineCheck className="w-5 h-5 text-teal-600 flex-shrink-0 stroke-2" />
          <span>Organization settings successfully saved and applied.</span>
        </div>
      )}

      {/* Main Settings Card */}
      <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <HiOutlineShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#172554] uppercase tracking-wider">
                Automated Stock Alerts
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Baseline threshold triggering low-stock warnings across the dashboard.
              </p>
            </div>
          </div>

          <div className="max-w-md pt-5 border-t border-slate-100">
            <label
              htmlFor="threshold"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Default Low-Stock Threshold (Units)
            </label>
            <input
              id="threshold"
              type="number"
              min="0"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-extrabold text-[#172554] focus:bg-white focus:border-teal-600 focus:ring-4 focus:ring-teal-500/15 outline-none transition-all"
            />
            <div className="mt-3 p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200/80 flex items-start gap-2.5 text-xs text-teal-900 leading-relaxed">
              <HiOutlineInformationCircle className="w-4 h-4 flex-shrink-0 text-teal-600 mt-0.5" />
              <span>
                Any product that does not specify an individual custom threshold will automatically inherit this value. Changing this immediately updates dashboard indicators.
              </span>
            </div>
          </div>

          <div className="pt-5 border-t border-slate-100">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-sm rounded-xl shadow-xs shadow-teal-600/25 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

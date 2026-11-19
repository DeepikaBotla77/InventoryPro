import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineCube,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineOfficeBuilding,
} from 'react-icons/hi';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await signup({ email, password, confirmPassword, organizationName });
      navigate('/login', {
        state: {
          message: 'Organization registered successfully! Please log in with your credentials.',
          email,
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#172554] via-[#1E3A5F] to-[#0f172a] px-4 py-12 relative overflow-hidden">
      {/* Ambient lighting effects */}
      <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-8 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-900/40 ring-4 ring-teal-400/20">
          <HiOutlineCube className="w-7 h-7 stroke-2" />
        </div>
        <div className="text-left">
          <span className="text-2xl font-black text-white tracking-tight leading-none block">
            Inventory<span className="text-teal-400">Pro</span>
          </span>
          <span className="text-[11px] font-bold text-teal-200/80 uppercase tracking-widest block mt-1">
            Enterprise Cloud Platform
          </span>
        </div>
      </div>

      {/* Signup Card */}
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-8 sm:p-10 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight">
            Create an organization
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
            Launch your multi-tenant inventory workspace
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm rounded-2xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="orgName" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Organization / Company Name
            </label>
            <div className="relative">
              <HiOutlineOfficeBuilding className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="orgName"
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-teal-600 focus:ring-4 focus:ring-teal-500/15 outline-none transition-all placeholder:text-slate-400"
                placeholder="Acme Global Logistics"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Work Email
            </label>
            <div className="relative">
              <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-teal-600 focus:ring-4 focus:ring-teal-500/15 outline-none transition-all placeholder:text-slate-400"
                placeholder="admin@company.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-teal-600 focus:ring-4 focus:ring-teal-500/15 outline-none transition-all placeholder:text-slate-400"
                placeholder="At least 6 characters"
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-teal-600 focus:ring-4 focus:ring-teal-500/15 outline-none transition-all placeholder:text-slate-400"
                placeholder="Repeat password"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold rounded-xl shadow-md shadow-teal-600/25 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer text-sm"
            >
              {loading ? 'Creating workspace...' : 'Register Workspace'}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs sm:text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-600 font-bold hover:text-teal-700 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Trust Badge Footer */}
      <p className="mt-8 text-xs text-slate-400 text-center relative z-10">
        Enterprise multi-tenant isolation &bull; Instant provisioning &bull; 99.9% uptime
      </p>
    </div>
  );
}

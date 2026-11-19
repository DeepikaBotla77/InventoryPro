import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineCheckCircle, HiOutlineCube, HiOutlineLockClosed, HiOutlineMail } from 'react-icons/hi';

export default function Login() {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#172554] via-[#1E3A5F] to-[#0f172a] px-4 py-12 relative overflow-hidden">
      {/* Subtle ambient lighting effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

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

      {/* Login Card */}
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-8 sm:p-10 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight">
            Welcome back
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
            Sign in to access your organization&apos;s inventory
          </p>
        </div>

        {successMessage && (
          <div className="mb-5 p-3.5 bg-teal-50 border border-teal-200 text-teal-800 text-xs sm:text-sm rounded-2xl flex items-center gap-2.5 font-medium">
            <HiOutlineCheckCircle className="w-5 h-5 flex-shrink-0 text-teal-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm rounded-2xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (successMessage) setSuccessMessage('');
                }}
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-teal-600 focus:ring-4 focus:ring-teal-500/15 outline-none transition-all placeholder:text-slate-400"
                placeholder="name@company.com"
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
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (successMessage) setSuccessMessage('');
                }}
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-teal-600 focus:ring-4 focus:ring-teal-500/15 outline-none transition-all placeholder:text-slate-400"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold rounded-xl shadow-md shadow-teal-600/25 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer text-sm"
          >
            {loading ? 'Signing in...' : 'Sign In to Workspace'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs sm:text-sm text-slate-500">
            Don&apos;t have an account yet?{' '}
            <Link to="/signup" className="text-teal-600 font-bold hover:text-teal-700 transition-colors">
              Create an organization
            </Link>
          </p>
        </div>
      </div>

      {/* Trust Badge Footer */}
      <p className="mt-8 text-xs text-slate-400 text-center relative z-10">
        Enterprise multi-tenant isolation &bull; End-to-end TLS encryption
      </p>
    </div>
  );
}

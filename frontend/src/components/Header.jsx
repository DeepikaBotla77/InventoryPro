import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineMenu,
  HiOutlineLogout,
  HiOutlinePlus,
  HiOutlineOfficeBuilding,
  HiOutlineChevronDown,
  HiOutlineCog,
} from 'react-icons/hi';

const pageTitles = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Real-time metrics, valuation & stock alerts' },
  '/products': { title: 'Products', subtitle: 'Manage organization inventory catalog' },
  '/products/new': { title: 'Add Product', subtitle: 'Register a new SKU and stock quantity' },
  '/settings': { title: 'Settings', subtitle: 'Configure low-stock alert thresholds' },
};

export default function Header({ onMobileMenuToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentPage = pageTitles[location.pathname] || {
    title: location.pathname.includes('/edit') ? 'Edit Product' : 'InventoryPro',
    subtitle: 'Enterprise Inventory Management',
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : 'U';

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-6 lg:px-8 py-3.5 shadow-2xs transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile menu button & Page Title */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <button
            type="button"
            onClick={onMobileMenuToggle}
            className="p-2 -ml-2 rounded-xl text-slate-600 hover:text-[#172554] hover:bg-slate-100 md:hidden focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
            aria-label="Open sidebar"
          >
            <HiOutlineMenu className="w-6 h-6" />
          </button>

          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-black text-[#172554] tracking-tight truncate">
              {currentPage.title}
            </h1>
            <p className="hidden sm:block text-xs text-slate-500 truncate mt-0.5">
              <span className="font-semibold text-slate-700">{user?.organizationName || user?.email}</span> &bull; {currentPage.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Quick Action & User Profile */}
        <div className="flex items-center gap-3">
          <Link
            to="/products/new"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs shadow-teal-600/20 transition-all hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
          >
            <HiOutlinePlus className="w-4 h-4 stroke-2" />
            <span>Add Product</span>
          </Link>

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:border-teal-500/40 hover:bg-slate-50 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-[#172554] text-teal-300 ring-2 ring-teal-500/20 flex items-center justify-center text-sm font-black shadow-2xs">
                {userInitial}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-[#172554] truncate max-w-[130px]">
                  {user?.organizationName || 'My Organization'}
                </div>
                <div className="text-[11px] text-slate-500 truncate max-w-[130px]">
                  {user?.email}
                </div>
              </div>
              <HiOutlineChevronDown className="hidden sm:block w-4 h-4 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {profileOpen && (
              <div className="absolute right-0 mt-2.5 w-68 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2.5 border-b border-slate-100 bg-slate-50/70 rounded-xl mb-1.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active User</p>
                  <p className="text-sm font-bold text-[#172554] truncate mt-0.5">{user?.email}</p>
                  {user?.organizationName && (
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-teal-700 font-semibold">
                      <HiOutlineOfficeBuilding className="w-3.5 h-3.5" />
                      <span className="truncate">{user.organizationName}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-0.5">
                  <Link
                    to="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#172554] transition-colors"
                  >
                    <HiOutlineCog className="w-4 h-4 text-slate-400" />
                    <span>Organization Settings</span>
                  </Link>
                </div>

                <div className="border-t border-slate-100 mt-1.5 pt-1.5">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <HiOutlineLogout className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineChartBar,
  HiOutlineCube,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineX,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineOfficeBuilding,
} from 'react-icons/hi';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: HiOutlineChartBar },
  { to: '/products', label: 'Products', icon: HiOutlineCube },
  { to: '/settings', label: 'Settings', icon: HiOutlineCog },
];

export default function Sidebar({
  mobileOpen,
  onMobileClose,
  collapsed,
  onToggleCollapse,
}) {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-[#172554] border-r border-[#1E3A5F] shadow-xl transition-all duration-300 ease-in-out text-white
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${collapsed ? 'md:w-20' : 'w-64'}
        `}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-18 px-4 border-b border-[#1E3A5F]/90 bg-[#172554]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-teal-600/25 text-white font-bold ring-2 ring-teal-400/20">
              <HiOutlineCube className="w-6 h-6 stroke-2" />
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-lg font-extrabold text-white tracking-tight leading-tight">
                  Inventory<span className="text-teal-400">Pro</span>
                </span>
                <span className="text-[10px] font-bold text-teal-300/80 uppercase tracking-widest">
                  Enterprise SaaS
                </span>
              </div>
            )}
          </div>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={onMobileClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E3A5F] md:hidden transition-colors"
            aria-label="Close sidebar"
          >
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        {/* Organization Badge (when expanded) */}
        {!collapsed && user?.organizationName && (
          <div className="mx-4 mt-4 p-3 rounded-2xl bg-[#1E3A5F]/60 border border-teal-500/20 backdrop-blur-xs flex items-center gap-3 shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center flex-shrink-0 border border-teal-400/20">
              <HiOutlineOfficeBuilding className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">Organization</p>
              <p className="text-xs font-bold text-white truncate">{user.organizationName}</p>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onMobileClose}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all group ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-900/40 ring-1 ring-teal-400/30'
                    : 'text-slate-300 hover:text-white hover:bg-[#1E3A5F]/70'
                } ${collapsed ? 'justify-center' : ''}`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer: Collapse button & Logout */}
        <div className="p-3 border-t border-[#1E3A5F] bg-[#121c40]/60 space-y-1.5">
          {/* Desktop collapse toggle */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className={`hidden md:flex items-center gap-3 w-full px-3 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-[#1E3A5F] rounded-xl transition-colors ${
              collapsed ? 'justify-center' : ''
            }`}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <HiOutlineChevronRight className="w-5 h-5" />
            ) : (
              <>
                <HiOutlineChevronLeft className="w-4 h-4" />
                <span>Collapse Sidebar</span>
              </>
            )}
          </button>

          {/* Logout button */}
          <button
            type="button"
            onClick={logout}
            className={`flex items-center gap-3 w-full px-3 py-2.5 text-xs sm:text-sm font-semibold text-rose-300 hover:text-white hover:bg-rose-500/20 rounded-xl transition-colors ${
              collapsed ? 'justify-center' : ''
            }`}
            title={collapsed ? 'Sign Out' : undefined}
          >
            <HiOutlineLogout className="w-5 h-5 flex-shrink-0 text-rose-400" />
            {!collapsed && <span className="truncate">Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

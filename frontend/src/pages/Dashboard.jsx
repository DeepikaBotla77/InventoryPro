import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getDashboard } from '../api/dashboard';
import { getProducts } from '../api/products';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  HiOutlineCube,
  HiOutlineArchive,
  HiOutlineExclamationCircle,
  HiOutlineCurrencyDollar,
  HiOutlineArrowNarrowRight,
  HiOutlineCheckCircle,
  HiOutlineTrendingUp,
  HiOutlineRefresh,
  HiOutlinePencilAlt,
  HiOutlineShieldCheck,
  HiOutlinePlus,
} from 'react-icons/hi';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();

  const fetchData = useCallback(async () => {
    try {
      setError('');
      setLoading(true);
      const [dashRes, prodRes] = await Promise.all([
        getDashboard(),
        getProducts().catch(() => ({ data: [] })),
      ]);
      setDashboardData(dashRes.data);
      setProductsList(prodRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, location.key]);

  // Calculate real inventory value from actual unit costs or prices
  const inventoryValue = useMemo(() => {
    if (!productsList || productsList.length === 0) return 0;
    return productsList.reduce((acc, p) => {
      const price = Number(p.costPrice ?? p.sellingPrice ?? 0);
      return acc + (p.quantity || 0) * (isNaN(price) ? 0 : price);
    }, 0);
  }, [productsList]);

  // Currency formatter
  const formattedInventoryValue = useMemo(() => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(inventoryValue);
  }, [inventoryValue]);

  // Top products by stock volume for the distribution chart
  const topProducts = useMemo(() => {
    if (!productsList || productsList.length === 0) return [];
    return [...productsList]
      .sort((a, b) => (b.quantity || 0) - (a.quantity || 0))
      .slice(0, 5);
  }, [productsList]);

  const maxProductQty = useMemo(() => {
    if (topProducts.length === 0) return 1;
    return Math.max(...topProducts.map((p) => p.quantity || 0), 1);
  }, [topProducts]);

  // Stock health metrics
  const totalProductsCount = dashboardData?.totalProducts ?? 0;
  const lowStockCount = dashboardData?.lowStockCount ?? 0;
  const healthyCount = Math.max(0, totalProductsCount - lowStockCount);
  const healthPercent = totalProductsCount > 0
    ? Math.round((healthyCount / totalProductsCount) * 100)
    : 100;

  if (loading) return <LoadingSpinner message="Loading Dashboard Analytics..." />;

  if (error) {
    return (
      <div className="p-6 bg-white border border-rose-200 rounded-3xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
            <HiOutlineExclamationCircle className="w-6 h-6 stroke-2" />
          </div>
          <div>
            <p className="font-bold text-[#172554] text-sm sm:text-base">Unable to load dashboard</p>
            <p className="text-xs text-slate-500 mt-0.5">{error}</p>
          </div>
        </div>
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#172554] text-xs sm:text-sm font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
        >
          <HiOutlineRefresh className="w-4 h-4" />
          <span>Retry Metrics</span>
        </button>
      </div>
    );
  }

  const kpiCards = [
    {
      title: 'Catalog SKUs',
      value: totalProductsCount,
      subtext: `${totalProductsCount} registered products`,
      icon: HiOutlineCube,
      iconBg: 'bg-[#172554]/10 text-[#172554]',
      badge: 'Active Catalog',
      badgeColor: 'bg-slate-100 text-[#172554]',
      accentBar: 'from-[#172554] to-[#1E3A5F]',
    },
    {
      title: 'Total Stock Units',
      value: (dashboardData?.totalStockQuantity ?? 0).toLocaleString(),
      subtext: 'Units stored across inventory',
      icon: HiOutlineArchive,
      iconBg: 'bg-teal-50 text-teal-600 border border-teal-200/50',
      badge: 'In Stock',
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
      accentBar: 'from-teal-500 to-teal-600',
    },
    {
      title: 'Low Stock Alerts',
      value: lowStockCount,
      subtext: lowStockCount > 0 ? 'Requires immediate restock' : 'All buffer levels healthy',
      icon: HiOutlineExclamationCircle,
      iconBg: lowStockCount > 0 ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-teal-50 text-teal-600',
      badge: lowStockCount > 0 ? 'Action Needed' : 'Optimal',
      badgeColor: lowStockCount > 0 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-teal-50 text-teal-700 border-teal-200',
      accentBar: lowStockCount > 0 ? 'from-amber-400 to-amber-500' : 'from-teal-500 to-teal-600',
    },
    {
      title: 'Inventory Valuation',
      value: formattedInventoryValue,
      subtext: 'Computed from unit costs & pricing',
      icon: HiOutlineCurrencyDollar,
      iconBg: 'bg-[#1E3A5F]/10 text-[#1E3A5F]',
      badge: 'Live Assets',
      badgeColor: 'bg-slate-100 text-[#1E3A5F]',
      accentBar: 'from-[#1E3A5F] to-teal-700',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
        <div>
          <span className="text-[11px] font-bold text-teal-600 uppercase tracking-widest">
            Executive Dashboard
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#172554] tracking-tight mt-0.5">
            Real-Time Operations &amp; Inventory Metrics
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track multi-tenant inventory health, unit valuation, and automated reorder triggers.
          </p>
        </div>
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={fetchData}
            className="p-2.5 text-slate-500 hover:text-[#172554] hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 cursor-pointer"
            title="Refresh Metrics"
          >
            <HiOutlineRefresh className="w-5 h-5" />
          </button>
          <Link
            to="/products/new"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs shadow-teal-600/25 transition-all hover:shadow-md"
          >
            <HiOutlinePlus className="w-4 h-4 stroke-2" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <section aria-label="Executive Overview KPIs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {kpiCards.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden group"
            >
              {/* Top Accent Gradient Line */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${card.accentBar}`} />

              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest truncate">
                      {card.title}
                    </p>
                    <p className="text-2xl sm:text-3xl font-black text-[#172554] mt-1.5 tracking-tight">
                      {card.value}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${card.iconBg} shadow-2xs`}>
                    <card.icon className="w-6 h-6 stroke-2" />
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium truncate">{card.subtext}</span>
                {card.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${card.badgeColor} shrink-0`}>
                    {card.badge}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Analytics & Distribution Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory Health Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-[#172554] flex items-center gap-2">
                <HiOutlineShieldCheck className="w-5 h-5 text-teal-600" />
                <span>Inventory Health</span>
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                healthPercent >= 90
                  ? 'bg-teal-50 text-teal-800 border-teal-200'
                  : healthPercent >= 70
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}>
                {healthPercent}% Optimal
              </span>
            </div>

            {/* Health Meter Progress Bar */}
            <div className="space-y-2.5 mt-5">
              <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden flex p-0.5">
                <div
                  className="bg-teal-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${healthPercent}%` }}
                  title={`Healthy: ${healthyCount} products`}
                />
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${100 - healthPercent}%` }}
                  title={`Low Stock: ${lowStockCount} products`}
                />
              </div>

              <div className="flex items-center justify-between text-xs font-medium text-slate-500 pt-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                  <span>Healthy Stock ({healthyCount})</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Low Stock ({lowStockCount})</span>
                </span>
              </div>
            </div>

            {/* Metric Highlights */}
            <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-slate-100">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">In-Stock Rate</span>
                <p className="text-xl font-black text-[#172554] mt-0.5">{healthPercent}%</p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Low Stock Ratio</span>
                <p className={`text-xl font-black mt-0.5 ${lowStockCount > 0 ? 'text-amber-600' : 'text-[#172554]'}`}>
                  {totalProductsCount > 0 ? `${Math.round((lowStockCount / totalProductsCount) * 100)}%` : '0%'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link
              to="/products"
              className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center justify-between group"
            >
              <span>Explore product catalog</span>
              <HiOutlineArrowNarrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Stock Distribution Volume Chart */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#172554] flex items-center gap-2">
                  <HiOutlineTrendingUp className="w-5 h-5 text-teal-600" />
                  <span>Stock Distribution</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Top products ranked by available unit volume</p>
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2.5 py-1 rounded-lg">
                {productsList.length} Total SKUs
              </span>
            </div>

            {/* Distribution Bars */}
            {topProducts.length > 0 ? (
              <div className="space-y-4 mt-5">
                {topProducts.map((p) => {
                  const percentage = Math.round(((p.quantity || 0) / maxProductQty) * 100);
                  const isLow = p.lowStock || false;

                  return (
                    <div key={p.id} className="group">
                      <div className="flex items-center justify-between text-xs sm:text-sm font-semibold mb-1.5">
                        <div className="flex items-center gap-2 min-w-0 pr-4">
                          <span className="text-[#172554] font-bold truncate">{p.name}</span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono shrink-0 border border-slate-200/70">
                            {p.sku}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-extrabold text-[#172554]">{(p.quantity || 0).toLocaleString()} units</span>
                          {isLow && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                              Low Stock
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Bar Track */}
                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            isLow
                              ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                              : 'bg-gradient-to-r from-[#172554] to-teal-600'
                          }`}
                          style={{ width: `${Math.max(percentage, 5)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-14 text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <HiOutlineCube className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-slate-700">No product inventory yet</p>
                <p className="text-xs text-slate-400 mt-1">Add items to your catalog to populate inventory metrics</p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Volume breakdown across organization</span>
            <Link
              to="/products"
              className="font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 group"
            >
              <span>Manage Catalog</span>
              <HiOutlineArrowNarrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Low Stock Alerts Table Section */}
      <section className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 sm:p-7 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/70 flex items-center justify-center">
                <HiOutlineExclamationCircle className="w-5 h-5 stroke-2" />
              </div>
              <h3 className="text-lg font-black text-[#172554] tracking-tight">
                Low Stock Threshold Alerts
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                lowStockCount > 0
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-teal-50 text-teal-800 border-teal-200'
              }`}>
                {lowStockCount} {lowStockCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Products where available inventory is at or below the organization default or item threshold
            </p>
          </div>

          {lowStockCount > 0 && (
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors self-start sm:self-auto"
            >
              <span>View All Products</span>
              <HiOutlineArrowNarrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* Table or Empty State */}
        {dashboardData?.lowStockProducts && dashboardData.lowStockProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th scope="col" className="px-6 py-4">Product Details</th>
                  <th scope="col" className="px-5 py-4">SKU</th>
                  <th scope="col" className="px-5 py-4">Level Buffer</th>
                  <th scope="col" className="px-5 py-4">Available Qty</th>
                  <th scope="col" className="px-5 py-4">Threshold</th>
                  <th scope="col" className="px-5 py-4">Status</th>
                  <th scope="col" className="px-6 py-4 text-right">Quick Restock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dashboardData.lowStockProducts.map((product) => {
                  const effectiveThresh = product.lowStockThreshold ?? 10;
                  const ratio = Math.min(100, Math.round(((product.quantity || 0) / (effectiveThresh || 1)) * 100));

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-amber-50/20 transition-colors group"
                    >
                      {/* Product Name */}
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#172554] text-sm">{product.name}</div>
                        {product.description && (
                          <div className="text-xs text-slate-400 truncate max-w-xs mt-0.5">
                            {product.description}
                          </div>
                        )}
                      </td>

                      {/* SKU */}
                      <td className="px-5 py-4">
                        <span className="inline-flex px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-xs font-semibold border border-slate-200/80">
                          {product.sku}
                        </span>
                      </td>

                      {/* Visual Ratio Bar */}
                      <td className="px-5 py-4 w-36">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                product.quantity === 0
                                  ? 'bg-rose-500'
                                  : 'bg-amber-500'
                              }`}
                              style={{ width: `${Math.max(ratio, 8)}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-bold text-slate-500 w-8 text-right">
                            {ratio}%
                          </span>
                        </div>
                      </td>

                      {/* Available Qty */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-extrabold ${
                          product.quantity === 0
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {product.quantity} {product.quantity === 1 ? 'unit' : 'units'}
                        </span>
                      </td>

                      {/* Threshold */}
                      <td className="px-5 py-4 text-xs font-semibold text-slate-600">
                        {effectiveThresh} units
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                          <span>Low Stock</span>
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/products/${product.id}/edit`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-teal-700 hover:text-white bg-teal-50 hover:bg-teal-600 rounded-xl transition-all border border-teal-200/70"
                          title="Restock or update product"
                        >
                          <HiOutlinePencilAlt className="w-3.5 h-3.5" />
                          <span>Update</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Celebratory Empty State */
          <div className="py-16 px-4 text-center">
            <div className="w-16 h-16 rounded-3xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-4 border border-teal-200/70 shadow-sm">
              <HiOutlineCheckCircle className="w-9 h-9 stroke-2" />
            </div>
            <h4 className="text-lg font-extrabold text-[#172554] tracking-tight">
              All inventory levels are optimal!
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
              No products are currently at or below their designated low-stock threshold. Your organization&apos;s stock buffers are healthy.
            </p>
            <div className="mt-6">
              <Link
                to="/products/new"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all hover:shadow-md"
              >
                <HiOutlinePlus className="w-4 h-4 stroke-2" />
                <span>Add More Products</span>
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

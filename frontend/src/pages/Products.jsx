import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from '../api/products';
import LoadingSpinner from '../components/LoadingSpinner';
import DeleteModal from '../components/DeleteModal';
import {
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineCube,
  HiOutlineX,
} from 'react-icons/hi';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'IN_STOCK' | 'LOW_STOCK'
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = useCallback(async (query) => {
    try {
      setError('');
      const response = await getProducts(query);
      setProducts(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Debounced server search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, fetchProducts]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProduct(deleteTarget.id);
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
    } finally {
      setDeleting(false);
    }
  };

  const formatPrice = (price) => {
    if (price == null || price === '') return '—';
    return `$${Number(price).toFixed(2)}`;
  };

  // Client-side quick filter tabs
  const filteredProducts = useMemo(() => {
    if (statusFilter === 'LOW_STOCK') {
      return products.filter((p) => p.lowStock === true);
    }
    if (statusFilter === 'IN_STOCK') {
      return products.filter((p) => !p.lowStock);
    }
    return products;
  }, [products, statusFilter]);

  const lowStockCount = useMemo(() => {
    return products.filter((p) => p.lowStock === true).length;
  }, [products]);

  if (loading) return <LoadingSpinner message="Loading Product Catalog..." />;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
        <div>
          <span className="text-[11px] font-bold text-teal-600 uppercase tracking-widest">
            Inventory Database
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#172554] tracking-tight mt-0.5">
            Product Catalog &amp; Stock Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Maintain item specifications, SKU records, pricing structures, and custom stock alert thresholds.
          </p>
        </div>
        <Link
          to="/products/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs shadow-teal-600/25 transition-all hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 self-start sm:self-auto"
        >
          <HiOutlinePlus className="w-4 h-4 stroke-2" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by title, description or SKU..."
            className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:border-teal-600 focus:ring-4 focus:ring-teal-500/15 outline-none transition-all placeholder:text-slate-400 shadow-2xs font-medium"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              title="Clear search"
            >
              <HiOutlineX className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-2xs self-start md:self-auto">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'ALL'
                ? 'bg-[#172554] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            All ({products.length})
          </button>
          <button
            onClick={() => setStatusFilter('IN_STOCK')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'IN_STOCK'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            In Stock ({products.length - lowStockCount})
          </button>
          <button
            onClick={() => setStatusFilter('LOW_STOCK')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'LOW_STOCK'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Low Stock ({lowStockCount})
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm rounded-2xl font-medium">
          {error}
        </div>
      )}

      {/* Products Data Table */}
      <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden">
        {filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th scope="col" className="px-6 py-4">Product Details</th>
                  <th scope="col" className="px-5 py-4">SKU</th>
                  <th scope="col" className="px-5 py-4">Available Stock</th>
                  <th scope="col" className="px-5 py-4">Cost Price</th>
                  <th scope="col" className="px-5 py-4">Selling Price</th>
                  <th scope="col" className="px-5 py-4">Stock Status</th>
                  <th scope="col" className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/70 transition-colors group">
                    {/* Name & Description */}
                    <td className="px-6 py-4.5">
                      <div className="font-bold text-[#172554] text-sm group-hover:text-teal-700 transition-colors">
                        {product.name}
                      </div>
                      {product.description && (
                        <div className="text-xs text-slate-400 truncate max-w-xs sm:max-w-md mt-0.5">
                          {product.description}
                        </div>
                      )}
                    </td>

                    {/* SKU */}
                    <td className="px-5 py-4.5">
                      <span className="inline-flex px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-mono text-xs font-semibold border border-slate-200/80">
                        {product.sku}
                      </span>
                    </td>

                    {/* Stock Quantity */}
                    <td className="px-5 py-4.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-black ${
                        product.quantity === 0
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : product.lowStock
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-[#172554]'
                      }`}>
                        {(product.quantity || 0).toLocaleString()} units
                      </span>
                    </td>

                    {/* Cost Price */}
                    <td className="px-5 py-4.5 text-xs sm:text-sm text-slate-600 font-medium">
                      {formatPrice(product.costPrice)}
                    </td>

                    {/* Selling Price */}
                    <td className="px-5 py-4.5 text-xs sm:text-sm text-[#172554] font-bold">
                      {formatPrice(product.sellingPrice)}
                    </td>

                    {/* Status Badge */}
                    <td className="px-5 py-4.5">
                      {product.lowStock ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          <span>Low Stock</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                          <span>In Stock</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/products/${product.id}/edit`}
                          className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all"
                          title="Edit Product"
                        >
                          <HiOutlinePencil className="w-4 h-4 stroke-2" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(product)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                          title="Delete Product"
                        >
                          <HiOutlineTrash className="w-4 h-4 stroke-2" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty State */
          <div className="py-16 px-4 text-center">
            <div className="w-14 h-14 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3.5 border border-slate-200/60">
              <HiOutlineCube className="w-7 h-7" />
            </div>
            <p className="text-base font-extrabold text-[#172554]">
              {search
                ? `No products found for "${search}"`
                : statusFilter !== 'ALL'
                ? `No items found matching filter "${statusFilter}"`
                : 'No products in inventory catalog'}
            </p>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1">
              {search
                ? 'Check your spelling or try clearing the search input.'
                : statusFilter !== 'ALL'
                ? 'Try switching to the "All" tab to view your complete inventory.'
                : 'Get started by creating your first product record.'}
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Clear Search
                </button>
              )}
              {!search && statusFilter === 'ALL' && (
                <Link
                  to="/products/new"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors"
                >
                  <HiOutlinePlus className="w-4 h-4" />
                  <span>Add First Product</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <DeleteModal
          product={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          deleting={deleting}
        />
      )}
    </div>
  );
}

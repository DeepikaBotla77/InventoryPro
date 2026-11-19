import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getProduct, createProduct, updateProduct } from '../api/products';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  HiOutlineArrowNarrowLeft,
  HiOutlineCube,
  HiOutlineInformationCircle,
  HiOutlineCurrencyDollar,
  HiOutlineExclamation,
} from 'react-icons/hi';

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    sku: '',
    description: '',
    quantity: 0,
    costPrice: '',
    sellingPrice: '',
    lowStockThreshold: '',
  });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;

    const fetchProduct = async () => {
      try {
        const response = await getProduct(id);
        const p = response.data;
        setForm({
          name: p.name || '',
          sku: p.sku || '',
          description: p.description || '',
          quantity: p.quantity ?? 0,
          costPrice: p.costPrice ?? '',
          sellingPrice: p.sellingPrice ?? '',
          lowStockThreshold: p.lowStockThreshold ?? '',
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) {
      setError('Product name is required');
      return;
    }
    if (!form.sku.trim()) {
      setError('SKU identifier is required');
      return;
    }

    const quantityValue = form.quantity !== '' && !isNaN(form.quantity)
      ? parseInt(form.quantity, 10)
      : 0;

    const thresholdValue = form.lowStockThreshold !== '' && form.lowStockThreshold != null && !isNaN(form.lowStockThreshold)
      ? parseInt(form.lowStockThreshold, 10)
      : null;

    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      description: form.description.trim() || null,
      quantity: quantityValue,
      costPrice: form.costPrice !== '' ? parseFloat(form.costPrice) : null,
      sellingPrice: form.sellingPrice !== '' ? parseFloat(form.sellingPrice) : null,
      lowStockThreshold: thresholdValue,
    };

    setSaving(true);
    try {
      if (isEdit) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading Product Data..." />;

  // Dynamic profit margin indicator
  const cost = parseFloat(form.costPrice);
  const sell = parseFloat(form.sellingPrice);
  const hasMargin = !isNaN(cost) && !isNaN(sell) && cost > 0 && sell > 0;
  const marginPercent = hasMargin ? Math.round(((sell - cost) / cost) * 100) : null;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/products"
          className="p-2.5 text-slate-500 hover:text-[#172554] hover:bg-white bg-slate-200/50 rounded-2xl transition-colors border border-slate-200"
          title="Back to products catalog"
        >
          <HiOutlineArrowNarrowLeft className="w-5 h-5 stroke-2" />
        </Link>
        <div>
          <span className="text-[11px] font-bold text-teal-600 uppercase tracking-widest">
            {isEdit ? 'Catalog Revision' : 'New Registration'}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#172554] tracking-tight mt-0.5">
            {isEdit ? 'Update Product Information' : 'Register New Inventory Item'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {isEdit
              ? 'Modify inventory quantities, price points and threshold overrides'
              : 'Add product parameters, assign unique SKU, and define initial stock count'}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm rounded-2xl font-medium flex items-center gap-2.5">
          <HiOutlineExclamation className="w-5 h-5 flex-shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-7">
          {/* Section 1: Item Identity */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                <HiOutlineCube className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#172554] uppercase tracking-wider">
                Basic Item Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Product Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-teal-600 focus:ring-4 focus:ring-teal-500/15 outline-none transition-all placeholder:text-slate-400"
                  placeholder="e.g. Ergonomic Office Chair"
                />
              </div>

              <div>
                <label htmlFor="sku" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  SKU (Stock Keeping Unit) <span className="text-rose-500">*</span>
                </label>
                <input
                  id="sku"
                  name="sku"
                  type="text"
                  value={form.sku}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 focus:bg-white focus:border-teal-600 focus:ring-4 focus:ring-teal-500/15 outline-none transition-all uppercase placeholder:text-slate-400"
                  placeholder="e.g. CHR-ERG-001"
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="description" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Description / Specifications
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-teal-600 focus:ring-4 focus:ring-teal-500/15 outline-none transition-all resize-none placeholder:text-slate-400 font-medium"
                placeholder="Optional supplier notes, dimensions, or product categories"
              />
            </div>
          </div>

          {/* Section 2: Quantities & Pricing */}
          <div className="pt-6 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                <HiOutlineCurrencyDollar className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#172554] uppercase tracking-wider">
                Inventory Volume &amp; Pricing
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label htmlFor="quantity" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Current Stock <span className="text-rose-500">*</span>
                </label>
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="0"
                  value={form.quantity}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-extrabold text-[#172554] focus:bg-white focus:border-teal-600 focus:ring-4 focus:ring-teal-500/15 outline-none transition-all"
                />
              </div>

              <div>
                <label htmlFor="costPrice" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Cost Price ($)
                </label>
                <input
                  id="costPrice"
                  name="costPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.costPrice}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-teal-600 focus:ring-4 focus:ring-teal-500/15 outline-none transition-all"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label htmlFor="sellingPrice" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Selling Price ($)
                </label>
                <input
                  id="sellingPrice"
                  name="sellingPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.sellingPrice}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-[#172554] focus:bg-white focus:border-teal-600 focus:ring-4 focus:ring-teal-500/15 outline-none transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>

            {hasMargin && (
              <div className="mt-3 p-3 rounded-2xl bg-teal-50/70 border border-teal-200/80 flex items-center justify-between text-xs">
                <span className="font-semibold text-teal-900">Estimated Gross Margin:</span>
                <span className="font-extrabold text-teal-700">
                  {marginPercent > 0 ? `+${marginPercent}%` : `${marginPercent}%`} ($
                  {(sell - cost).toFixed(2)}/unit)
                </span>
              </div>
            )}
          </div>

          {/* Section 3: Low-Stock Threshold Override */}
          <div className="pt-6 border-t border-slate-100">
            <div className="max-w-md">
              <label htmlFor="lowStockThreshold" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Item Low-Stock Alert Threshold
              </label>
              <input
                id="lowStockThreshold"
                name="lowStockThreshold"
                type="number"
                min="0"
                value={form.lowStockThreshold}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-teal-600 focus:ring-4 focus:ring-teal-500/15 outline-none transition-all placeholder:text-slate-400"
                placeholder="Inherits organization default (e.g. 10)"
              />
              <div className="mt-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-start gap-2.5 text-xs text-slate-600">
                <HiOutlineInformationCircle className="w-4 h-4 flex-shrink-0 text-teal-600 mt-0.5" />
                <span>
                  Leave this input empty to automatically use your organization&apos;s global default threshold configured in Settings.
                </span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-6 border-t border-slate-100">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-sm rounded-xl shadow-xs shadow-teal-600/25 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Register Product'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

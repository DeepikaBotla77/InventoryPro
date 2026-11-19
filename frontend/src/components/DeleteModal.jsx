import { HiOutlineExclamation, HiOutlineTrash } from 'react-icons/hi';

export default function DeleteModal({ product, onCancel, onConfirm, deleting = false }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-6 sm:p-8 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center flex-shrink-0 shadow-xs">
            <HiOutlineExclamation className="w-6 h-6 stroke-2" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold text-[#172554] tracking-tight">
              Delete Product
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Target Item</p>
          <p className="text-sm font-bold text-[#172554] mt-0.5 truncate">
            {product?.name}
          </p>
          {product?.sku && (
            <p className="text-xs font-mono text-slate-500 mt-0.5">
              SKU: {product.sku}
            </p>
          )}
        </div>

        <p className="text-xs text-slate-600 mt-4 leading-relaxed">
          Deleting this item will permanently remove it from your organization&apos;s product catalog and adjust your dashboard metrics.
        </p>

        <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm shadow-rose-600/30 transition-all hover:shadow-md disabled:opacity-50 cursor-pointer"
          >
            <HiOutlineTrash className="w-4 h-4" />
            <span>{deleting ? 'Deleting...' : 'Delete Item'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

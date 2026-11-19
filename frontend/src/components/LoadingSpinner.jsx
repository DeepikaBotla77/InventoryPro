export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[360px] py-12">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-3 border-teal-500/20 animate-ping absolute inset-0" />
        <div className="w-12 h-12 rounded-full border-3 border-slate-200 border-t-teal-600 animate-spin" />
      </div>
      <p className="mt-4 text-xs font-semibold text-slate-500 uppercase tracking-wider animate-pulse">
        {message}
      </p>
    </div>
  );
}

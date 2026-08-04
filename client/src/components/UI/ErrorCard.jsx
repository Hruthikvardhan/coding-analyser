import { FiAlertTriangle } from 'react-icons/fi';

export default function ErrorCard({ title = 'Could not load data', message, onRetry }) {
  return (
    <div className="card p-5 border-coral-400/30">
      <div className="flex items-start gap-3">
        <FiAlertTriangle className="text-coral-400 mt-0.5" size={20} />
        <div className="flex-1">
          <p className="font-medium text-slate-200">{title}</p>
          {message && <p className="text-sm text-slate-500 mt-1">{message}</p>}
          {onRetry && (
            <button onClick={onRetry} className="btn-ghost mt-3 text-xs px-3 py-1.5">
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

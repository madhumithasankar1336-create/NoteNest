import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`toast ${toast.type}`} role="status">
      {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />} {toast.message}
    </div>
  );
}

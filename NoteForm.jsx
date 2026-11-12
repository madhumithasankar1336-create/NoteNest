import { useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { CATEGORIES } from './Sidebar';

export const COLORS = ['#ffffff', '#e9e3ff', '#dbeafe', '#d1fae5', '#fef3c7', '#fde2e4'];
const MAX = 2000;

export default function NoteForm({ initial, onSubmit, onCancel, submitLabel = 'Save note' }) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    content: initial?.content || '',
    category: initial?.category || 'General',
    tags: (initial?.tags || []).join(', '),
    color: initial?.color || COLORS[0]
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const set = key => e => setForm({ ...form, [key]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    if (busy) return;
    if (!form.title.trim()) return setError('Add a title for your note.');
    if (!form.content.trim()) return setError('Write something in the note body.');
    setError('');
    setBusy(true);
    const ok = await onSubmit({ ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) });
    setBusy(false);
    if (ok && !initial) setForm({ title: '', content: '', category: 'General', tags: '', color: COLORS[0] });
  };

  return (
    <form className="note-form" onSubmit={submit} noValidate>
      <input className="field title-field" placeholder="Note title" maxLength={120} value={form.title} onChange={set('title')} />
      <textarea className="field" rows={5} placeholder="Write your note…" maxLength={MAX} value={form.content} onChange={set('content')} />
      <div className="counter">{form.content.length} / {MAX}</div>
      <div className="row">
        <select className="field" value={form.category} onChange={set('category')} aria-label="Category">
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <input className="field" placeholder="Tags, comma separated" value={form.tags} onChange={set('tags')} aria-label="Tags" />
      </div>
      <div className="swatches" role="radiogroup" aria-label="Note colour">
        {COLORS.map(c => (
          <button type="button" key={c} role="radio" aria-checked={form.color === c} aria-label={`Colour ${c}`}
            className={`swatch${form.color === c ? ' on' : ''}`} style={{ background: c }} onClick={() => setForm({ ...form, color: c })} />
        ))}
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="actions">
        {onCancel && <button type="button" className="btn ghost" onClick={onCancel}>Cancel</button>}
        <button className="btn primary" disabled={busy}>
          {busy ? <Loader2 size={16} className="spin" /> : <Save size={16} />} {busy ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}

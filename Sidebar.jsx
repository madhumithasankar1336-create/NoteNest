import { Archive, Clock, FolderOpen, Notebook, Pin } from 'lucide-react';

export const CATEGORIES = ['General', 'Work', 'Personal', 'Ideas', 'Study', 'Health'];
const VIEWS = [
  { id: 'all', label: 'All Notes', icon: Notebook },
  { id: 'pinned', label: 'Pinned Notes', icon: Pin },
  { id: 'archived', label: 'Archived Notes', icon: Archive },
  { id: 'recent', label: 'Recently Updated', icon: Clock }
];

export default function Sidebar({ view, onView, category, onCategory, counts, open, onClose }) {
  return (
    <>
      {open && <div className="scrim" onClick={onClose} />}
      <aside className={`sidebar glass${open ? ' open' : ''}`}>
        <nav>
          {VIEWS.map(({ id, label, icon: Icon }) => (
            <button key={id} className={`nav-item${view === id ? ' active' : ''}`} onClick={() => { onView(id); onClose(); }}>
              <Icon size={18} /><span>{label}</span>
              {counts[id] !== undefined && <em>{counts[id]}</em>}
            </button>
          ))}
        </nav>
        <h3><FolderOpen size={16} /> Categories</h3>
        <nav>
          <button className={`nav-item${category === '' ? ' active' : ''}`} onClick={() => { onCategory(''); onClose(); }}>
            <span>Every category</span>
          </button>
          {CATEGORIES.map(c => (
            <button key={c} className={`nav-item${category === c ? ' active' : ''}`} onClick={() => { onCategory(c); onClose(); }}>
              <span>{c}</span><em>{counts.cat[c] || 0}</em>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}

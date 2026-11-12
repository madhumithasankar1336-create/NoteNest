import { Archive, ArchiveRestore, Pencil, Pin, PinOff, Trash2 } from 'lucide-react';

const fmt = iso => new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

export default function NoteCard({ note, onEdit, onDelete, onPin, onArchive }) {
  const edited = note.updated_at !== note.created_at;
  return (
    <article className="note-card" style={{ '--note': note.color }}>
      <div className="note-top">
        <h3>{note.title}</h3>
        {note.is_pinned && <Pin size={16} className="pinned" aria-label="Pinned" />}
      </div>
      <p className="preview">{note.content}</p>
      <div className="meta">
        <span className="chip cat">{note.category}</span>
        {note.tags.map(t => <span key={t} className="chip">#{t}</span>)}
      </div>
      <div className="dates">
        <span>Created {fmt(note.created_at)}</span>
        <span>Updated {edited ? fmt(note.updated_at) : 'not yet'}</span>
      </div>
      <div className="card-actions">
        <button onClick={() => onPin(note)} aria-label={note.is_pinned ? 'Unpin' : 'Pin'} title={note.is_pinned ? 'Unpin' : 'Pin'}>{note.is_pinned ? <PinOff size={16} /> : <Pin size={16} />}</button>
        <button onClick={() => onArchive(note)} aria-label={note.is_archived ? 'Restore' : 'Archive'} title={note.is_archived ? 'Restore' : 'Archive'}>{note.is_archived ? <ArchiveRestore size={16} /> : <Archive size={16} />}</button>
        <button onClick={() => onEdit(note)} aria-label="Edit" title="Edit"><Pencil size={16} /></button>
        <button className="danger" onClick={() => onDelete(note)} aria-label="Delete" title="Delete"><Trash2 size={16} /></button>
      </div>
    </article>
  );
}

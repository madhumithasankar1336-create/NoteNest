import { Menu, Moon, NotebookPen, Search, Sun, User } from 'lucide-react';

export default function Header({ search, onSearch, theme, onToggleTheme, onMenu }) {
  return (
    <header className="header glass">
      <button className="icon-btn menu-btn" onClick={onMenu} aria-label="Open menu"><Menu size={20} /></button>
      <div className="logo"><NotebookPen size={22} /><span>NoteNest</span></div>
      <label className="search">
        <Search size={18} />
        <input value={search} onChange={e => onSearch(e.target.value)} placeholder="Search title, content or tags" aria-label="Search notes" />
      </label>
      <button className="icon-btn" onClick={onToggleTheme} aria-label="Toggle theme">
        {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
      </button>
      <div className="avatar" aria-label="Profile"><User size={18} /></div>
    </header>
  );
}

import { NavLink } from 'react-router-dom';
import { FiTerminal } from 'react-icons/fi';

const links = [
  { to: '/', label: 'Home' },
  { to: '/results', label: 'Results' },
  { to: '/compare', label: 'Compare' },
  { to: '/saved', label: 'Saved' },
  { to: '/leaderboard', label: 'Leaderboard' }
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink-600/50 bg-ink-950/80 backdrop-blur-md">
      <nav className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2 text-slate-100 font-semibold">
          <FiTerminal className="text-amber-400" size={20} />
          <span className="font-stat">code_analyser</span>
        </NavLink>
        <div className="hidden sm:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm px-3 py-1.5 rounded-lg transition-colors ${
                  isActive ? 'text-amber-400 bg-amber-400/10' : 'text-slate-400 hover:text-slate-200'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}

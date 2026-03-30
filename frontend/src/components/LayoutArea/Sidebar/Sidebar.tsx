import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/weekly', label: 'Weekly Planner' },
  { to: '/study', label: 'Study Planner' },
  { to: '/money', label: 'Money Planner' },
  { to: '/settings', label: 'Settings' },
];

function Sidebar() {
  return (
    <aside className="hidden w-[260px] shrink-0 border-r border-[#eadfd7] bg-[#f3e8e2] px-4 py-6 md:block">
      <div className="mb-6 rounded-[24px] bg-white/70 p-4 shadow-sm">
        <p className="mb-1 text-xs uppercase tracking-[0.24em] text-[#b08f82]">
          This week
        </p>
        <h2 className="text-lg font-semibold text-[#3c312c]">
          Plan softly, stay consistent
        </h2>
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#fffaf7] text-[#2f2a26] shadow-sm'
                  : 'text-[#6f625b] hover:bg-white/60 hover:text-[#2f2a26]'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/weekly', label: 'Weekly Planner' },
  { to: '/study', label: 'Study Planner' },
  { to: '/money', label: 'Money Planner' },
  { to: '/settings', label: 'Settings' },
];

function Sidebar() {
  const userName = 'Kareen';
  const userRole = 'Personal planner';
  const userImage = '';

  return (
    <aside className="hidden w-[280px] shrink-0 bg-[#f3e8e2] px-4 py-5 md:block">
      <div className="mb-6 flex items-center gap-3 px-2">
  {userImage ? (
    <img
      src={userImage}
      alt={userName}
      className="h-10 w-10 rounded-full object-cover"
    />
  ) : (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e7d8cf] text-sm font-semibold text-[#5f524b]">
      {userName.charAt(0)}
    </div>
  )}

  <div className="min-w-0">
    <p className="truncate text-sm font-medium text-[#3c312c]">
      {userName}
    </p>
    <p className="text-xs text-[#7a6a62]">
      {userRole}
    </p>
  </div>
</div>

      <nav className="flex flex-col gap-2.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `rounded-[20px] px-4 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-[#fffaf7] text-[#2f2a26] shadow-[0_8px_20px_rgba(97,72,57,0.08)] ring-1 ring-[#eadfd7]'
                  : 'text-[#6f625b] hover:bg-white/70 hover:text-[#2f2a26]'
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
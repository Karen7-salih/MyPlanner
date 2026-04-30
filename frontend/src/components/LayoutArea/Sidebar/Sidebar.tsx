import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  Wallet,
  Settings,
} from 'lucide-react';
import logo from '../../../assets/logo.png';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/weekly', label: 'Weekly Planner', icon: CalendarDays },
  { to: '/study', label: 'Study Planner', icon: BookOpen },
  { to: '/money', label: 'Money Planner', icon: Wallet },
  { to: '/settings', label: 'Settings', icon: Settings },
];

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const userName = 'Kareen';
  const userEmail = 'kareen@email.com';
  const userImage = '';

  return (
    <aside
      className={`hidden min-h-screen shrink-0 border-r border-[#eadfd7] bg-[#f3e8e2] transition-all duration-300 md:flex md:flex-col ${isCollapsed ? 'w-[96px]' : 'w-[280px]'
        }`}
    >
      <div className="flex h-screen flex-col">
        <div className="px-3 pt-1 pb-4">           <div
          className={`mb-4 flex items-start ${isCollapsed ? 'justify-center' : 'justify-between'
            }`}
        >
          {!isCollapsed && (
            <div className="flex items-center overflow-hidden px-4 -ml-7">
              <img
                src={logo}
                alt="Planora logo"
                className="h-60 w-auto object-contain -mt-1"
              />
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px] border border-[#d8c8bf] bg-[#fffaf7] text-[#5f524b] shadow-sm transition hover:bg-white"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `group flex items-center rounded-[20px] transition-all duration-200 ${isCollapsed
                      ? 'justify-center px-2 py-3.5'
                      : 'gap-3 px-4 py-3'
                    } ${isActive
                      ? 'bg-[#fffaf7] text-[#2f2a26] shadow-[0_8px_20px_rgba(97,72,57,0.08)] ring-1 ring-[#eadfd7]'
                      : 'text-[#6f625b] hover:bg-white/70 hover:text-[#2f2a26]'
                    }`
                  }
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon size={20} className="shrink-0" />
                  {!isCollapsed && (
                    <span className="truncate text-sm font-medium">
                      {item.label}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-[#ddcfc6] px-3 py-4">
          <div
            className={`flex ${isCollapsed
                ? 'justify-center'
                : 'items-center gap-3'
              }`}
          >
            {userImage ? (
              <img
                src={userImage}
                alt={userName}
                className="h-11 w-11 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e7d8cf] text-sm font-semibold text-[#5f524b]">
                {userName.charAt(0)}
              </div>
            )}

            {!isCollapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[#3c312c]">
                  {userName}
                </p>
                <p className="truncate text-xs text-[#9b8f88]">{userEmail}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
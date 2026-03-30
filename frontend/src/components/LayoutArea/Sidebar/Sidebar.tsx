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
        <aside className="hidden w-[280px] shrink-0 bg-[#f3e8e2] px-4 py-5 md:block">
            <div className="mb-7 rounded-[28px] border border-white/50 bg-[#fffaf7] p-5 shadow-[0_10px_25px_rgba(97,72,57,0.06)]">
                <p className="mb-2 text-[11px] uppercase tracking-[0.28em] text-[#b08f82]">
                    This week
                </p>
                <h2 className="text-lg font-semibold leading-7 text-[#3c312c]">
                    Plan softly, stay consistent
                </h2>
            </div>

            <nav className="flex flex-col gap-2.5">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === '/'}
                        className={({ isActive }) =>
                            `rounded-[20px] px-4 py-3 text-sm font-medium transition-all duration-200 ${isActive
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
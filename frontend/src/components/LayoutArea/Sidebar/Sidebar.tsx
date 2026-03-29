import { NavLink } from 'react-router-dom';

function Sidebar() {
  return (
    <aside className="planner-sidebar">
      <nav className="planner-sidebar__nav">
        <NavLink to="/" end className="planner-nav-link">
          Dashboard
        </NavLink>

        <NavLink to="/weekly" className="planner-nav-link">
          Weekly Planner
        </NavLink>

        <NavLink to="/study" className="planner-nav-link">
          Study Planner
        </NavLink>

        <NavLink to="/money" className="planner-nav-link">
          Money Planner
        </NavLink>

        <NavLink to="/settings" className="planner-nav-link">
          Settings
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
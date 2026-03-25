import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdDashboard, MdTrendingUp, MdTrendingDown, MdLogout } from 'react-icons/md';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">Expense Tracker</div>
      <div className="sidebar-profile">
        <div className="profile-avatar">
          {user?.profileImage ? (
            <img src={user.profileImage} alt={user.fullName} />
          ) : (
            <span>👤</span>
          )}
        </div>
        <div className="profile-name">{user?.fullName || 'User'}</div>
      </div>
      <nav className="sidebar-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <MdDashboard /> Dashboard
        </NavLink>
        <NavLink
          to="/income"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <MdTrendingUp /> Income
        </NavLink>
        <NavLink
          to="/expense"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <MdTrendingDown /> Expense
        </NavLink>
        <button className="nav-item" onClick={handleLogout} style={{ marginTop: 'auto' }}>
          <MdLogout /> Logout
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;

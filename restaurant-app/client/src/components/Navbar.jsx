import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

const linkBase = 'px-3 py-2 rounded-md text-sm font-medium';
const linkInactive = 'text-slate-600 hover:text-slate-900 hover:bg-slate-100';
const linkActive = 'text-blue-700 bg-blue-50';

function navClass({ isActive }) {
  return `${linkBase} ${isActive ? linkActive : linkInactive}`;
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-slate-200">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2">
        <Link to="/" className="text-lg font-semibold text-slate-900 mr-4">
          Spice Garden
        </Link>

        <NavLink to="/" end className={navClass}>Menu</NavLink>
        {user && <NavLink to="/favorites" className={navClass}>Favorites</NavLink>}
        {user && <NavLink to="/reservations" className={navClass}>Reservations</NavLink>}
        {user && user.role === 'admin' && (
          <NavLink to="/admin" className={navClass}>Admin</NavLink>
        )}

        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <>
              <span className="text-sm text-slate-600">Hi, {user.name}</span>
              <button
                type="button"
                onClick={() => { logout(); navigate('/'); }}
                className="px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navClass}>Login</NavLink>
              <NavLink
                to="/register"
                className="px-3 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

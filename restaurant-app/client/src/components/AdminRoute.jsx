import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="p-8 text-slate-500">Loading…</div>;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (user.role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto p-8">
        <h1 className="text-2xl font-semibold mb-2">403 — Admins only</h1>
        <p className="text-slate-600">You don&apos;t have permission to view this page.</p>
      </div>
    );
  }
  return children;
}

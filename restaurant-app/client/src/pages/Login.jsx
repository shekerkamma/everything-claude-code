import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const banner = location.state && location.state.message;
  const from = (location.state && location.state.from) || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null); setSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-4">Log in</h1>
      {banner && <p className="mb-3 px-3 py-2 rounded bg-blue-50 text-blue-800 text-sm">{banner}</p>}
      {error && <p className="mb-3 px-3 py-2 rounded bg-red-50 text-red-700 text-sm">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3 bg-white p-5 rounded-lg border border-slate-200">
        <label className="block">
          <span className="block text-sm font-medium text-slate-700 mb-1">Email</span>
          <input
            type="email" required value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md"
          />
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-slate-700 mb-1">Password</span>
          <input
            type="password" required value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md"
          />
        </label>
        <button
          type="submit" disabled={submitting}
          className="w-full px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400"
        >
          {submitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>
      <p className="text-sm text-slate-600 mt-3">
        No account? <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
      </p>
    </main>
  );
}

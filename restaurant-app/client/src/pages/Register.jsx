import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setSubmitting(true);
    try {
      await register(email, password, name);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-4">Create your account</h1>
      {error && <p className="mb-3 px-3 py-2 rounded bg-red-50 text-red-700 text-sm">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3 bg-white p-5 rounded-lg border border-slate-200">
        <label className="block">
          <span className="block text-sm font-medium text-slate-700 mb-1">Name</span>
          <input type="text" required value={name} onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md" />
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-slate-700 mb-1">Email</span>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md" />
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-slate-700 mb-1">Password (min 8 chars)</span>
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md" />
        </label>
        <button type="submit" disabled={submitting}
          className="w-full px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400">
          {submitting ? 'Creating account…' : 'Register'}
        </button>
      </form>
      <p className="text-sm text-slate-600 mt-3">
        Have an account? <Link to="/login" className="text-blue-600 hover:underline">Log in</Link>
      </p>
    </main>
  );
}

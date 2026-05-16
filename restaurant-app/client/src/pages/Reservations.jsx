import { useEffect, useState } from 'react';
import { apiFetch } from '../api.js';

function todayIso() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

const STATUS_STYLE = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-slate-200 text-slate-700'
};

export default function Reservations() {
  const today = todayIso();
  const [date, setDate] = useState(today);
  const [time, setTime] = useState('19:00');
  const [partySize, setPartySize] = useState(2);
  const [note, setNote] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [list, setList] = useState([]);

  function load() {
    apiFetch('/reservations').then(setList).catch(() => {});
  }
  useEffect(load, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null); setSuccess(null);
    if (date < today) { setError('Date must be today or later'); return; }
    setSubmitting(true);
    try {
      await apiFetch('/reservations', {
        method: 'POST',
        body: JSON.stringify({ date, time, partySize: Number(partySize), note: note || undefined })
      });
      setSuccess('Booking received — we&apos;ll confirm shortly.');
      setNote('');
      load();
    } catch (err) {
      setError(err.message || 'Could not save reservation');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-semibold mb-4">Reservations</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-lg p-5 space-y-3 mb-8">
        <h2 className="font-semibold">Book a table</h2>
        {error && <p className="px-3 py-2 rounded bg-red-50 text-red-700 text-sm">{error}</p>}
        {success && <p className="px-3 py-2 rounded bg-green-50 text-green-800 text-sm">{success}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className="block">
            <span className="block text-sm font-medium text-slate-700 mb-1">Date</span>
            <input type="date" required min={today} value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md" />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-slate-700 mb-1">Time</span>
            <input type="time" required value={time}
              onChange={e => setTime(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md" />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-slate-700 mb-1">Party size</span>
            <input type="number" required min={1} max={12} value={partySize}
              onChange={e => setPartySize(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md" />
          </label>
        </div>
        <label className="block">
          <span className="block text-sm font-medium text-slate-700 mb-1">Note (optional)</span>
          <textarea value={note} maxLength={500} rows={2}
            onChange={e => setNote(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md" />
        </label>
        <button type="submit" disabled={submitting}
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400">
          {submitting ? 'Submitting…' : 'Book a table'}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-3">Your reservations</h2>
      {list.length === 0 && <p className="text-slate-500">No reservations yet.</p>}
      <ul className="divide-y divide-slate-200 bg-white border border-slate-200 rounded-lg">
        {list.map(r => (
          <li key={r.id} className="px-4 py-3 flex items-center gap-3">
            <span className="font-medium text-slate-900">{r.date} @ {r.time}</span>
            <span className="text-slate-600">party of {r.partySize}</span>
            {r.note && <span className="text-slate-500 text-sm italic truncate">"{r.note}"</span>}
            <span className={`ml-auto text-xs px-2 py-0.5 rounded ${STATUS_STYLE[r.status] || 'bg-slate-200'}`}>
              {r.status}
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}

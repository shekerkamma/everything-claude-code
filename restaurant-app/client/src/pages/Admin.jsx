import { useEffect, useState } from 'react';
import { apiFetch } from '../api.js';

const TABS = ['overview', 'dishes', 'reservations'];

function dollars(c) { return `$${(c / 100).toFixed(2)}`; }

export default function Admin() {
  const [tab, setTab] = useState('overview');
  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-semibold mb-4">Admin dashboard</h1>
      <div role="tablist" className="flex gap-2 mb-6 border-b border-slate-200">
        {TABS.map(t => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 -mb-px border-b-2 text-sm font-medium ${tab === t ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      {tab === 'overview' && <Overview />}
      {tab === 'dishes' && <Dishes />}
      {tab === 'reservations' && <Reservations />}
    </main>
  );
}

function Overview() {
  const [stats, setStats] = useState(null);
  useEffect(() => { apiFetch('/admin/stats').then(setStats).catch(() => {}); }, []);
  if (!stats) return <p className="text-slate-500">Loading…</p>;
  const cards = [
    { label: 'Categories', value: stats.categories, color: 'bg-blue-50 text-blue-700' },
    { label: 'Dishes', value: stats.dishes, color: 'bg-green-50 text-green-700' },
    { label: 'Customers', value: stats.customers, color: 'bg-amber-50 text-amber-700' },
    { label: 'Reservations', value: stats.reservations, color: 'bg-purple-50 text-purple-700' }
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {cards.map(c => (
        <div key={c.label} className={`${c.color} rounded-lg p-5`}>
          <div className="text-3xl font-semibold">{c.value}</div>
          <div className="text-sm font-medium">{c.label}</div>
        </div>
      ))}
    </div>
  );
}

function Dishes() {
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null); // dish or null
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  function load() {
    Promise.all([apiFetch('/dishes'), apiFetch('/categories')])
      .then(([d, c]) => { setDishes(d); setCategories(c); })
      .catch(e => setError(e.message));
  }
  useEffect(load, []);

  async function deleteDish(id) {
    if (!confirm('Delete this dish?')) return;
    try {
      await apiFetch(`/admin/dishes/${id}`, { method: 'DELETE' });
      load();
    } catch (e) { setError(e.message); }
  }

  return (
    <div>
      {error && <p className="mb-3 px-3 py-2 rounded bg-red-50 text-red-700 text-sm">{error}</p>}
      <div className="flex justify-end mb-3">
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
        >
          + New dish
        </button>
      </div>
      <table className="w-full bg-white border border-slate-200 rounded-lg overflow-hidden">
        <thead className="bg-slate-50 text-left text-sm text-slate-600">
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Flags</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {dishes.map(d => {
            const cat = categories.find(c => c.id === d.categoryId);
            return (
              <tr key={d.id} className="border-t border-slate-100">
                <td className="px-4 py-2">{d.name}</td>
                <td className="px-4 py-2 text-slate-600">{cat ? cat.name : '—'}</td>
                <td className="px-4 py-2">{dollars(d.priceCents)}</td>
                <td className="px-4 py-2 text-slate-600">
                  {d.isVegetarian && '🌱 '}{d.isSpicy && '🌶️ '}{d.isPopular && '⭐'}
                </td>
                <td className="px-4 py-2 text-right">
                  <button onClick={() => setEditing(d)} className="text-blue-600 hover:underline mr-3">Edit</button>
                  <button onClick={() => deleteDish(d.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {(editing || creating) && (
        <DishForm
          dish={editing}
          categories={categories}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSaved={() => { setEditing(null); setCreating(false); load(); }}
        />
      )}
    </div>
  );
}

function DishForm({ dish, categories, onClose, onSaved }) {
  const [name, setName] = useState(dish ? dish.name : '');
  const [categoryId, setCategoryId] = useState(dish ? dish.categoryId : (categories[0] && categories[0].id) || 1);
  const [description, setDescription] = useState(dish ? dish.description : '');
  const [priceDollars, setPriceDollars] = useState(dish ? (dish.priceCents / 100).toFixed(2) : '0.00');
  const [imageUrl, setImageUrl] = useState(dish ? dish.imageUrl : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800');
  const [isVegetarian, setIsVegetarian] = useState(dish ? dish.isVegetarian : false);
  const [isSpicy, setIsSpicy] = useState(dish ? dish.isSpicy : false);
  const [isPopular, setIsPopular] = useState(dish ? dish.isPopular : false);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null); setBusy(true);
    try {
      const payload = {
        name, categoryId: Number(categoryId), description,
        priceCents: Math.round(parseFloat(priceDollars) * 100),
        imageUrl, isVegetarian, isSpicy, isPopular
      };
      if (dish) {
        await apiFetch(`/admin/dishes/${dish.id}`, { method: 'PATCH', body: JSON.stringify(payload) });
      } else {
        await apiFetch('/admin/dishes', { method: 'POST', body: JSON.stringify(payload) });
      }
      onSaved();
    } catch (e) {
      setError(e.message);
    } finally { setBusy(false); }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <form onSubmit={handleSubmit} onClick={e => e.stopPropagation()}
        className="bg-white rounded-xl max-w-lg w-full p-5 space-y-3">
        <h2 className="text-xl font-semibold">{dish ? 'Edit dish' : 'New dish'}</h2>
        {error && <p className="px-3 py-2 rounded bg-red-50 text-red-700 text-sm">{error}</p>}
        <label className="block">
          <span className="block text-sm font-medium mb-1">Name</span>
          <input required value={name} onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md" />
        </label>
        <label className="block">
          <span className="block text-sm font-medium mb-1">Category</span>
          <select value={categoryId} onChange={e => setCategoryId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md">
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="block text-sm font-medium mb-1">Description</span>
          <textarea required rows={2} value={description} onChange={e => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md" />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="block text-sm font-medium mb-1">Price (USD)</span>
            <input type="number" step="0.01" min="0" required value={priceDollars}
              onChange={e => setPriceDollars(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md" />
          </label>
          <label className="block">
            <span className="block text-sm font-medium mb-1">Image URL</span>
            <input type="url" required value={imageUrl} onChange={e => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md" />
          </label>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={isVegetarian} onChange={e => setIsVegetarian(e.target.checked)} /> Vegetarian
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={isSpicy} onChange={e => setIsSpicy(e.target.checked)} /> Spicy
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={isPopular} onChange={e => setIsPopular(e.target.checked)} /> Popular
          </label>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-3 py-2 rounded-md text-slate-600 hover:bg-slate-100">Cancel</button>
          <button type="submit" disabled={busy} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400">
            {busy ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Reservations() {
  const [list, setList] = useState([]);
  const [error, setError] = useState(null);

  function load() { apiFetch('/admin/reservations').then(setList).catch(e => setError(e.message)); }
  useEffect(load, []);

  async function setStatus(id, status) {
    try {
      await apiFetch(`/admin/reservations/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
      load();
    } catch (e) { setError(e.message); }
  }

  return (
    <div>
      {error && <p className="mb-3 px-3 py-2 rounded bg-red-50 text-red-700 text-sm">{error}</p>}
      <table className="w-full bg-white border border-slate-200 rounded-lg overflow-hidden">
        <thead className="bg-slate-50 text-left text-sm text-slate-600">
          <tr>
            <th className="px-4 py-2">Customer</th>
            <th className="px-4 py-2">Date / Time</th>
            <th className="px-4 py-2">Party</th>
            <th className="px-4 py-2">Note</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {list.map(r => (
            <tr key={r.id} className="border-t border-slate-100">
              <td className="px-4 py-2">{r.user.name} <span className="text-slate-500">&lt;{r.user.email}&gt;</span></td>
              <td className="px-4 py-2">{r.date} @ {r.time}</td>
              <td className="px-4 py-2">{r.partySize}</td>
              <td className="px-4 py-2 text-slate-600 max-w-xs truncate">{r.note || '—'}</td>
              <td className="px-4 py-2">
                <select value={r.status} onChange={e => setStatus(r.id, e.target.value)}
                  className="px-2 py-1 border border-slate-300 rounded">
                  <option value="pending">pending</option>
                  <option value="confirmed">confirmed</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </td>
            </tr>
          ))}
          {list.length === 0 && (
            <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-500">No reservations yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

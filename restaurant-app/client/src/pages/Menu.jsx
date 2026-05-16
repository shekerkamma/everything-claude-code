import { useEffect, useState } from 'react';
import { apiFetch } from '../api.js';
import { useAuth } from '../auth.jsx';
import DishCard from '../components/DishCard.jsx';
import DishDetailModal from '../components/DishDetailModal.jsx';

export default function Menu() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [activeCat, setActiveCat] = useState('all');
  const [selectedDish, setSelectedDish] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([apiFetch('/categories'), apiFetch('/dishes')])
      .then(([c, d]) => { if (!cancelled) { setCategories(c); setDishes(d); } })
      .catch(e => !cancelled && setError(e.message));
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!user) { setFavoriteIds(new Set()); return; }
    apiFetch('/favorites')
      .then(list => setFavoriteIds(new Set(list.map(f => f.dish.id))))
      .catch(() => {});
  }, [user]);

  async function toggleFavorite(dish, shouldFavorite) {
    try {
      if (shouldFavorite) {
        await apiFetch('/favorites', { method: 'POST', body: JSON.stringify({ dishId: dish.id }) });
        setFavoriteIds(prev => new Set(prev).add(dish.id));
      } else {
        await apiFetch(`/favorites/${dish.id}`, { method: 'DELETE' });
        setFavoriteIds(prev => { const n = new Set(prev); n.delete(dish.id); return n; });
      }
    } catch (e) {
      setError(e.message);
    }
  }

  const visible = activeCat === 'all'
    ? dishes
    : dishes.filter(d => d.categoryId === activeCat);

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-semibold mb-2">Menu</h1>
      <p className="text-slate-600 mb-5">
        Welcome to Spice Garden. Browse our menu below — log in to save favorites or book a table.
      </p>

      {error && (
        <div className="mb-4 px-3 py-2 rounded bg-red-50 text-red-700 text-sm">{error}</div>
      )}

      <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2 mb-6">
        <button
          type="button"
          onClick={() => setActiveCat('all')}
          aria-pressed={activeCat === 'all'}
          className={`px-3 py-1.5 rounded-md text-sm border ${activeCat === 'all' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'}`}
        >
          All ({dishes.length})
        </button>
        {categories.map(c => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActiveCat(c.id)}
            aria-pressed={activeCat === c.id}
            className={`px-3 py-1.5 rounded-md text-sm border ${activeCat === c.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'}`}
          >
            {c.name} ({c.dishCount})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visible.map(dish => (
          <DishCard
            key={dish.id}
            dish={dish}
            onOpen={setSelectedDish}
            isFavorite={favoriteIds.has(dish.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>

      {visible.length === 0 && (
        <p className="text-slate-500 mt-8">No dishes in this category yet.</p>
      )}

      <DishDetailModal dish={selectedDish} onClose={() => setSelectedDish(null)} />
    </main>
  );
}

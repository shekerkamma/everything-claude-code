import { useEffect, useState } from 'react';
import { apiFetch } from '../api.js';
import DishCard from '../components/DishCard.jsx';
import DishDetailModal from '../components/DishDetailModal.jsx';

export default function Favorites() {
  const [favs, setFavs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  function load() {
    setLoading(true);
    apiFetch('/favorites')
      .then(setFavs)
      .catch(() => setFavs([]))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function toggleFavorite(dish, shouldFavorite) {
    if (shouldFavorite) return; // can't re-favorite from this page
    await apiFetch(`/favorites/${dish.id}`, { method: 'DELETE' });
    setFavs(prev => prev.filter(f => f.dish.id !== dish.id));
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-semibold mb-4">Your favorites</h1>
      {loading && <p className="text-slate-500">Loading…</p>}
      {!loading && favs.length === 0 && (
        <p className="text-slate-600">No favorites yet. Tap the ♡ on a dish to save it.</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {favs.map(f => (
          <DishCard
            key={f.id}
            dish={f.dish}
            onOpen={setSelected}
            isFavorite={true}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>
      <DishDetailModal dish={selected} onClose={() => setSelected(null)} />
    </main>
  );
}

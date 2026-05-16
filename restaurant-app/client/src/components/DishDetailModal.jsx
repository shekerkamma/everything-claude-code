import { useEffect, useRef } from 'react';

const PLACEHOLDER = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23e2e8f0"/></svg>';

function dollars(cents) { return `$${(cents / 100).toFixed(2)}`; }

export default function DishDetailModal({ dish, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!dish) return;
    function onKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
    }
    document.addEventListener('keydown', onKey);
    closeRef.current && closeRef.current.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [dish, onClose]);

  if (!dish) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dish-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-lg w-full rounded-xl overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="aspect-[4/3] bg-slate-100">
          <img
            src={dish.imageUrl}
            alt={dish.name}
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
          />
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <h2 id="dish-modal-title" className="text-xl font-semibold">{dish.name}</h2>
            <span className="text-lg font-medium text-slate-700">{dollars(dish.priceCents)}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 text-xs my-3">
            {dish.isVegetarian && <span className="px-2 py-0.5 rounded bg-green-100 text-green-800">🌱 Vegetarian</span>}
            {dish.isSpicy && <span className="px-2 py-0.5 rounded bg-red-100 text-red-800">🌶️ Spicy</span>}
            {dish.isPopular && <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800">⭐ Popular</span>}
          </div>
          <p className="text-slate-600">{dish.description}</p>
          <div className="mt-5 flex justify-end">
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

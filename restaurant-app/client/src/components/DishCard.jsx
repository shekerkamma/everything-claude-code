import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

const PLACEHOLDER = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23e2e8f0"/><text x="200" y="150" font-family="sans-serif" font-size="20" fill="%2364748b" text-anchor="middle" dy=".3em">No image</text></svg>';

function dollars(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function DishCard({ dish, onOpen, isFavorite, onToggleFavorite }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  function handleHeart(e) {
    e.stopPropagation();
    if (!user) {
      navigate('/login', { state: { message: 'Log in to save favorites' } });
      return;
    }
    onToggleFavorite(dish, !isFavorite);
  }

  return (
    <article
      className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer flex flex-col"
      onClick={() => onOpen && onOpen(dish)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen && onOpen(dish); } }}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${dish.name}`}
    >
      <div className="relative aspect-[4/3] bg-slate-100">
        <img
          src={dish.imageUrl}
          alt={dish.name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
        />
        <button
          type="button"
          onClick={handleHeart}
          className={`absolute top-2 right-2 w-9 h-9 rounded-full flex items-center justify-center text-lg shadow ${isFavorite ? 'bg-red-500 text-white' : 'bg-white text-slate-400 hover:text-red-500'}`}
          aria-label={isFavorite ? `Remove ${dish.name} from favorites` : `Add ${dish.name} to favorites`}
          aria-pressed={!!isFavorite}
        >
          {isFavorite ? '♥' : '♡'}
        </button>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-slate-900">{dish.name}</h3>
          <span className="font-medium text-slate-700">{dollars(dish.priceCents)}</span>
        </div>
        <p className="text-sm text-slate-600 line-clamp-2 mb-3 flex-1">{dish.description}</p>
        <div className="flex flex-wrap gap-1.5 text-xs">
          {dish.isVegetarian && <span className="px-2 py-0.5 rounded bg-green-100 text-green-800">🌱 Veg</span>}
          {dish.isSpicy && <span className="px-2 py-0.5 rounded bg-red-100 text-red-800">🌶️ Spicy</span>}
          {dish.isPopular && <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800">⭐ Popular</span>}
        </div>
      </div>
    </article>
  );
}

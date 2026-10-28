import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Ticket } from 'lucide-react';

const MovieCard = ({ movie }) => {
  // Format duration in hours & minutes
  const formatDuration = (mins) => {
    if (!mins) return '';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m > 0 ? `${m}m` : ''}`;
  };

  const isComingSoon = movie.status === 'COMING_SOON';

  return (
    <div className="group relative bg-[#121824] rounded-2xl overflow-hidden border border-slate-800/80 hover:border-rose-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-rose-950/30 flex flex-col h-full">
      {/* Poster Thumbnail */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-900">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121824] via-transparent to-black/40" />

        {/* Rating Badge */}
        <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg border border-amber-500/30 flex items-center gap-1.5 shadow-lg">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-xs font-bold text-amber-200">
            {movie.rating ? movie.rating.toFixed(1) : '8.0'}
          </span>
        </div>

        {/* Certification Badge */}
        <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-semibold text-slate-300 border border-slate-700">
          {movie.certification || 'UA'}
        </div>

        {/* Status Tag if Coming Soon */}
        {isComingSoon && (
          <div className="absolute bottom-3 left-3 right-3 bg-amber-500/90 text-slate-950 text-center py-1 rounded-lg text-xs font-black uppercase tracking-wider shadow-lg">
            Coming Soon
          </div>
        )}
      </div>

      {/* Movie Details */}
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          {/* Genre Badges */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {movie.genre?.slice(0, 2).map((g) => (
              <span
                key={g}
                className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800/90 text-slate-300 border border-slate-700/60"
              >
                {g}
              </span>
            ))}
            {movie.language?.length > 0 && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-rose-950/40 text-rose-300 border border-rose-900/50">
                {movie.language[0]}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-bold text-base text-slate-100 group-hover:text-rose-400 transition-colors line-clamp-1 mb-1">
            {movie.title}
          </h3>

          {/* Duration & Info */}
          <div className="flex items-center text-xs text-slate-400 gap-2 mb-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              {formatDuration(movie.duration)}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={`/movies/${movie._id}`}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 shadow-md ${
            isComingSoon
              ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-900/40 hover:shadow-rose-900/60'
          }`}
        >
          <Ticket className="w-4 h-4" />
          {isComingSoon ? 'View Details' : 'Book Tickets'}
        </Link>
      </div>
    </div>
  );
};

export default MovieCard;

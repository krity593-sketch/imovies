import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  Star,
  Clock,
  Ticket,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Calendar,
  Film
} from 'lucide-react';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { movieService } from '../services/api';

const HomePage = () => {
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [nowShowing, setNowShowing] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedGenre, setSelectedGenre] = useState('All');

  const genres = ['All', 'Action', 'Sci-Fi', 'Adventure', 'Drama', 'Animation', 'Biography'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [featRes, nowRes, soonRes] = await Promise.all([
          movieService.getFeatured(),
          movieService.getAll({ status: 'NOW_SHOWING' }),
          movieService.getAll({ status: 'COMING_SOON' })
        ]);

        setFeaturedMovies(featRes.data.movies || []);
        setNowShowing(nowRes.data.movies || []);
        setComingSoon(soonRes.data.movies || []);
      } catch (err) {
        console.error('Failed to load movies for home:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Auto-advance hero carousel
  useEffect(() => {
    if (featuredMovies.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % featuredMovies.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [featuredMovies]);

  const filteredNowShowing =
    selectedGenre === 'All'
      ? nowShowing
      : nowShowing.filter((m) =>
          m.genre?.some((g) => g.toLowerCase() === selectedGenre.toLowerCase())
        );

  if (loading) {
    return <LoadingSpinner message="Rolling the red carpet..." />;
  }

  const currentHero = featuredMovies[activeSlide] || nowShowing[0];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Showcase Carousel */}
      {currentHero && (
        <div className="relative min-h-[520px] lg:h-[620px] w-full overflow-hidden bg-slate-950 flex items-end">
          {/* Background Landscape Banner */}
          <div className="absolute inset-0 z-0">
            <img
              src={currentHero.bannerUrl || currentHero.posterUrl}
              alt={currentHero.title}
              className="w-full h-full object-cover object-top opacity-35 filter brightness-75 scale-105 transition-all duration-1000"
            />
            {/* Dark Gradients for Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D14] via-[#0A0D14]/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0D14] via-[#0A0D14]/80 to-transparent" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full flex flex-col md:flex-row items-end md:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-600/20 border border-rose-500/40 text-rose-300 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" /> Spotlight Premiere
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                {currentHero.title}
              </h1>

              {/* Meta stats */}
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center gap-1 bg-black/60 px-2.5 py-1 rounded-lg border border-amber-500/40">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-amber-300">{currentHero.rating?.toFixed(1)}</span>
                  <span className="text-[11px] text-slate-400">({currentHero.votesCount?.toLocaleString()} votes)</span>
                </div>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-slate-400" />
                  {currentHero.duration} min
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold">
                  {currentHero.certification || 'UA'}
                </span>
                <span className="text-rose-400 font-semibold">
                  {currentHero.genre?.join(', ')}
                </span>
              </div>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-3">
                {currentHero.description}
              </p>

              {/* Call to Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to={`/movies/${currentHero._id}`}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-3.5 rounded-xl text-sm flex items-center gap-2 shadow-xl shadow-rose-950/60 hover:scale-105 transition-all"
                >
                  <Ticket className="w-4 h-4" />
                  Book Tickets Now
                </Link>

                {currentHero.trailerUrl && (
                  <a
                    href={currentHero.trailerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold px-5 py-3.5 rounded-xl text-sm flex items-center gap-2 transition-colors"
                  >
                    <Play className="w-4 h-4 text-rose-500 fill-rose-500" />
                    Watch Trailer
                  </a>
                )}
              </div>
            </div>

            {/* Slide Indicators */}
            {featuredMovies.length > 1 && (
              <div className="flex md:flex-col gap-2">
                {featuredMovies.map((m, idx) => (
                  <button
                    key={m._id}
                    onClick={() => setActiveSlide(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      activeSlide === idx
                        ? 'w-8 bg-rose-500'
                        : 'w-2.5 bg-slate-700 hover:bg-slate-500'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Now Showing Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-rose-500 font-bold text-xs uppercase tracking-wider mb-1">
              <Film className="w-4 h-4" /> In Theaters Now
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Now Showing
            </h2>
          </div>

          {/* Genre Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedGenre === genre
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/40'
                    : 'bg-[#121824] text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {filteredNowShowing.length === 0 ? (
          <div className="bg-[#121824] p-12 text-center rounded-2xl border border-slate-800">
            <Film className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No movies found in "{selectedGenre}" genre.</p>
            <button
              onClick={() => setSelectedGenre('All')}
              className="mt-3 text-xs text-rose-500 font-bold hover:underline"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {filteredNowShowing.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}
      </section>

      {/* Coming Soon Section */}
      {comingSoon.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider mb-1">
                <Calendar className="w-4 h-4" /> Upcoming Blockbusters
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Coming Soon
              </h2>
            </div>
            <Link
              to="/movies?status=COMING_SOON"
              className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 group"
            >
              Explore All Upcoming
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {comingSoon.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </section>
      )}

      {/* Experience IMovies VIP Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-rose-950/60 via-slate-900 to-amber-950/40 border border-rose-500/30 p-8 sm:p-12">
          <div className="max-w-xl space-y-4">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Premium Seating Experience
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Luxury Recliners & 4K Dolby Atmos Screens
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Experience movies the way they were meant to be seen. Choose between Ultra VIP recliners with in-seat dining or high-fidelity Dolby Atmos auditoriums.
            </p>
            <div className="pt-2">
              <Link
                to="/movies"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-950/40 hover:scale-105 transition-all"
              >
                Browse All Movies <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, Film, X } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { movieService } from '../services/api';

const MoviesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [genre, setGenre] = useState(searchParams.get('genre') || 'All');
  const [language, setLanguage] = useState(searchParams.get('language') || 'All');
  const [status, setStatus] = useState(searchParams.get('status') || 'All');
  const [sort, setSort] = useState('rating');

  const genresList = ['All', 'Action', 'Sci-Fi', 'Adventure', 'Drama', 'Animation', 'Biography', 'Crime', 'Comedy', 'Horror'];
  const languagesList = ['All', 'English', 'Hindi', 'Spanish', 'Japanese', 'Korean'];

  useEffect(() => {
    // Sync URL params to state
    if (searchParams.get('search')) setSearch(searchParams.get('search'));
    if (searchParams.get('genre')) setGenre(searchParams.get('genre'));
    if (searchParams.get('status')) setStatus(searchParams.get('status'));
  }, [searchParams]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (genre !== 'All') params.genre = genre;
      if (language !== 'All') params.language = language;
      if (status !== 'All') params.status = status;
      if (sort) params.sort = sort;

      const res = await movieService.getAll(params);
      setMovies(res.data.movies || []);
    } catch (err) {
      console.error('Failed to fetch movies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [genre, language, status, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMovies();
  };

  const clearAllFilters = () => {
    setSearch('');
    setGenre('All');
    setLanguage('All');
    setStatus('All');
    setSort('rating');
    setSearchParams({});
  };

  const hasActiveFilters = search || genre !== 'All' || language !== 'All' || status !== 'All';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">All Movies</h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse through current theatrical releases and upcoming blockbusters
          </p>
        </div>

        {/* Status Toggle Tabs */}
        <div className="flex bg-[#121824] p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          {['All', 'NOW_SHOWING', 'COMING_SOON'].map((st) => (
            <button
              key={st}
              onClick={() => setStatus(st)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                status === st
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st === 'All' ? 'All Titles' : st === 'NOW_SHOWING' ? 'Now Showing' : 'Coming Soon'}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#121824] p-4 sm:p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title, director, or actor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0A0D14] border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500/80"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  fetchMovies();
                }}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Genre Dropdown */}
          <div className="relative">
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full bg-[#0A0D14] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500/80 cursor-pointer"
            >
              <option value="All">All Genres</option>
              {genresList.filter((g) => g !== 'All').map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Language Dropdown */}
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-[#0A0D14] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500/80 cursor-pointer"
            >
              <option value="All">All Languages</option>
              {languagesList.filter((l) => l !== 'All').map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sorting & Filter Reset */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <span className="text-slate-400 font-medium">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-[#0A0D14] border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 text-xs focus:outline-none"
            >
              <option value="rating">Highest Rated</option>
              <option value="newest">Release Date (Newest)</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Movies Grid */}
      {loading ? (
        <LoadingSpinner message="Scanning movies catalog..." />
      ) : movies.length === 0 ? (
        <div className="bg-[#121824] rounded-2xl border border-slate-800 p-16 text-center">
          <Film className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-1">No Movies Match Your Criteria</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Try tweaking your search term, genre, or selected language to discover available shows.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div>
          <div className="text-xs text-slate-400 mb-4 font-medium">
            Showing <span className="font-bold text-white">{movies.length}</span> titles
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoviesPage;

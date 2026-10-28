import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Clock,
  Calendar,
  Play,
  Film,
  MapPin,
  ChevronRight,
  Sparkles,
  X,
  Share2
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { movieService, showService } from '../services/api';
import { useToast } from '../components/Toast';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.toISOString().split('T')[0];
  });
  const [selectedCity, setSelectedCity] = useState(
    localStorage.getItem('imovies_city') || 'All'
  );
  const [showTrailerModal, setShowTrailerModal] = useState(false);

  // Generate 5 days array
  const dateOptions = Array.from({ length: 5 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    d.setHours(0, 0, 0, 0);
    return {
      iso: d.toISOString().split('T')[0],
      dayName: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' })
    };
  });

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        const res = await movieService.getById(id);
        setMovie(res.data.movie);

        // Fetch shows for the selected movie & date
        const showsRes = await showService.getAll({
          movieId: id,
          date: selectedDate
        });
        setShows(showsRes.data.shows || []);
      } catch (err) {
        console.error('Failed to load movie details:', err);
        toast.error('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };
    fetchMovieData();
  }, [id, selectedDate]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: movie?.title,
        text: `Check out ${movie?.title} on IMovies!`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Preparing cinema stage..." />;
  }

  if (!movie) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 text-center bg-[#121824] rounded-2xl border border-slate-800">
        <Film className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-white mb-2">Movie Not Found</h2>
        <p className="text-xs text-slate-400 mb-4">
          The requested movie could not be found or has been unlisted.
        </p>
        <Link
          to="/movies"
          className="inline-block px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold"
        >
          Return to Movies
        </Link>
      </div>
    );
  }

  // Filter shows by city if selected
  const filteredShows =
    selectedCity === 'All'
      ? shows
      : shows.filter(
          (s) => s.theater?.city?.toLowerCase() === selectedCity.toLowerCase()
        );

  // Group shows by Theater
  const showsByTheater = filteredShows.reduce((acc, show) => {
    const theaterId = show.theater?._id;
    if (!theaterId) return acc;
    if (!acc[theaterId]) {
      acc[theaterId] = {
        theater: show.theater,
        shows: []
      };
    }
    acc[theaterId].shows.push(show);
    return acc;
  }, {});

  // Extract YouTube embed URL helper
  const getEmbedUrl = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}?autoplay=1`
      : url;
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Banner Section */}
      <div className="relative min-h-[460px] w-full bg-slate-950 overflow-hidden flex items-end">
        <div className="absolute inset-0 z-0">
          <img
            src={movie.bannerUrl || movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover object-top opacity-30 filter blur-xs brightness-75 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D14] via-[#0A0D14]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex flex-col md:flex-row gap-8 items-start md:items-end">
          {/* Poster */}
          <div className="w-48 sm:w-60 aspect-[2/3] rounded-2xl overflow-hidden border-2 border-slate-700/80 shadow-2xl shadow-black shrink-0 bg-slate-900">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="space-y-4 flex-grow">
            <div className="flex flex-wrap gap-2">
              {movie.genre?.map((g) => (
                <span
                  key={g}
                  className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-600/20 text-rose-300 border border-rose-500/30"
                >
                  {g}
                </span>
              ))}
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700">
                {movie.certification || 'UA'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
              {movie.title}
            </h1>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-1.5 bg-black/60 px-3 py-1 rounded-xl border border-amber-500/40">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-extrabold text-amber-300">
                  {movie.rating ? movie.rating.toFixed(1) : '8.0'}
                </span>
                <span className="text-[11px] text-slate-400">
                  / 10 ({movie.votesCount?.toLocaleString()} ratings)
                </span>
              </div>
              <span className="flex items-center gap-1 text-slate-300">
                <Clock className="w-4 h-4 text-slate-400" />
                {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
              </span>
              <span className="text-slate-300 font-medium">
                {movie.language?.join(', ')}
              </span>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {movie.trailerUrl && (
                <button
                  onClick={() => setShowTrailerModal(true)}
                  className="bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors"
                >
                  <Play className="w-4 h-4 text-rose-500 fill-rose-500" />
                  Watch Official Trailer
                </button>
              )}
              <button
                onClick={handleShare}
                className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Share Movie"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Showtimes & Theaters (2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Date Selector Strip */}
          <div className="bg-[#121824] p-4 rounded-2xl border border-slate-800">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-rose-500" /> Select Showtime Date
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
              {dateOptions.map((opt) => (
                <button
                  key={opt.iso}
                  onClick={() => setSelectedDate(opt.iso)}
                  className={`flex flex-col items-center justify-center min-w-[76px] py-3 px-2 rounded-xl text-center transition-all ${
                    selectedDate === opt.iso
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/60 font-bold scale-105'
                      : 'bg-[#0A0D14] text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <span className="text-[11px] uppercase tracking-wider font-semibold">
                    {opt.dayName}
                  </span>
                  <span className="text-lg font-black">{opt.dayNumber}</span>
                  <span className="text-[10px] text-slate-300 font-medium">{opt.month}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Theater Shows List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-white">Theaters & Timings</h2>
              <span className="text-xs text-slate-400">
                {Object.keys(showsByTheater).length} theaters found
              </span>
            </div>

            {Object.keys(showsByTheater).length === 0 ? (
              <div className="bg-[#121824] rounded-2xl border border-slate-800 p-12 text-center">
                <Film className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                <h4 className="text-base font-bold text-white mb-1">
                  No Shows Scheduled for this Date
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  There are currently no active screenings for the chosen date. Try selecting another date above.
                </p>
              </div>
            ) : (
              Object.values(showsByTheater).map(({ theater, shows: theaterShows }) => (
                <div
                  key={theater._id}
                  className="bg-[#121824] rounded-2xl border border-slate-800/90 p-5 space-y-4 hover:border-slate-700 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                    <div>
                      <h4 className="font-bold text-base text-slate-100 flex items-center gap-2">
                        {theater.name}
                      </h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        {theater.address}, {theater.city}
                      </p>
                    </div>

                    {/* Facilities badges */}
                    <div className="flex flex-wrap gap-1">
                      {theater.facilities?.slice(0, 3).map((f) => (
                        <span
                          key={f}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Show Times Grid */}
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                      Available Showtimes
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {theaterShows.map((s) => (
                        <Link
                          key={s._id}
                          to={`/book/${s._id}`}
                          className="group relative flex flex-col items-center justify-center bg-[#0A0D14] hover:bg-rose-600/10 border border-slate-700/80 hover:border-rose-500 px-4 py-2.5 rounded-xl transition-all shadow-sm"
                        >
                          <span className="text-xs font-bold text-slate-200 group-hover:text-rose-400">
                            {s.showTime}
                          </span>
                          <span className="text-[10px] text-slate-500 group-hover:text-slate-400 mt-0.5">
                            Screen {s.screenNumber} • From ${s.pricing?.regular || 12}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Synopsis & Cast (1 col) */}
        <div className="space-y-6">
          {/* Synopsis */}
          <div className="bg-[#121824] rounded-2xl border border-slate-800 p-6 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              About the Movie
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {movie.description}
            </p>
          </div>

          {/* Director & Cast */}
          <div className="bg-[#121824] rounded-2xl border border-slate-800 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Cast & Crew
            </h3>

            {movie.director && (
              <div>
                <p className="text-xs text-slate-400">Director</p>
                <p className="text-xs sm:text-sm font-bold text-slate-200 mt-0.5">
                  {movie.director}
                </p>
              </div>
            )}

            {movie.cast?.length > 0 && (
              <div>
                <p className="text-xs text-slate-400 mb-2">Key Cast</p>
                <div className="flex flex-wrap gap-1.5">
                  {movie.cast.map((actor) => (
                    <span
                      key={actor}
                      className="text-xs bg-slate-900 border border-slate-800 text-slate-200 px-2.5 py-1 rounded-lg"
                    >
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-4xl bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h4 className="font-bold text-white text-sm">{movie.title} – Official Trailer</h4>
              <button
                onClick={() => setShowTrailerModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe
                src={getEmbedUrl(movie.trailerUrl)}
                title={`${movie.title} trailer`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetailsPage;

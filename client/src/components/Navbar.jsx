import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Film,
  Search,
  MapPin,
  User as UserIcon,
  LogOut,
  ShieldAlert,
  Menu,
  X,
  Ticket
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { theaterService } from '../services/api';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(
    localStorage.getItem('imovies_city') || 'Mumbai'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await theaterService.getCities();
        if (res.data.cities && res.data.cities.length > 0) {
          setCities(res.data.cities);
          if (!localStorage.getItem('imovies_city')) {
            setSelectedCity(res.data.cities[0]);
            localStorage.setItem('imovies_city', res.data.cities[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load cities:', err);
      }
    };
    fetchCities();
  }, []);

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    localStorage.setItem('imovies_city', city);
    window.dispatchEvent(new Event('imovies_city_changed'));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-40 bg-[#0A0D14]/90 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & City */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-700 via-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-950/50 group-hover:scale-105 transition-transform">
                <Film className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white font-sans">
                  I<span className="text-rose-500">MOVIES</span>
                </span>
                <span className="hidden sm:block text-[10px] text-slate-400 font-semibold tracking-widest uppercase -mt-1">
                  Simple Booking
                </span>
              </div>
            </Link>

            {/* City Selector */}
            <div className="hidden md:flex items-center gap-2 bg-[#121824] px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <select
                value={selectedCity}
                onChange={handleCityChange}
                className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer pr-2"
              >
                {cities.map((city) => (
                  <option key={city} value={city} className="bg-slate-900 text-slate-200">
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden lg:flex items-center flex-1 max-w-md relative"
          >
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search movies, genres, actors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121824] border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500/80 transition-colors"
            />
          </form>

          {/* Right Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/movies"
              className={`text-sm font-semibold transition-colors ${
                location.pathname === '/movies'
                  ? 'text-rose-500'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Movies
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/my-bookings"
                  className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                    location.pathname === '/my-bookings'
                      ? 'text-rose-500'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Ticket className="w-4 h-4 text-rose-500" />
                  My Bookings
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-bold transition-all"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Admin Panel
                  </Link>
                )}

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-full hover:ring-2 hover:ring-rose-500/40 transition-all"
                  >
                    <img
                      src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-700"
                    />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-[#121824] rounded-xl shadow-2xl border border-slate-800 py-2 z-50 animate-scale-in">
                      <div className="px-4 py-2 border-b border-slate-800/80">
                        <p className="text-xs font-bold text-slate-100 truncate">{user?.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                      </div>

                      <Link
                        to="/my-bookings"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
                      >
                        <Ticket className="w-4 h-4 text-rose-400" />
                        My Tickets & History
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-amber-400 hover:bg-slate-800"
                        >
                          <ShieldAlert className="w-4 h-4 text-amber-400" />
                          Admin Console
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 text-left transition-colors border-t border-slate-800/60 mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-xs font-bold text-slate-300 hover:text-white px-3 py-2 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md shadow-rose-950 transition-all hover:scale-105"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800 flex flex-col gap-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#121824] border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 focus:outline-none"
              />
            </form>

            <div className="flex items-center justify-between py-2 border-b border-slate-800">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500" /> City
              </span>
              <select
                value={selectedCity}
                onChange={handleCityChange}
                className="bg-[#121824] text-xs text-slate-200 border border-slate-700 rounded px-2 py-1"
              >
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <Link
              to="/movies"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-semibold text-slate-200 py-1"
            >
              All Movies
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/my-bookings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-semibold text-slate-200 py-1 flex items-center gap-2"
                >
                  <Ticket className="w-4 h-4 text-rose-500" />
                  My Bookings
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-sm font-bold text-amber-400 py-1 flex items-center gap-2"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-sm font-semibold text-rose-400 py-1 text-left flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out ({user?.name})
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 py-2 text-center text-xs font-bold rounded-lg border border-slate-700 text-slate-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 py-2 text-center text-xs font-bold rounded-lg bg-rose-600 text-white"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

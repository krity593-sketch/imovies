import React from 'react';
import { Film, Heart, Shield, Ticket, CreditCard, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#070A0F] border-t border-slate-800/80 text-slate-400 text-xs mt-20">
      {/* Features Banner */}
      <div className="border-b border-slate-800/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-200 text-sm">Instant E-Tickets</p>
              <p className="text-[11px] text-slate-500">Scan digital QR code directly at cinema gates</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-200 text-sm">VIP & Recliner Choice</p>
              <p className="text-[11px] text-slate-500">Live visual seat maps with custom tier pricing</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-200 text-sm">Safe & Secure Booking</p>
              <p className="text-[11px] text-slate-500">End-to-end encrypted checkout and instant refunds</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-500 shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-200 text-sm">Flexible Payments</p>
              <p className="text-[11px] text-slate-500">Credit cards, UPI, PayPal, and digital wallets</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white">
                <Film className="w-4 h-4" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                I<span className="text-rose-500">MOVIES</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              Movie ticket booking made simple. Discover the latest releases, browse theater schedules, book prime seats with zero hassle, and immerse yourself in the cinematic universe.
            </p>
            <div className="text-[11px] text-slate-500 font-mono">
              v1.0.0 • MERN Stack Architecture
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-slate-200 text-sm mb-3 uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/movies?status=NOW_SHOWING" className="hover:text-rose-400 transition-colors">
                  Now Showing
                </Link>
              </li>
              <li>
                <Link to="/movies?status=COMING_SOON" className="hover:text-rose-400 transition-colors">
                  Upcoming Premieres
                </Link>
              </li>
              <li>
                <Link to="/movies" className="hover:text-rose-400 transition-colors">
                  Full Movie Catalog
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="hover:text-rose-400 transition-colors">
                  My Tickets
                </Link>
              </li>
            </ul>
          </div>

          {/* Genres */}
          <div>
            <h4 className="font-bold text-slate-200 text-sm mb-3 uppercase tracking-wider">Top Genres</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/movies?genre=Sci-Fi" className="hover:text-rose-400 transition-colors">
                  Sci-Fi & Fantasy
                </Link>
              </li>
              <li>
                <Link to="/movies?genre=Action" className="hover:text-rose-400 transition-colors">
                  Action & Thriller
                </Link>
              </li>
              <li>
                <Link to="/movies?genre=Drama" className="hover:text-rose-400 transition-colors">
                  Drama & Biography
                </Link>
              </li>
              <li>
                <Link to="/movies?genre=Animation" className="hover:text-rose-400 transition-colors">
                  Animation & Kids
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-slate-200 text-sm mb-3 uppercase tracking-wider">Support</h4>
            <p className="text-xs text-slate-400 mb-2">
              Need assistance with your booking or cancellation?
            </p>
            <p className="text-xs font-semibold text-rose-400 mb-1">
              support@imovies.com
            </p>
            <p className="text-xs text-slate-500">
              Toll Free: +1 (800) 555-FILM
            </p>
            <div className="mt-4 p-3 bg-slate-900 rounded-lg border border-slate-800 text-[11px] text-slate-400">
              Mock checkout enabled for instant testing without real payments.
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} IMovies Entertainment Inc. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for cinema lovers worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Info,
  ChevronRight,
  ShieldCheck,
  Timer,
  Armchair,
  AlertTriangle
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { showService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const SeatBookingPage = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [timeLeft, setTimeLeft] = useState(300); // 5-minute seat selection timer

  useEffect(() => {
    const fetchShowData = async () => {
      try {
        setLoading(true);
        const res = await showService.getById(showId);
        setShow(res.data.show);
      } catch (err) {
        console.error('Failed to load show seat map:', err);
        toast.error('Failed to load show seats layout');
      } finally {
        setLoading(false);
      }
    };
    fetchShowData();
  }, [showId]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      toast.info('Seat selection session expired. Please refresh to reselect.');
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSeatClick = (seat) => {
    if (seat.isBooked) return;

    if (selectedSeats.includes(seat.seatNumber)) {
      setSelectedSeats(selectedSeats.filter((num) => num !== seat.seatNumber));
    } else {
      if (selectedSeats.length >= 8) {
        toast.info('Maximum 8 tickets allowed per booking');
        return;
      }
      setSelectedSeats([...selectedSeats, seat.seatNumber]);
    }
  };

  const handleProceedToCheckout = () => {
    if (selectedSeats.length === 0) {
      toast.error('Please pick at least one seat to continue');
      return;
    }

    if (!isAuthenticated) {
      toast.info('Please sign in or create an account to finalize your booking');
      navigate(`/login?redirect=/book/${showId}`);
      return;
    }

    // Navigate to checkout with show and selected seats payload
    navigate('/checkout', {
      state: {
        showId: show._id,
        selectedSeats
      }
    });
  };

  if (loading) {
    return <LoadingSpinner message="Configuring theater seat map..." />;
  }

  if (!show) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 text-center bg-[#121824] rounded-2xl border border-slate-800">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white mb-2">Show Not Found</h3>
        <p className="text-xs text-slate-400 mb-4">
          This show timing may have concluded or been updated.
        </p>
        <Link
          to="/movies"
          className="inline-block px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold"
        >
          Explore Movies
        </Link>
      </div>
    );
  }

  // Calculate pricing for selected seats
  const selectedSeatObjects = show.seats.filter((s) =>
    selectedSeats.includes(s.seatNumber)
  );
  const subtotal = selectedSeatObjects.reduce((acc, curr) => acc + curr.price, 0);

  // Group seats by row
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-32">
      {/* Top Header Card */}
      <div className="bg-[#121824] p-5 sm:p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-wider mb-1">
            <span>Screen {show.screenNumber}</span> •{' '}
            <span>{show.movie?.certification || 'UA'}</span>
          </div>
          <h1 className="text-2xl font-black text-white">{show.movie?.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              {show.theater?.name}, {show.theater?.city}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {new Date(show.showDate).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              })}
            </span>
            <span className="flex items-center gap-1 font-bold text-rose-400">
              <Clock className="w-3.5 h-3.5" />
              {show.showTime}
            </span>
          </div>
        </div>

        {/* Timer countdown pill */}
        <div className="flex items-center gap-2 bg-[#0A0D14] px-4 py-2.5 rounded-xl border border-slate-800 self-start md:self-auto">
          <Timer className="w-4 h-4 text-amber-400 animate-pulse" />
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">
              Time Remaining
            </span>
            <span className="text-sm font-mono font-extrabold text-amber-300">
              {formatTimer(timeLeft)}
            </span>
          </div>
        </div>
      </div>

      {/* Screen Curved Header */}
      <div className="text-center pt-4">
        <div className="cinema-screen-curve" />
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest -mt-4">
          All eyes this way • Screen
        </p>
      </div>

      {/* Seat Map Visualizer */}
      <div className="bg-[#121824] p-6 sm:p-10 rounded-3xl border border-slate-800/80 shadow-2xl overflow-x-auto">
        <div className="min-w-[560px] max-w-2xl mx-auto space-y-3">
          {rows.map((rowLetter) => {
            const rowSeats = show.seats.filter((s) => s.row === rowLetter);
            const rowType = rowSeats[0]?.type || 'regular';
            const rowPrice = rowSeats[0]?.price || 12;

            return (
              <div key={rowLetter} className="flex items-center justify-between gap-4">
                {/* Row Label Left */}
                <span className="w-6 text-xs font-mono font-bold text-slate-400 text-center">
                  {rowLetter}
                </span>

                {/* Seat Buttons Row */}
                <div className="flex items-center justify-center gap-2 sm:gap-3 flex-1">
                  {rowSeats.map((seat, idx) => {
                    const isSelected = selectedSeats.includes(seat.seatNumber);
                    const isBooked = seat.isBooked;

                    return (
                      <React.Fragment key={seat.seatNumber}>
                        {/* Center Aisle Gap after 4th seat */}
                        {idx === 4 && <div className="w-6 sm:w-10" />}

                        <button
                          type="button"
                          disabled={isBooked}
                          onClick={() => handleSeatClick(seat)}
                          title={`${seat.seatNumber} (${seat.type.toUpperCase()}) - ₹${seat.price}`}
                          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-xs font-bold flex items-center justify-center transition-all duration-200 select-none ${
                            isBooked
                              ? 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed line-through'
                              : isSelected
                              ? 'bg-emerald-500 border-2 border-emerald-400 text-slate-950 font-black shadow-lg shadow-emerald-500/40 scale-110'
                              : seat.type === 'vip'
                              ? 'bg-[#0A0D14] border border-amber-500/50 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400'
                              : seat.type === 'premium'
                              ? 'bg-[#0A0D14] border border-sky-500/50 text-sky-300 hover:bg-sky-500/20 hover:border-sky-400'
                              : 'bg-[#0A0D14] border border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-500'
                          }`}
                        >
                          {seat.col}
                        </button>
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Row Price / Type Tag Right */}
                <div className="w-20 text-right">
                  <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase">
                    ₹{rowPrice}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#0A0D14] border border-slate-700" />
            <span>Regular (₹{show.pricing?.regular || 220})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#0A0D14] border border-sky-500" />
            <span className="text-sky-300">Premium (₹{show.pricing?.premium || 350})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#0A0D14] border border-amber-500" />
            <span className="text-amber-300">VIP Recliner (₹{show.pricing?.vip || 550})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-emerald-500 text-slate-950 font-bold" />
            <span className="text-emerald-400 font-bold">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-slate-900 border border-slate-800 text-slate-600 flex items-center justify-center text-[10px]">
              ✕
            </div>
            <span className="text-slate-500">Sold Out</span>
          </div>
        </div>
      </div>

      {/* Floating Bottom Sticky Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B0F19]/95 backdrop-blur-xl border-t border-slate-800 p-4 shadow-2xl">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Selected Seats:</span>
              {selectedSeats.length === 0 ? (
                <span className="text-xs text-slate-500 italic">None selected yet</span>
              ) : (
                <div className="flex flex-wrap gap-1.5 mt-0.5">
                  {selectedSeats.map((seatNum) => (
                    <span
                      key={seatNum}
                      className="px-2 py-0.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono font-bold text-xs"
                    >
                      {seatNum}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {selectedSeats.length > 0 && (
              <div className="sm:border-l sm:border-slate-800 sm:pl-4">
                <span className="text-xs text-slate-400 block font-medium">Subtotal:</span>
                <span className="text-lg font-black text-white">₹{subtotal.toFixed(2)}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleProceedToCheckout}
              disabled={selectedSeats.length === 0}
              className={`flex-1 sm:flex-none px-8 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xl ${
                selectedSeats.length === 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-950/50 hover:scale-105'
              }`}
            >
              Proceed to Checkout
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatBookingPage;

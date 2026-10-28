import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  Printer,
  XCircle,
  AlertCircle,
  Film,
  X,
  ShieldCheck
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import QRCodeView from '../components/QRCodeView';
import { bookingService } from '../services/api';
import { useToast } from '../components/Toast';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const toast = useToast();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingService.getMyBookings();
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error('Failed to load user bookings:', err);
      toast.error('Could not load booking history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? Your seats will be released immediately.')) {
      return;
    }

    try {
      setCancellingId(bookingId);
      const res = await bookingService.cancel(bookingId);
      toast.success(res.data.message || 'Booking cancelled and refund processed.');
      fetchBookings();
    } catch (err) {
      console.error('Cancel booking error:', err);
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  const filteredBookings =
    statusFilter === 'All'
      ? bookings
      : bookings.filter((b) => b.status === statusFilter);

  if (loading) {
    return <LoadingSpinner message="Retrieving your digital ticket vault..." />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-2.5">
            <Ticket className="w-7 h-7 text-rose-500" />
            My Bookings & Tickets
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Access your active cinema passes, past records, and manage cancellations.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-[#121824] p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          {['All', 'CONFIRMED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === st
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st === 'All' ? 'All Tickets' : st === 'CONFIRMED' ? 'Confirmed' : 'Cancelled'}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-[#121824] rounded-2xl border border-slate-800 p-16 text-center space-y-4">
          <Ticket className="w-16 h-16 text-slate-700 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Tickets Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {statusFilter === 'All'
              ? "You haven't booked any movie tickets yet. Explore current releases to experience cinema!"
              : `You have no ${statusFilter.toLowerCase()} bookings.`}
          </p>
          <Link
            to="/movies"
            className="inline-block px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all"
          >
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => {
            const isCancelled = b.status === 'CANCELLED';

            return (
              <div
                key={b._id}
                className="bg-[#121824] rounded-2xl border border-slate-800 p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-slate-700 transition-colors"
              >
                {/* Left: Poster + Info */}
                <div className="flex gap-4 sm:gap-6 items-start">
                  <img
                    src={b.movie?.posterUrl || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=300&q=80'}
                    alt={b.movie?.title}
                    className="w-20 sm:w-24 aspect-[2/3] object-cover rounded-xl border border-slate-800 shrink-0"
                  />

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                          isCancelled
                            ? 'bg-rose-950/60 text-rose-400 border border-rose-900'
                            : 'bg-emerald-950/60 text-emerald-400 border border-emerald-900'
                        }`}
                      >
                        {b.status}
                      </span>
                      <span className="text-xs font-mono text-slate-400 font-semibold">
                        {b.bookingId}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white line-clamp-1">{b.movie?.title}</h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        {b.theater?.name}, {b.theater?.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(b.show?.showDate || b.bookingDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      <span className="flex items-center gap-1 font-bold text-slate-200">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        {b.show?.showTime}
                      </span>
                    </div>

                    {/* Seats Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] text-slate-500 font-medium">Seats:</span>
                      {b.seats?.map((seat) => (
                        <span
                          key={seat}
                          className="px-2 py-0.5 rounded bg-[#0A0D14] border border-slate-700 text-slate-200 font-mono text-xs font-bold"
                        >
                          {seat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Price & Action Buttons */}
                <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Total Paid</span>
                    <span className="text-xl font-black text-emerald-400">
                      ₹{b.grandTotal?.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedTicket(b)}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Ticket className="w-3.5 h-3.5 text-rose-400" />
                      View Pass
                    </button>

                    {!isCancelled && (
                      <button
                        onClick={() => handleCancelBooking(b._id)}
                        disabled={cancellingId === b._id}
                        className="px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/50 text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        {cancellingId === b._id ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ticket Modal for Viewing & Printing */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-[#121824] rounded-3xl overflow-hidden border border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Ticket className="w-4 h-4 text-rose-500" /> Digital Ticket Pass
              </h4>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex gap-4 items-center">
                <img
                  src={selectedTicket.movie?.posterUrl}
                  alt={selectedTicket.movie?.title}
                  className="w-20 h-28 object-cover rounded-xl border border-slate-800 shrink-0"
                />
                <div>
                  <h3 className="font-black text-lg text-white">{selectedTicket.movie?.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{selectedTicket.theater?.name}</p>
                  <p className="text-xs text-rose-400 font-bold mt-1">
                    {new Date(selectedTicket.show?.showDate || selectedTicket.bookingDate).toLocaleDateString()} • {selectedTicket.show?.showTime}
                  </p>
                  <p className="text-xs text-slate-300 font-mono mt-1">
                    Seats: {selectedTicket.seats?.join(', ')}
                  </p>
                </div>
              </div>

              {/* QR Center */}
              <div className="text-center py-2 bg-[#0A0D14] p-4 rounded-2xl border border-slate-800">
                <QRCodeView value={selectedTicket.qrCodeData || selectedTicket.bookingId} size={140} />
                <p className="text-xs font-mono font-bold text-slate-300 mt-2">{selectedTicket.bookingId}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" /> Print Ticket
                </button>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold"
                >
                  Close Pass
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;

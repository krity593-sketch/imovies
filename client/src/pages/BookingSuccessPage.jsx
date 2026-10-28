import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Printer,
  Calendar,
  Clock,
  MapPin,
  Ticket,
  Film,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import QRCodeView from '../components/QRCodeView';
import { bookingService } from '../services/api';

const BookingSuccessPage = () => {
  const { id } = useParams();
  const location = useLocation();

  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!booking);

  useEffect(() => {
    if (!booking && id) {
      const fetchBooking = async () => {
        try {
          setLoading(true);
          const res = await bookingService.getById(id);
          setBooking(res.data.booking);
        } catch (err) {
          console.error('Failed to load booking details:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchBooking();
    }
  }, [id, booking]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <LoadingSpinner message="Generating your verified cinema pass..." />;
  }

  if (!booking) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 text-center bg-[#121824] rounded-2xl border border-slate-800">
        <h3 className="text-lg font-bold text-white mb-2">Booking Not Found</h3>
        <p className="text-xs text-slate-400 mb-4">Could not retrieve confirmation details.</p>
        <Link to="/my-bookings" className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold">
          View My Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Success Banner */}
      <div className="text-center space-y-3 no-print">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-950/50">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Booking Confirmed!</h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          Your e-tickets have been issued. Present this digital pass at the theater scanner for instant entry.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-2 border border-slate-700 transition-all shadow-md"
          >
            <Printer className="w-4 h-4 text-rose-400" />
            Print / Save Ticket
          </button>
          <Link
            to="/my-bookings"
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-rose-950/40"
          >
            <Ticket className="w-4 h-4" />
            View My Bookings
          </Link>
        </div>
      </div>

      {/* The Printable Boarding-Pass Style Ticket */}
      <div
        id="printable-ticket"
        className="bg-gradient-to-br from-[#151C2C] to-[#0E1320] rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden relative"
      >
        {/* Ticket Header Ribbon */}
        <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-amber-600 px-6 py-3.5 flex items-center justify-between text-white">
          <div className="flex items-center gap-2 font-black text-base tracking-wider uppercase">
            <Film className="w-5 h-5" /> IMOVIES OFFICIAL CINEMA PASS
          </div>
          <div className="text-xs font-mono font-bold bg-black/40 px-2.5 py-1 rounded-md">
            {booking.bookingId}
          </div>
        </div>

        {/* Ticket Body */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Left/Middle: Movie Details & Show Info (2 cols) */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex gap-5">
              <img
                src={booking.movie?.posterUrl}
                alt={booking.movie?.title}
                className="w-24 sm:w-28 aspect-[2/3] object-cover rounded-2xl border border-slate-700 shadow-lg shrink-0"
              />
              <div className="space-y-1.5 justify-center flex flex-col">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-600/30 text-rose-300 border border-rose-500/40 w-fit">
                  {booking.movie?.certification || 'UA'} • {booking.movie?.genre?.join(', ')}
                </span>
                <h2 className="text-2xl font-black text-white">{booking.movie?.title}</h2>
                <p className="text-xs text-slate-400">
                  {booking.theater?.name} • Screen {booking.show?.screenNumber || 1}
                </p>
                <p className="text-xs text-slate-500">{booking.theater?.address}, {booking.theater?.city}</p>
              </div>
            </div>

            {/* Grid of Key Info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#0A0D14]/80 p-4 rounded-2xl border border-slate-800 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Date</span>
                <span className="font-bold text-slate-200">
                  {new Date(booking.show?.showDate || booking.bookingDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Show Time</span>
                <span className="font-bold text-rose-400">{booking.show?.showTime}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Tickets</span>
                <span className="font-bold text-slate-200">{booking.ticketCount} Seat(s)</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Paid</span>
                <span className="font-bold text-emerald-400">₹{booking.grandTotal?.toFixed(2)}</span>
              </div>
            </div>

            {/* Seats Assigned */}
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-bold block mb-2">
                Confirmed Seat Numbers:
              </span>
              <div className="flex flex-wrap gap-2">
                {booking.seats?.map((seat) => (
                  <span
                    key={seat}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-mono font-black text-sm shadow-sm"
                  >
                    {seat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: QR Code verification box */}
          <div className="flex flex-col items-center justify-center p-6 bg-[#0A0D14]/90 rounded-2xl border border-slate-800 text-center space-y-3">
            <QRCodeView
              value={booking.qrCodeData || booking.bookingId}
              size={150}
            />
            <div className="space-y-0.5">
              <span className="text-xs font-mono font-bold text-slate-200 block">
                {booking.bookingId}
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Authenticated Entry
              </span>
            </div>
          </div>
        </div>

        {/* Perforated Divider Bar */}
        <div className="border-t-2 border-dashed border-slate-800 px-6 py-3 bg-[#0A0D14]/50 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>TXN ID: {booking.paymentDetails?.transactionId || 'MOCK-VERIFIED'}</span>
          <span>BOOKED ON: {new Date(booking.bookingDate).toLocaleString()}</span>
        </div>
      </div>

      {/* Explore More CTA */}
      <div className="text-center pt-4 no-print">
        <Link
          to="/movies"
          className="inline-flex items-center gap-2 text-xs font-bold text-rose-400 hover:text-rose-300"
        >
          Explore More Upcoming Movies <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default BookingSuccessPage;

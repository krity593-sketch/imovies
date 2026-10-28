import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  CreditCard,
  QrCode,
  Building2,
  Lock,
  ShieldCheck,
  Film,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { showService, bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const showId = location.state?.showId;
  const selectedSeats = location.state?.selectedSeats || [];

  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Payment Form States
  const [paymentMethod, setPaymentMethod] = useState('UPI / QR');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardName, setCardName] = useState(user?.name || 'Aarav Sharma');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('888');
  const [upiId, setUpiId] = useState('aarav@okaxis');
  const [selectedBank, setSelectedBank] = useState('State Bank of India (SBI)');

  useEffect(() => {
    if (!showId || selectedSeats.length === 0) {
      toast.error('No seats selected. Please choose your seats first.');
      navigate('/movies');
      return;
    }

    const fetchShow = async () => {
      try {
        setLoading(true);
        const res = await showService.getById(showId);
        setShow(res.data.show);
      } catch (err) {
        console.error('Failed to load show for checkout:', err);
        toast.error('Failed to prepare checkout');
        navigate('/movies');
      } finally {
        setLoading(false);
      }
    };

    fetchShow();
  }, [showId, selectedSeats]);

  if (loading) {
    return <LoadingSpinner message="Calculating order summary & taxes..." />;
  }

  if (!show) return null;

  // Calculate pricing breakdown
  const seatObjects = show.seats.filter((s) => selectedSeats.includes(s.seatNumber));
  const ticketSubtotal = seatObjects.reduce((acc, curr) => acc + curr.price, 0);
  const convenienceFee = Number((25.0 * selectedSeats.length).toFixed(2));
  const tax = Number(((ticketSubtotal + convenienceFee) * 0.18).toFixed(2)); // 18% GST
  const grandTotal = Number((ticketSubtotal + convenienceFee + tax).toFixed(2));

  const handlePay = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate real-world gateway network latency (1 second)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const payload = {
        showId: show._id,
        selectedSeats,
        paymentMethod,
        paymentDetails: {
          transactionId: `TXN-${Date.now()}`,
          cardLast4: paymentMethod === 'Credit Card' ? '4242' : 'UPI-OK'
        }
      };

      const res = await bookingService.create(payload);

      if (res.data.success) {
        toast.success('Payment authorized & booking confirmed!');
        navigate(`/booking-confirmed/${res.data.booking._id}`, {
          state: { booking: res.data.booking }
        });
      }
    } catch (err) {
      console.error('Booking payment failed:', err);
      const msg = err.response?.data?.message || 'Payment processing failed. Please try again.';
      toast.error(msg);

      // If seat conflict occurred, return to seat booking
      if (err.response?.status === 400 && msg.includes('booked by another')) {
        navigate(`/book/${show._id}`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const autofillDemoCard = () => {
    setCardNumber('4242 8899 7766 4242');
    setCardName(user?.name || 'John Doe');
    setExpiry('08/29');
    setCvv('789');
    toast.info('Test card details autofilled');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-black text-white">Review & Checkout</h1>
        <p className="text-xs text-slate-400 mt-1">
          Complete your mock transaction to secure your tickets instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Payment Details Form (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Methods Tabs */}
          <div className="bg-[#121824] p-6 rounded-2xl border border-slate-800 space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-rose-500" />
              Select Payment Method
            </h3>

            <div className="grid grid-cols-3 gap-3">
              {[
                { name: 'Credit Card', icon: CreditCard },
                { name: 'UPI / QR', icon: QrCode },
                { name: 'NetBanking', icon: Building2 }
              ].map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setPaymentMethod(name)}
                  className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-2 text-xs font-bold transition-all ${
                    paymentMethod === name
                      ? 'bg-rose-600/15 border-rose-500 text-rose-300 shadow-md'
                      : 'bg-[#0A0D14] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{name}</span>
                </button>
              ))}
            </div>

            {/* Credit Card Form */}
            {paymentMethod === 'Credit Card' && (
              <form onSubmit={handlePay} className="space-y-4 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Card Information</span>
                  <button
                    type="button"
                    onClick={autofillDemoCard}
                    className="text-xs text-rose-400 hover:text-rose-300 font-semibold underline"
                  >
                    Auto-Fill Test Card
                  </button>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 4242 4242 4242"
                    className="w-full bg-[#0A0D14] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-[#0A0D14] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-300 font-medium block mb-1">
                      Expiry (MM/YY)
                    </label>
                    <input
                      type="text"
                      required
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      placeholder="12/28"
                      className="w-full bg-[#0A0D14] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 font-medium block mb-1">
                      CVV / CVC
                    </label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="•••"
                      className="w-full bg-[#0A0D14] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-800 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-xl shadow-rose-950/60 transition-all"
                  >
                    {isProcessing ? (
                      <span>Authorizing Payment...</span>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        Pay ₹{grandTotal.toFixed(2)} Securely
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* UPI Mock View */}
            {paymentMethod === 'UPI / QR' && (
              <div className="space-y-4 pt-2 text-center">
                <div className="p-4 bg-[#0A0D14] rounded-xl border border-slate-800 inline-block mx-auto">
                  <div className="w-44 h-44 bg-white rounded-lg p-2 mx-auto flex items-center justify-center">
                    <QrCode className="w-36 h-36 text-slate-900" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 font-mono">Scan with Google Pay, PhonePe, Paytm or any UPI app</p>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Or enter VPA / UPI ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="user@upi"
                    className="w-full max-w-sm mx-auto bg-[#0A0D14] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-mono"
                  />
                </div>

                <button
                  type="button"
                  onClick={handlePay}
                  disabled={isProcessing}
                  className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-800 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-xl"
                >
                  {isProcessing ? 'Verifying UPI...' : `Confirm & Pay ₹${grandTotal.toFixed(2)}`}
                </button>
              </div>
            )}

            {/* NetBanking Mock View */}
            {paymentMethod === 'NetBanking' && (
              <div className="space-y-4 pt-2">
                <label className="text-xs text-slate-300 font-medium block">Select Your Indian Bank</label>
                <div className="grid grid-cols-2 gap-3">
                  {['State Bank of India (SBI)', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank', 'Punjab National Bank'].map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                        selectedBank === bank
                          ? 'bg-rose-600/10 border-rose-500 text-rose-300'
                          : 'bg-[#0A0D14] border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {bank}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handlePay}
                  disabled={isProcessing}
                  className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-800 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-xl"
                >
                  {isProcessing ? 'Connecting to Bank...' : `Proceed via ${selectedBank}`}
                </button>
              </div>
            )}

            {/* Secure Note */}
            <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>256-bit SSL simulated checkout. No real money will be charged.</span>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary (1 col) */}
        <div className="space-y-6">
          <div className="bg-[#121824] rounded-2xl border border-slate-800 p-6 space-y-6">
            <h3 className="text-base font-bold text-white border-b border-slate-800/80 pb-3">
              Order Summary
            </h3>

            {/* Movie Info */}
            <div className="flex gap-4">
              <img
                src={show.movie?.posterUrl}
                alt={show.movie?.title}
                className="w-16 h-24 object-cover rounded-xl border border-slate-800 shrink-0"
              />
              <div className="space-y-1">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                  {show.movie?.certification || 'UA'}
                </span>
                <h4 className="font-bold text-sm text-white line-clamp-1">{show.movie?.title}</h4>
                <p className="text-xs text-slate-400">{show.movie?.genre?.join(', ')}</p>
                <p className="text-xs text-rose-400 font-semibold">{show.movie?.duration} min</p>
              </div>
            </div>

            {/* Show Details */}
            <div className="bg-[#0A0D14] p-3.5 rounded-xl border border-slate-800/80 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span className="truncate">{show.theater?.name}, Screen {show.screenNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>
                  {new Date(show.showDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 font-bold text-white">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{show.showTime}</span>
              </div>
            </div>

            {/* Seats Chosen */}
            <div>
              <div className="text-xs text-slate-400 font-medium mb-2">Selected Seats ({selectedSeats.length})</div>
              <div className="flex flex-wrap gap-1.5">
                {seatObjects.map((s) => (
                  <span
                    key={s.seatNumber}
                    className="px-2.5 py-1 rounded-lg bg-[#0A0D14] border border-slate-800 text-slate-200 text-xs font-mono font-bold flex items-center gap-1.5"
                  >
                    <span>{s.seatNumber}</span>
                    <span className="text-[10px] text-amber-400">(₹{s.price})</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Billing breakdown */}
            <div className="space-y-2 pt-4 border-t border-slate-800/80 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Tickets Subtotal</span>
                <span className="font-medium text-slate-200">₹{ticketSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Convenience Fee (₹25.00 x {selectedSeats.length})</span>
                <span className="font-medium text-slate-200">₹{convenienceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Cinema GST (18%)</span>
                <span className="font-medium text-slate-200">₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-white pt-3 border-t border-slate-800">
                <span>Grand Total</span>
                <span className="text-rose-400">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

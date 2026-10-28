import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  Ticket,
  Film,
  Building2,
  Users,
  Search,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Clock,
  ShieldCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { adminService } from '../services/api';
import { useToast } from '../components/Toast';

const AdminPage = () => {
  const [stats, setStats] = useState(null);
  const [revenueByMovie, setRevenueByMovie] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'bookings'

  const toast = useToast();

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, bookingsRes] = await Promise.all([
        adminService.getStats(),
        adminService.getAllBookings()
      ]);

      if (statsRes.data?.stats) {
        setStats(statsRes.data.stats);
        setRevenueByMovie(statsRes.data.revenueByMovie || []);
        setRecentBookings(statsRes.data.recentBookings || []);
      }

      if (bookingsRes.data?.bookings) {
        setAllBookings(bookingsRes.data.bookings);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
      toast.error('Unable to fetch admin dashboard telemetry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const filteredBookings = allBookings.filter((b) => {
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    const matchesSearch =
      !searchTerm ||
      b.bookingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.movie?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return <LoadingSpinner message="Aggregating cinema operations telemetry..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Executive Admin Console
            </span>
          </div>
          <h1 className="text-3xl font-black text-white">IMovies Management Suite</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time box office analytics, booking tracking, and inventory management.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAdminData}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition-all shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh Telemetry
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Revenue */}
        <div className="bg-[#121824] rounded-2xl border border-slate-800/90 p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Gross</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            ₹{stats?.totalRevenue ? stats.totalRevenue.toLocaleString() : '0.00'}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Live settlement active</span>
          </div>
        </div>

        {/* Card 2: Tickets Sold */}
        <div className="bg-[#121824] rounded-2xl border border-slate-800/90 p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Tickets Issued</span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Ticket className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {stats?.totalTicketsSold || 0}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Across <span className="text-slate-200 font-bold">{stats?.totalBookings || 0}</span> confirmed transactions
          </div>
        </div>

        {/* Card 3: Catalog Size */}
        <div className="bg-[#121824] rounded-2xl border border-slate-800/90 p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Screening Catalog</span>
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Film className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {stats?.totalMovies || 0}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            In <span className="text-slate-200 font-bold">{stats?.totalTheaters || 0}</span> multiplexes • {stats?.totalShows || 0} active shows
          </div>
        </div>

        {/* Card 4: Customers */}
        <div className="bg-[#121824] rounded-2xl border border-slate-800/90 p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Customer Base</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {stats?.totalUsers || 0}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Verified moviegoers enrolled
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'overview'
              ? 'border-rose-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Analytics & Top Grossing
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'bookings'
              ? 'border-rose-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Master Bookings Directory ({allBookings.length})
        </button>
      </div>

      {/* Content based on Active Tab */}
      {activeTab === 'overview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Grossing Movies (2 Cols) */}
          <div className="lg:col-span-2 bg-[#121824] rounded-2xl border border-slate-800 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">Box Office Leaders</h3>
                <p className="text-xs text-slate-400">Ranked by verified ticket sales revenue</p>
              </div>
              <span className="text-xs text-rose-400 font-bold">Top 5 Titles</span>
            </div>

            <div className="space-y-4">
              {revenueByMovie.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-400">
                  No revenue records found yet. Book tickets to generate analytics!
                </div>
              ) : (
                revenueByMovie.map((item, idx) => {
                  const maxRevenue = revenueByMovie[0]?.totalRevenue || 1;
                  const percentage = Math.round((item.totalRevenue / maxRevenue) * 100);

                  return (
                    <div
                      key={item.title || idx}
                      className="bg-[#0A0D14] p-4 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-black text-slate-600 w-5">#{idx + 1}</span>
                        {item.posterUrl && (
                          <img
                            src={item.posterUrl}
                            alt={item.title}
                            className="w-10 h-14 object-cover rounded-lg border border-slate-800"
                          />
                        )}
                        <div className="flex-grow min-w-0">
                          <h4 className="text-sm font-bold text-white truncate">{item.title}</h4>
                          <p className="text-xs text-slate-400">
                            {item.ticketsSold} tickets sold
                          </p>
                          {/* Progress bar */}
                          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                            <div
                              className="bg-rose-500 h-1.5 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-black text-emerald-400">
                            ₹{item.totalRevenue?.toFixed(2)}
                          </div>
                          <div className="text-[10px] text-slate-500 font-semibold">{percentage}% of top</div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Recent Live Feed (1 Col) */}
          <div className="bg-[#121824] rounded-2xl border border-slate-800 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">Recent Transactions</h3>
                <p className="text-xs text-slate-400">Latest customer ticket purchases</p>
              </div>
              <Clock className="w-4 h-4 text-slate-500" />
            </div>

            <div className="space-y-3">
              {recentBookings.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-400">
                  No bookings registered yet.
                </div>
              ) : (
                recentBookings.slice(0, 6).map((b) => (
                  <div
                    key={b._id}
                    className="p-3 bg-[#0A0D14] rounded-xl border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-slate-200 truncate">{b.movie?.title}</div>
                      <div className="text-slate-400 text-[11px] truncate">
                        {b.user?.name} • {b.theater?.name}
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <span className="font-bold text-emerald-400 block">₹{b.grandTotal?.toFixed(2)}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          b.status === 'CONFIRMED'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-rose-500/10 text-rose-400'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Bookings Master Table */
        <div className="bg-[#121824] rounded-2xl border border-slate-800 p-6 space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {['All', 'CONFIRMED', 'CANCELLED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    statusFilter === st
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search ID, customer or movie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0A0D14] border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0A0D14] text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Movie & Showtime</th>
                  <th className="py-3 px-4">Seats</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-500">
                      No matching records found.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-rose-400">
                        {b.bookingId}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-200">{b.user?.name || 'Guest'}</div>
                        <div className="text-[11px] text-slate-500">{b.user?.email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-200">{b.movie?.title}</div>
                        <div className="text-[11px] text-slate-400">
                          {b.theater?.name} • {b.show?.showTime}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {b.seats?.map((seat) => (
                            <span
                              key={seat}
                              className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]"
                            >
                              {seat}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-200">
                        ₹{b.grandTotal?.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            b.status === 'CONFIRMED'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {b.status === 'CONFIRMED' ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
import Booking from '../models/Booking.js';
import Movie from '../models/Movie.js';
import Theater from '../models/Theater.js';
import Show from '../models/Show.js';
import User from '../models/User.js';

// @desc    Get Admin Dashboard summary stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalMovies = await Movie.countDocuments();
    const totalTheaters = await Theater.countDocuments();
    const totalShows = await Show.countDocuments();

    // Financial calculations from confirmed bookings
    const confirmedBookings = await Booking.find({ status: 'CONFIRMED' });
    const totalRevenue = confirmedBookings.reduce((acc, curr) => acc + (curr.grandTotal || 0), 0);
    const totalTicketsSold = confirmedBookings.reduce((acc, curr) => acc + (curr.ticketCount || 0), 0);
    const totalBookingsCount = await Booking.countDocuments();

    // Recent 10 bookings
    const recentBookings = await Booking.find()
      .populate('user', 'name email')
      .populate('movie', 'title posterUrl')
      .populate('theater', 'name city')
      .sort({ createdAt: -1 })
      .limit(10);

    // Group revenue by movie
    const revenueByMovie = await Booking.aggregate([
      { $match: { status: 'CONFIRMED' } },
      {
        $group: {
          _id: '$movie',
          totalRevenue: { $sum: '$grandTotal' },
          ticketsSold: { $sum: '$ticketCount' }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'movies',
          localField: '_id',
          foreignField: '_id',
          as: 'movieDetails'
        }
      },
      { $unwind: '$movieDetails' },
      {
        $project: {
          title: '$movieDetails.title',
          posterUrl: '$movieDetails.posterUrl',
          totalRevenue: 1,
          ticketsSold: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalRevenue: Number(totalRevenue.toFixed(2)),
        totalTicketsSold,
        totalBookings: totalBookingsCount,
        totalMovies,
        totalTheaters,
        totalShows,
        totalUsers
      },
      revenueByMovie,
      recentBookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin View)
// @route   GET /api/admin/bookings
// @access  Private/Admin
export const getAllBookings = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { bookingId: { $regex: search, $options: 'i' } }
      ];
    }

    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .populate('movie', 'title posterUrl')
      .populate('theater', 'name city')
      .populate('show', 'showDate showTime screenNumber')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    next(error);
  }
};

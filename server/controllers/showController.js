import Show from '../models/Show.js';
import Movie from '../models/Movie.js';
import Theater from '../models/Theater.js';

// Helper: Generate default seats layout
export const generateSeatLayout = (pricing = { regular: 220, premium: 350, vip: 550 }) => {
  const seats = [];
  const rowsConfig = [
    { row: 'A', type: 'vip', price: pricing.vip || 550 },
    { row: 'B', type: 'vip', price: pricing.vip || 550 },
    { row: 'C', type: 'premium', price: pricing.premium || 350 },
    { row: 'D', type: 'premium', price: pricing.premium || 350 },
    { row: 'E', type: 'premium', price: pricing.premium || 350 },
    { row: 'F', type: 'premium', price: pricing.premium || 350 },
    { row: 'G', type: 'regular', price: pricing.regular || 220 },
    { row: 'H', type: 'regular', price: pricing.regular || 220 }
  ];

  rowsConfig.forEach(({ row, type, price }) => {
    for (let col = 1; col <= 8; col++) {
      seats.push({
        seatNumber: `${row}${col}`,
        row,
        col,
        type,
        price,
        isBooked: false,
        bookedBy: null
      });
    }
  });

  return seats;
};

// @desc    Get shows with filtering
// @route   GET /api/shows
// @access  Public
export const getShows = async (req, res, next) => {
  try {
    const { movieId, theaterId, date, city } = req.query;
    let query = {};

    if (movieId) query.movie = movieId;
    if (theaterId) query.theater = theaterId;

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      query.showDate = { $gte: startOfDay, $lte: endOfDay };
    }

    let showsQuery = Show.find(query)
      .populate('movie', 'title posterUrl duration rating genre language certification')
      .populate('theater', 'name city address facilities screens')
      .sort({ showDate: 1, showTime: 1 });

    const shows = await showsQuery;

    // Filter by theater city in-memory if city specified
    let filteredShows = shows;
    if (city && city !== 'All') {
      filteredShows = shows.filter(
        (show) => show.theater && show.theater.city.toLowerCase() === city.toLowerCase()
      );
    }

    res.status(200).json({
      success: true,
      count: filteredShows.length,
      shows: filteredShows
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get show by ID (including real-time seat map)
// @route   GET /api/shows/:id
// @access  Public
export const getShowById = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movie')
      .populate('theater');

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found'
      });
    }

    // Calculate available count
    const totalSeats = show.seats.length;
    const bookedSeats = show.seats.filter((s) => s.isBooked).length;
    const availableSeats = totalSeats - bookedSeats;

    res.status(200).json({
      success: true,
      show,
      seatStats: {
        total: totalSeats,
        booked: bookedSeats,
        available: availableSeats
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a show
// @route   POST /api/shows
// @access  Private/Admin
export const createShow = async (req, res, next) => {
  try {
    const { movie, theater, screenNumber, showDate, showTime, pricing } = req.body;

    if (!movie || !theater || !showDate || !showTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide movie, theater, showDate, and showTime'
      });
    }

    const customPricing = pricing || { regular: 12, premium: 18, vip: 25 };
    const seats = generateSeatLayout(customPricing);

    const show = await Show.create({
      movie,
      theater,
      screenNumber: screenNumber || 1,
      showDate: new Date(showDate),
      showTime,
      pricing: customPricing,
      seats
    });

    const populatedShow = await Show.findById(show._id)
      .populate('movie', 'title posterUrl')
      .populate('theater', 'name city');

    res.status(201).json({
      success: true,
      message: 'Show scheduled successfully',
      show: populatedShow
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a show
// @route   PUT /api/shows/:id
// @access  Private/Admin
export const updateShow = async (req, res, next) => {
  try {
    const { movie, theater, screenNumber, showDate, showTime, pricing } = req.body;
    const show = await Show.findById(req.params.id);

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found'
      });
    }

    if (movie) show.movie = movie;
    if (theater) show.theater = theater;
    if (screenNumber) show.screenNumber = screenNumber;
    if (showDate) show.showDate = new Date(showDate);
    if (showTime) show.showTime = showTime;
    if (pricing) show.pricing = pricing;

    const updatedShow = await show.save();

    res.status(200).json({
      success: true,
      message: 'Show updated successfully',
      show: updatedShow
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a show
// @route   DELETE /api/shows/:id
// @access  Private/Admin
export const deleteShow = async (req, res, next) => {
  try {
    const show = await Show.findByIdAndDelete(req.params.id);

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Show cancelled and deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

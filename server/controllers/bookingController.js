import Booking from '../models/Booking.js';
import Show from '../models/Show.js';

// @desc    Create a new movie ticket booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res, next) => {
  try {
    const { showId, selectedSeats, paymentMethod, paymentDetails } = req.body;

    if (!showId || !selectedSeats || !Array.isArray(selectedSeats) || selectedSeats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please select at least one seat to proceed'
      });
    }

    // Fetch the show with its seat details
    const show = await Show.findById(showId).populate('movie').populate('theater');

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'The requested show was not found'
      });
    }

    // Check for seat conflicts / double booking
    const unavailableSeats = [];
    const seatDetails = [];
    let ticketSubtotal = 0;

    for (const seatNum of selectedSeats) {
      const seatObj = show.seats.find((s) => s.seatNumber === seatNum);

      if (!seatObj) {
        return res.status(400).json({
          success: false,
          message: `Seat ${seatNum} is not valid for this screen layout`
        });
      }

      if (seatObj.isBooked) {
        unavailableSeats.push(seatNum);
      } else {
        seatDetails.push({
          seatNumber: seatObj.seatNumber,
          type: seatObj.type,
          price: seatObj.price
        });
        ticketSubtotal += seatObj.price;
      }
    }

    if (unavailableSeats.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Oops! Seat(s) ${unavailableSeats.join(', ')} were just booked by another customer. Please select different seats.`,
        unavailableSeats
      });
    }

    // Calculate fees and grand total (Indian Cinema GST & convenience fee)
    const ticketCount = selectedSeats.length;
    const convenienceFee = Number((25.0 * ticketCount).toFixed(2)); // ₹25 per ticket
    const tax = Number(((ticketSubtotal + convenienceFee) * 0.18).toFixed(2)); // 18% GST
    const grandTotal = Number((ticketSubtotal + convenienceFee + tax).toFixed(2));

    // Atomically mark seats as booked in Show
    selectedSeats.forEach((seatNum) => {
      const seatObj = show.seats.find((s) => s.seatNumber === seatNum);
      if (seatObj) {
        seatObj.isBooked = true;
        seatObj.bookedBy = req.user._id;
      }
    });

    await show.save();

    // Generate unique booking ID
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `IMV-${Date.now().toString().slice(-6)}-${randomDigits}`;

    // Generate QR payload string
    const qrCodeData = JSON.stringify({
      bookingId,
      movie: show.movie.title,
      theater: show.theater.name,
      screen: show.screenNumber,
      date: new Date(show.showDate).toLocaleDateString(),
      time: show.showTime,
      seats: selectedSeats,
      total: grandTotal
    });

    // Create Booking record
    const booking = await Booking.create({
      bookingId,
      user: req.user._id,
      show: show._id,
      movie: show.movie._id,
      theater: show.theater._id,
      seats: selectedSeats,
      seatDetails,
      ticketCount,
      ticketSubtotal,
      convenienceFee,
      tax,
      grandTotal,
      paymentStatus: 'PAID',
      paymentMethod: paymentMethod || 'Credit Card',
      paymentDetails: {
        transactionId: paymentDetails?.transactionId || `TXN-${Date.now()}`,
        cardLast4: paymentDetails?.cardLast4 || '4242'
      },
      status: 'CONFIRMED',
      qrCodeData
    });

    // Populate the created booking for rich client response
    const populatedBooking = await Booking.findById(booking._id)
      .populate('movie')
      .populate('theater')
      .populate('show')
      .populate('user', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Tickets booked successfully! Enjoy your movie.',
      booking: populatedBooking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
export const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('movie', 'title posterUrl duration genre rating')
      .populate('theater', 'name city address')
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

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('movie')
      .populate('theater')
      .populate('show')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Ensure authorized user or admin
    if (
      booking.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.status(200).json({
      success: true,
      booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking and release seats
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Only owner or admin can cancel
    if (
      booking.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    if (booking.status === 'CANCELLED') {
      return res.status(400).json({
        success: false,
        message: 'This booking has already been cancelled'
      });
    }

    // Release seats in the show
    const show = await Show.findById(booking.show);
    if (show) {
      booking.seats.forEach((seatNum) => {
        const seatObj = show.seats.find((s) => s.seatNumber === seatNum);
        if (seatObj) {
          seatObj.isBooked = false;
          seatObj.bookedBy = null;
        }
      });
      await show.save();
    }

    // Update booking status
    booking.status = 'CANCELLED';
    booking.paymentStatus = 'REFUNDED';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully. Seats have been released and refund initiated.',
      booking
    });
  } catch (error) {
    next(error);
  }
};

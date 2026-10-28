import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show',
      required: true
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true
    },
    theater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theater',
      required: true
    },
    seats: [
      {
        type: String,
        required: true
      }
    ],
    seatDetails: [
      {
        seatNumber: String,
        type: { type: String },
        price: Number
      }
    ],
    ticketCount: {
      type: Number,
      required: true
    },
    ticketSubtotal: {
      type: Number,
      required: true
    },
    convenienceFee: {
      type: Number,
      default: 2.5
    },
    tax: {
      type: Number,
      default: 1.5
    },
    grandTotal: {
      type: Number,
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['PAID', 'PENDING', 'FAILED', 'REFUNDED'],
      default: 'PAID'
    },
    paymentMethod: {
      type: String,
      default: 'Credit Card'
    },
    paymentDetails: {
      transactionId: { type: String, default: () => `TXN-${Date.now()}` },
      cardLast4: { type: String, default: '4242' }
    },
    status: {
      type: String,
      enum: ['CONFIRMED', 'CANCELLED'],
      default: 'CONFIRMED'
    },
    bookingDate: {
      type: Date,
      default: Date.now
    },
    qrCodeData: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;

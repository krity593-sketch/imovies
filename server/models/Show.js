import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  seatNumber: {
    type: String,
    required: true
  },
  row: {
    type: String,
    required: true
  },
  col: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['regular', 'premium', 'vip'],
    default: 'regular'
  },
  price: {
    type: Number,
    required: true
  },
  isBooked: {
    type: Boolean,
    default: false
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
});

const showSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Movie reference is required']
    },
    theater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theater',
      required: [true, 'Theater reference is required']
    },
    screenNumber: {
      type: Number,
      default: 1
    },
    showDate: {
      type: Date,
      required: [true, 'Show date is required']
    },
    showTime: {
      type: String,
      required: [true, 'Show time is required'] // e.g., '10:00 AM', '02:30 PM', '06:45 PM', '10:15 PM'
    },
    pricing: {
      regular: { type: Number, default: 12 },
      premium: { type: Number, default: 18 },
      vip: { type: Number, default: 25 }
    },
    seats: [seatSchema]
  },
  {
    timestamps: true
  }
);

// Index for quick queries
showSchema.index({ movie: 1, theater: 1, showDate: 1 });

const Show = mongoose.model('Show', showSchema);
export default Show;

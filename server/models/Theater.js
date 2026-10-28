import mongoose from 'mongoose';

const screenSchema = new mongoose.Schema({
  screenNumber: {
    type: Number,
    required: true
  },
  screenName: {
    type: String,
    default: 'Screen 1'
  },
  totalSeats: {
    type: Number,
    default: 64
  }
});

const theaterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Theater name is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      index: true
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
    screens: [screenSchema],
    facilities: {
      type: [String],
      default: ['Dolby Atmos', '4K Projection', 'Food & Beverages', 'Recliner Seats', 'Wheelchair Access']
    },
    phone: {
      type: String,
      default: '+1 800-555-FILM'
    }
  },
  {
    timestamps: true
  }
);

const Theater = mongoose.model('Theater', theaterSchema);
export default Theater;

import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Movie description is required'],
      trim: true
    },
    genre: {
      type: [String],
      required: [true, 'At least one genre is required']
    },
    language: {
      type: [String],
      required: [true, 'At least one language is required']
    },
    duration: {
      type: Number, // in minutes
      required: [true, 'Duration in minutes is required']
    },
    releaseDate: {
      type: Date,
      required: [true, 'Release date is required']
    },
    rating: {
      type: Number,
      default: 8.0,
      min: 0,
      max: 10
    },
    votesCount: {
      type: Number,
      default: 1200
    },
    posterUrl: {
      type: String,
      required: [true, 'Poster image URL is required']
    },
    bannerUrl: {
      type: String,
      required: [true, 'Banner landscape image URL is required']
    },
    trailerUrl: {
      type: String,
      default: 'https://www.youtube.com/watch?v=YoHD9XEInc0'
    },
    status: {
      type: String,
      enum: ['NOW_SHOWING', 'COMING_SOON'],
      default: 'NOW_SHOWING'
    },
    director: {
      type: String,
      default: 'Christopher Nolan'
    },
    cast: {
      type: [String],
      default: []
    },
    certification: {
      type: String,
      enum: ['U', 'UA', 'A', 'PG', 'PG-13', 'R'],
      default: 'UA'
    }
  },
  {
    timestamps: true
  }
);

const Movie = mongoose.model('Movie', movieSchema);
export default Movie;

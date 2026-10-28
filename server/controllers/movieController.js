import Movie from '../models/Movie.js';
import Show from '../models/Show.js';

// @desc    Get all movies with filters & search
// @route   GET /api/movies
// @access  Public
export const getMovies = async (req, res, next) => {
  try {
    const { search, genre, language, status, sort } = req.query;
    let query = {};

    // Search by title or description or cast
    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { director: { $regex: search.trim(), $options: 'i' } },
        { cast: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    // Filter by genre
    if (genre && genre !== 'All') {
      query.genre = { $in: [new RegExp(genre, 'i')] };
    }

    // Filter by language
    if (language && language !== 'All') {
      query.language = { $in: [new RegExp(language, 'i')] };
    }

    // Filter by status (NOW_SHOWING / COMING_SOON)
    if (status && status !== 'All') {
      query.status = status;
    }

    // Sort options
    let sortOptions = { releaseDate: -1 };
    if (sort === 'rating') {
      sortOptions = { rating: -1 };
    } else if (sort === 'title') {
      sortOptions = { title: 1 };
    } else if (sort === 'newest') {
      sortOptions = { releaseDate: -1 };
    }

    const movies = await Movie.find(query).sort(sortOptions);

    res.status(200).json({
      success: true,
      count: movies.length,
      movies
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured movies for hero banners
// @route   GET /api/movies/featured
// @access  Public
export const getFeaturedMovies = async (req, res, next) => {
  try {
    const featured = await Movie.find({ status: 'NOW_SHOWING' })
      .sort({ rating: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      movies: featured
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single movie by ID with upcoming shows
// @route   GET /api/movies/:id
// @access  Public
export const getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    // Also fetch shows for this movie
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const shows = await Show.find({
      movie: movie._id,
      showDate: { $gte: today }
    })
      .populate('theater', 'name city address facilities')
      .sort({ showDate: 1, showTime: 1 });

    res.status(200).json({
      success: true,
      movie,
      shows
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new movie
// @route   POST /api/movies
// @access  Private/Admin
export const createMovie = async (req, res, next) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Movie added successfully',
      movie
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a movie
// @route   PUT /api/movies/:id
// @access  Private/Admin
export const updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Movie updated successfully',
      movie
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a movie
// @route   DELETE /api/movies/:id
// @access  Private/Admin
export const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    // Cascade delete any scheduled shows for this movie
    await Show.deleteMany({ movie: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Movie and associated shows deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

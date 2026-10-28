import Theater from '../models/Theater.js';
import Show from '../models/Show.js';

// @desc    Get all theaters (optional filter by city)
// @route   GET /api/theaters
// @access  Public
export const getTheaters = async (req, res, next) => {
  try {
    const { city } = req.query;
    let query = {};

    if (city && city !== 'All') {
      query.city = { $regex: new RegExp(`^${city.trim()}$`, 'i') };
    }

    const theaters = await Theater.find(query).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: theaters.length,
      theaters
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get list of unique theater cities
// @route   GET /api/theaters/cities
// @access  Public
export const getCities = async (req, res, next) => {
  try {
    const cities = await Theater.distinct('city');
    res.status(200).json({
      success: true,
      cities: cities.sort()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single theater by ID with its shows
// @route   GET /api/theaters/:id
// @access  Public
export const getTheaterById = async (req, res, next) => {
  try {
    const theater = await Theater.findById(req.params.id);

    if (!theater) {
      return res.status(404).json({
        success: false,
        message: 'Theater not found'
      });
    }

    // Today onwards
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const shows = await Show.find({
      theater: theater._id,
      showDate: { $gte: today }
    })
      .populate('movie', 'title posterUrl duration rating genre')
      .sort({ showDate: 1, showTime: 1 });

    res.status(200).json({
      success: true,
      theater,
      shows
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a theater
// @route   POST /api/theaters
// @access  Private/Admin
export const createTheater = async (req, res, next) => {
  try {
    const theater = await Theater.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Theater created successfully',
      theater
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a theater
// @route   PUT /api/theaters/:id
// @access  Private/Admin
export const updateTheater = async (req, res, next) => {
  try {
    const theater = await Theater.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!theater) {
      return res.status(404).json({
        success: false,
        message: 'Theater not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Theater updated successfully',
      theater
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a theater
// @route   DELETE /api/theaters/:id
// @access  Private/Admin
export const deleteTheater = async (req, res, next) => {
  try {
    const theater = await Theater.findByIdAndDelete(req.params.id);

    if (!theater) {
      return res.status(404).json({
        success: false,
        message: 'Theater not found'
      });
    }

    // Delete associated shows
    await Show.deleteMany({ theater: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Theater and associated shows deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

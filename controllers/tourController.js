/* eslint-disable no-unused-vars */
const Tour = require('../models/tourModel');
const { APIFeatures } = require('../utils/apiFeatures');

//Express Middleware
const aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

const getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    let tours = await features.documentQuery;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

const getTourById = async (req, res) => {
  const { id } = req.params;

  try {
    const tour = await Tour.findById(id);

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

const createTour = async (req, res) => {
  try {
    const newTour = req.body;
    const createdTour = await Tour.create(newTour);

    res.status(201).json({
      status: 'success',
      data: {
        tour: createdTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

const updatedTour = async (req, res) => {
  const { id } = req.params;
  const updatedValues = req.body;

  try {
    const updatedTour = await Tour.findByIdAndUpdate(id, updatedValues, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour: updatedTour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid data sent.',
    });
  }
};

const deleteTour = async (req, res) => {
  const { id } = req.params;
  try {
    await Tour.findByIdAndDelete(id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

const getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: {
          ratingsAverage: { $gte: 4.5 },
        },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: -1 },
      },
    ]);

    res.status(200).json({
      status: 'success',
      results: stats.length,
      data: {
        stats,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

const getMonthlyPlan = async (req, res) => {
  try {
    const year = +req.params.year;

    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: {
            $month: '$startDates',
          },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: { month: '$_id' },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { numTourStarts: -1 },
      },
      {
        $limit: 12,
      },
    ]);

    res.status(200).json({
      status: 'success',
      results: plan.length,
      data: {
        plan,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

module.exports = {
  aliasTopTours,
  getAllTours,
  getTourById,
  createTour,
  updatedTour,
  deleteTour,
  getTourStats,
  getMonthlyPlan,
};

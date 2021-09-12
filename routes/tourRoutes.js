const express = require('express');
const router = express.Router();

const {
  aliasTopTours,
  getAllTours,
  getTourById,
  createTour,
  updatedTour,
  deleteTour,
  getTourStats,
  getMonthlyPlan,
} = require('../controllers/tourController');

// router.param('id', checkId);

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);
router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTourById).patch(updatedTour).delete(deleteTour);

module.exports = router;

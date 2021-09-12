/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

//Document Model
const tourSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
      unique: true,
      trim: true,
      minLength: [10, 'The tour name must be at least 10 characters long.'],
      maxLength: [40, 'The tour name must be at least 10 characters long.'],
      // validate: [
      //   validator.isAlpha,
      //   'Tour name must contain onyl alpha characters.',
      // ],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration.'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size.'],
    },
    difficulty: {
      type: String,
      require: [true, 'A tour must have a difficulty.'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be bellow 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      required: [true, 'A price must be present for a tour.'],
      type: Number,
    },
    discount: {
      type: Number,
      validate: {
        message: `The discount ({VALUE}) must be below the regular price`,
        validator: function (value) {
          //This will only work when creating a new document, and not on updating.
          return this.price > value;
        },
      },
    },
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      require: [true, 'A tour must have a cover image.'],
    },
    images: [String],
    createdAt: {
      select: false,
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Virtual properties
tourSchema.virtual('durationWeeks').get(function () {
  return (this.duration / 7).toFixed(1);
});

//Document Middlewares : runs before the document is saved or created || insertMany() will not trigger this event
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//Document Middlewares : runs after the document is saved or created
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

//Query Middleware
//This function will be triggered by any query method that starts with 'find'
// tourSchema.pre('find', function (next) {
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

// tourSchema.post(/^find/, function (doc, next) {
//   console.log(doc);
//   next();
// });

//Aggregation middleware
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({
    $match: { secretTour: { $ne: true } },
  });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

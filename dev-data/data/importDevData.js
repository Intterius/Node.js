/* eslint-disable no-unused-vars */
const dotenv = require('dotenv');
const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('../../models/tourModel');
dotenv.config({ path: './config.env' });

const db = process.env.DATABASE;

mongoose.connect(db, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded.');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Successfully deleted data.');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

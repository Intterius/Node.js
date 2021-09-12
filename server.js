const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

const app = require('./app');
const db = process.env.DATABASE;

mongoose.connect(db, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Listening to port 3000...');

});

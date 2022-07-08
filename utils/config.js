/* eslint-disable operator-linebreak */
/* eslint-disable indent */
require('dotenv').config();

const { PORT } = process.env;

console.log(PORT);

const MONGODB_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

module.exports = {
  MONGODB_URI,
  PORT,
};

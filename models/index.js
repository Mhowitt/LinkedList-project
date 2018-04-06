const mongoose = require('mongoose');

mongoose.Promise = Promise;
mongoose.set('debug', true);
mongoose
  .connect('mongodb://localhost/linkedlist')
  .then(() => console.log('successfully connected to database'))
  .catch(err => console.log(err));

exports.User = require('./user');
exports.Company = require('./company');
exports.Job = require('./job');

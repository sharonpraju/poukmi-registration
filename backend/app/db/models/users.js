const mongoose = require('mongoose');

const users = new mongoose.Schema({
  first_name: { type: 'string', required: true },
  last_name: 'string',
  email: { type: 'string', required: true, unique: true },
  password: { type: 'string', required: true },
  type: { type: 'string', required: true },
  status: { type: 'string', required: true },
  added_on: 'string',
  added_by: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  updated_on: 'string',
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  deleted_on: 'string',
  deleted_by: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
})

module.exports = mongoose.model('users', users);
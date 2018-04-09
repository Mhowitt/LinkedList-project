const { User } = require('../models');
const { userSchema, userUpdateSchema } = require('../schemas');
const Validator = require('jsonschema').Validator;
const validator = new Validator();

function createUser(req, res, next) {
  const result = validator.validate(req.body, userSchema);
  if (!result.valid) {
    const errors = result.errors.map(error => error.message).join(', ');
    return next({ message: errors });
  }
  return User.createUser(new User(req.body))
    .then(user => res.status(201).json({ data: user }))
    .catch(err => res.json(err.message));
}

function readUsers(req, res, next) {
  return User.find().then(users => res.json({ data: users }));
}

function renderNewUserForm(req, res, next) {
  res.json({ message: 'New user form successfully rendered' });
}

function readUser(req, res, next) {
  return User.findOne({ username: req.params.username })
    .populate('currentCompanyId')
    .exec()
    .then(user => {
      if (!user) {
        return res.status(404).json({
          message: `User ${req.params.username} not found.`
        });
      }
      return res.json({ data: user });
    })
    .catch(err => res.json(err.message));
}

function updateUser(req, res, next) {
  const result = validator.validate(req.body, userUpdateSchema);
  if (!result.valid) {
    const errors = result.errors.map(error => error.message).join(', ');
    return next({ message: errors });
  }
  return User.updateUser(req.params.username, req.body)
    .then(user => res.json({ data: user }))
    .catch(err => res.json(err.message));
}

function deleteUser(req, res, next) {
  return User.deleteUser(req.params.username)
    .then(() => res.json({ message: 'User successfully deleted' }))
    .catch(err => res.json(err.message));
}

function renderEditUserForm(req, res, next) {
  return res.json({ message: 'userForm successfully brought' });
}

module.exports = {
  renderNewUserForm,
  createUser,
  readUsers,
  readUser,
  renderEditUserForm,
  updateUser,
  deleteUser
};

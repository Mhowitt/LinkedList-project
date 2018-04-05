const { User } = require("../models");
const Validator = require("jsonschema").Validator;
const v = new Validator();
const { newUserSchema } = require("../schemas");

function createUser(req, res, next) {
  const result = v.validate(req.body, newUserSchema);
  if (!result.valid) {
    const errors = result.errors.map(e => e.message).join(", ");
    return next({ message: errors });
  }
  User.createUser(new User(req.body))
    .then(user => {
      return res.status(201).json(user);
    })
    .catch(err => next(err));
}

function readUsers(req, res, next) {
  return User.find().then(users => {
    return res.json(users);
  });
}

function newUserForm(req, res, next) {
  res.json({ message: "userForm successfully brought" });
}

function readUser(req, res, next) {
  //Checked
  return User.findById(req.params.userId)
    .populate("currentCompany")
    .exec()
    .then(user => {
      if (!user) {
        return res
          .status(404)
          .json({ message: `User ${req.params.userId} not found.` });
      }
      return res.json({ data: user });
    })
    .catch(err => {
      return res.json(err);
    });
}

function updateUser(req, res, next) {
  return User.findByIdAndUpdate(req.params.userId, req.body, {
    new: true
  }).then(user => res.json({ data: user }));
}

function deleteUser(req, res, next) {
  return User.findByIdAndRemove(req.params.userId).then(() => {
    return res.json({ message: "User successfully deleted" });
  });
}

function editUserForm(req, res, next) {
  return res.json({ message: "userForm successfully brought" });
}

module.exports = {
  createUser,
  readUsers,
  readUser,
  newUserForm,
  updateUser,
  deleteUser,
  editUserForm
};

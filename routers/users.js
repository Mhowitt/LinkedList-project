const express = require("express");
const router = express.Router();
const { users, auth } = require("../handlers");

const {
  renderNewUserForm,
  createUser,
  readUsers,
  readUser,
  renderEditUserForm,
  updateUser,
  deleteUser
} = users;

con;

router
  .route("")
  .get(readUsers)
  .post(createUser);

router.route("/new").get(renderNewUserForm);

router
  .route("/:username")
  .get(auth.tokenRequired, readUser)
  .patch(auth.ensureCorrectUser, updateUser)
  .delete(auth.ensureCorrectUser, deleteUser);

router.route("/:username/edit").get(auth.ensureCorrectUser, renderEditUserForm);

module.exports = router;

const express = require("express");
const router = express.Router();

const { users } = require("../handlers");

router
  .route("")
  .get(users.readUsers)
  .post(users.createUser);

router.route("/new").get(users.newUserForm);

router
  .route("/:userId")
  .get(users.readUser)
  .patch(users.updateUser)
  .delete(users.deleteUser);

router.route("/:userId/edit").get(users.editUserForm);

module.exports = router;

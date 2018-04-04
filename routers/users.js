const express = require("express");
const router = express.Router();

const { users } = require("../handers");

router
  .route("")
  .get(users.readUsers)
  .post(users.createUser);

router.get("/new").get(users.newUserForm);

router
  .route("/:userId")
  .get(users.readUser)
  .patch(users.updateUser)
  .delete(users.deleteUser);

router.route("/:userId/edit").get(users.editUser);

module.exports = router;

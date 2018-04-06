const express = require('express');
const router = express.Router();
const { users } = require('../handlers');
const {
  renderNewUserForm,
  createUser,
  readUsers,
  readUser,
  renderEditUserForm,
  updateUser,
  deleteUser
} = users;

router
  .route('')
  .get(readUsers)
  .post(createUser);

router.route('/new').get(renderNewUserForm);

router
  .route('/:username')
  .get(readUser)
  .patch(updateUser)
  .delete(deleteUser);

router.route('/:username/edit').get(renderEditUserForm);

module.exports = router;

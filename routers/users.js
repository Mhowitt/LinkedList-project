const express = require('express');
const router = express.Router();
const { users, auth } = require('../handlers');

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
  .get(auth.tokenRequired, readUsers)
  .post(createUser);

router.route('/new').get(renderNewUserForm);

router
  .route('/:username')
  .get(auth.tokenRequired, readUser)
  .patch(auth.tokenRequired, auth.ensureCorrectUser, updateUser)
  .delete(auth.tokenRequired, auth.ensureCorrectUser, deleteUser);

router
  .route('/:username/edit')
  .get(auth.tokenRequired, auth.ensureCorrectUser, renderEditUserForm);

module.exports = router;

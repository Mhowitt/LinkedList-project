const express = require('express');
const router = express.Router();
const { auth } = require('../handlers');

router.route('').post(auth.loginUser);

module.exports = router;

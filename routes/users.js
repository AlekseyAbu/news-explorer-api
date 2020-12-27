const router = require('express').Router();

const {
  getUserMe,
} = require('../controllers/users.js');

router.get('/me', getUserMe);

module.exports = router;

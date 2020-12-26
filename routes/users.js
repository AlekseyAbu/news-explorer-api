const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
    getUserMe,
} = require('../controllers/users.js');

router.get('/me', getUserMe);

module.exports = router;
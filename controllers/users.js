require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users.js');
const NotFoundError = require('../erorrs/not-found-err.js');
const ConflictingRequest = require('../erorrs/conflicting-request.js');
const UnauthorizedError = require('../erorrs/unauthorized-error.js');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUserMe = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .orFail(() => {
      throw new NotFoundError('Не найден');
    })
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

const registration = (req, res, next) => {
  const { email } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictingRequest('Пользователь существует');
      }
      return bcrypt.hash(req.body.password, 10);
    })
    .then((hash) => {
      User.create({
        email: req.body.email,
        password: hash,
        name: req.body.name,
      })
        .then((user) => res.send({ email: user.email }));
    })
    .catch((err) => {
      if (err.statusCode === 409) {
        next(new ConflictingRequest('Пользователь существует'));
      }
      next(err);
    });
};

const authorization = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль');
          }
          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: 3600 });
          return res.send({ token });
        })
        .catch(next);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getUserMe,
  registration,
  authorization,
};

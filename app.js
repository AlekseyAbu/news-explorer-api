const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const { celebrate, Joi, errors } = require('celebrate');
const bodyParser = require('body-parser');
const auth = require('./middlewares/auth.js');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const {
  registration,
  authorization,
} = require('./controllers/users.js');

const userRouter = require('./routes/users.js');
const articleRouter = require('./routes/articles.js');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/project-diplom', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

app.use(bodyParser.json());

app.use(requestLogger);

app.post('/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6),
      name: Joi.string().required(),
    })
  }),
  registration);
app.post('/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6),
    })
  }),
  authorization)

app.use('/users', auth, userRouter);
app.use('/articles', auth, articleRouter);

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  console.log(err);
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});



app.listen(PORT, () => {
  console.log('Поехали')
})
const router = require('express').Router();
// eslint-disable-next-line import/no-extraneous-dependencies
const { celebrate, Joi } = require('celebrate');

const {
  getArticles,
  postArticle,
  deleteArticle,
} = require('../controllers/articles.js');

router.get('/', getArticles);
router.post('/',
  celebrate({
    body: Joi.object().keys({
      keyword: Joi.string().required(),
      title: Joi.string().required(),
      text: Joi.string().required(),
      date: Joi.string().required(),
      source: Joi.string().required(),
      link: Joi.string().required().regex(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/),
      image: Joi.string().required().regex(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/),
    }),
  }),
  postArticle);
router.delete('/articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().length(24),
  }),
}), deleteArticle);

module.exports = router;

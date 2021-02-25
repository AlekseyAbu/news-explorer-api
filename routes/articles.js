const router = require('express').Router();
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
      link: Joi.string().required().regex(/https?:\/\/(?:[-\w]+\.)?([-\w]+)\.\w+(?:\.\w+)?\/?.*/i),
      image: Joi.string().required().regex(/https?:\/\/(?:[-\w]+\.)?([-\w]+)\.\w+(?:\.\w+)?\/?.*/i),
    }),
  }),
  postArticle);
router.delete('/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().length(24),
  }),
}), deleteArticle);

module.exports = router;

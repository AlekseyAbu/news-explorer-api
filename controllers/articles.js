const Article = require('../models/article.js');
const NotFoundError = require('../erorrs/not-found-err.js');
const Forbidden = require('../erorrs/forbidden.js');

const getArticles = (req, res) => {
  const { _id } = req.user;
  console.log(_id);
  Article.find({ owner: { _id } })
    .populate('user')
    .then((data) => res.send({
      // eslint-disable-next-line max-len
      keyword: data.keyword, title: data.title, text: data.text, date: data.date, source: data.source, link: data.link, image: data.image,
    }));
};

const postArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  const { _id } = req.user;
  Article.create({
    keyword, title, text, date, source, link, image, owner: { _id },
  })
    .then((data) => res.send({
      // eslint-disable-next-line max-len
      keyword: data.keyword, title: data.title, text: data.text, date: data.date, source: data.source, link: data.link, image: data.image,
    }))
    .catch(next);
};

const deleteArticle = (req, res, next) => {
  const { articleId } = req.params;
  const userId = req.user._id;
  Article.findById(articleId).select('+owner')
    .orFail(() => {
      throw new NotFoundError('Карточка не найдена');
    })
    .then((data) => {
      if (data.owner._id.toString() === userId) {
        Article.findByIdAndRemove({ _id: articleId })
          .then((article) => res.send({
            // eslint-disable-next-line max-len
            keyword: article.keyword, title: article.title, text: article.text, date: article.date, source: article.source, link: article.link, image: article.image,
          }));
      } else {
        throw new Forbidden('Нельзя удалить чужую карточку');
      }
    })
    .catch((err) => {
      console.log(err);
      if (err.statusCode === 404) {
        next(new NotFoundError('Карточка не найдена'));
      }
      next(err);
    });
};

module.exports = {
  getArticles,
  postArticle,
  deleteArticle,
};

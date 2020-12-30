const Article = require('../models/article.js');
const NotFoundError = require('../erorrs/not-found-err.js');
const Forbidden = require('../erorrs/forbidden.js');
const BadRequest = require('../erorrs/bad-request.js');

const getArticles = (req, res, next) => {
  const { _id } = req.user;
  console.log(_id);
  Article.find({ owner: { _id } })
    .populate('user')
    .then((data) => res.send(data))
    .catch(next);
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
      keyword: data.keyword,
      title: data.title,
      text: data.text,
      date: data.date,
      source: data.source,
      link: data.link,
      image: data.image,
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
            keyword: article.keyword,
            title: article.title,
            text: article.text,
            date: article.date,
            source: article.source,
            link: article.link,
            image: article.image,
          }));
      } else {
        throw new Forbidden('Нельзя удалить чужую карточку');
      }
    })
    .catch((err) => {
      console.log(err.kind);
      if (err.statusCode === 404) {
        next(new NotFoundError('Карточка не найдена'));
      }
      if (err.kind === 'ObjectId') {
        next(new BadRequest('Карточки не существует'));
      }
      next(err);
    });
};

module.exports = {
  getArticles,
  postArticle,
  deleteArticle,
};
